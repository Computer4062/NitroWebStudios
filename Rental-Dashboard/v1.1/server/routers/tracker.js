import express from 'express';
import pool from '../db.js' // MySQL pool

const router = express.Router();

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
            if (productId === null) {
                return {
                    ...visit,
                    name: "Unknown Route",
                    image: null
                };
            }

            const product = productsById[productId];

            if (product) {
                return {
                    ...visit, // Spreads all original fields: id, path, todays_hits, hits, last_visited
                    name: product.name,
                    image: product.img && product.img.length > 0 ? product.img : null
                };
            }

            // Fallback if the product was deleted from inventory but the visit data still exists
            return {
                ...visit,
                name: "Deleted Product",
                image: null
            };
        });

        
        const parsedRows = enrichedVisits.map(row => {
            return {
                ...row,
                image: typeof row.image === 'string' ? JSON.parse(row.image) : row.image,
                hits: typeof row.hits === 'string' ? JSON.parse(row.hits) : row.hits,
            };
        });

        // 5. Send the full dataset downstream without any filtering or sorting
        res.json(parsedRows);

    } catch (err) {
        console.error('Failed to compile enriched product analytics collection:', err);
        res.status(500).json({ error: "Failed to compile product analytics" });
    }
});

export default router;