import express from 'express';
import pool from '../db.js' // MySQL pool

const router = express.Router();

// Safely normalizes a field into a real array, no matter how many layers
// of JSON stringification it went through (already-parsed array, single
// JSON string, double-encoded string, null/undefined, etc.)
function normalizeJsonArray(rawValue) {
    let value = rawValue;

    for (let i = 0; i < 3 && typeof value === 'string'; i++) {
        try {
            value = JSON.parse(value);
        } catch (e) {
            value = [];
            break;
        }
    }

    return Array.isArray(value) ? value : [];
}

router.get('/user/top-products', async (req, res) => {
    try {
        // 1. Fetch all raw page visit rows targeting inventory routes
        const [visits] = await pool.query(
            "SELECT * FROM page_visits WHERE path LIKE '/inventory/%'"
        );

        // 2. Extract the numeric vehicle ID from each visit's path
        //    (vehicles.id is an INT AUTO_INCREMENT, not a 24-char ObjectId anymore)
        const visitsWithIds = visits.map(visit => {
            const productIdStr = visit.path.split('/inventory/')[1];
            const productId = Number(productIdStr);

            return {
                visit,
                productId: Number.isInteger(productId) && productIdStr !== '' ? productId : null
            };
        });

        // 3. Batch-fetch all matching vehicles in a single query instead of one query per visit
        const validIds = [...new Set(visitsWithIds
            .map(v => v.productId)
            .filter(id => id !== null))];

        let productsById = {};

        if (validIds.length > 0) {
            const [products] = await pool.query(
                `SELECT id, name, img FROM vehicles WHERE id IN (${validIds.map(() => '?').join(',')})`,
                validIds
            );
            productsById = Object.fromEntries(products.map(p => [p.id, p]));
        }

        // 4. Enrich each visit with product details (or fallback info)
        const enrichedVisits = visitsWithIds.map(({ visit, productId }) => {
            // Normalize hits right here, at the source, before anything else touches it
            const normalizedHits = normalizeJsonArray(visit.hits);

            if (productId === null) {
                return {
                    ...visit,
                    hits: normalizedHits,
                    name: "Unknown Route",
                    image: null
                };
            }

            const product = productsById[productId];

            if (product) {
                const normalizedImg = normalizeJsonArray(product.img);

                return {
                    ...visit, // Spreads all original fields: id, path, todays_hits, last_visited
                    hits: normalizedHits,
                    name: product.name,
                    image: normalizedImg.length > 0 ? normalizedImg : null
                };
            }

            // Fallback if the product was deleted from inventory but the visit data still exists
            return {
                ...visit,
                hits: normalizedHits,
                name: "Deleted Product",
                image: null
            };
        });

        // 5. Send the full dataset downstream without any filtering or sorting
        res.json(enrichedVisits);

    } catch (err) {
        console.error('Failed to compile enriched product analytics collection:', err);
        res.status(500).json({ error: "Failed to compile product analytics" });
    }
});

export default router;