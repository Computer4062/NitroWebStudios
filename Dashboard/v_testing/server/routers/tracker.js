import express from 'express';
import { PageVisit } from '../models/visits.js';
import {Stock} from "../models/vehicles.js"

const router = express.Router();

router.get('/user/top-products', async (req, res) => {
    try {
        // 1. Fetch all raw page visit documents targeting inventory routes
        const visits = await PageVisit.find({ path: { $regex: /^\/inventory\// } });

        // 2. Map through each layout record to attach product details
        const enrichedVisits = await Promise.all(visits.map(async (visit) => {
            // Extract the ID portion after /inventory/
            const productIdStr = visit.path.split('/inventory/')[1];

            // If the path doesn't contain a valid 24-character ObjectId string, return raw visit
            if (!productIdStr || productIdStr.length !== 24) {
                return {
                    ...visit.toObject(),
                    name: "Unknown Route",
                    image: null
                };
            }

            // Fetch the core stock properties using the parsed ID string
            const product = await Stock.findById(productIdStr).select('model images').lean();

            // Convert the Mongoose document to a plain JavaScript object so we can append keys
            const rawVisitData = visit.toObject();

            if (product) {
                return {
                    ...rawVisitData, // Spreads all original fields: _id, path, todaysHits, hits, lastVisited
                    name: product.model,
                    image: product.images && product.images ? product.images : null
                };
            }

            // Fallback if the product was deleted from inventory but the visit data still exists
            return {
                ...rawVisitData,
                name: "Deleted Product",
                image: null
            };
        }));

        // 3. Send the full dataset downstream without any filtering or sorting
        res.json(enrichedVisits);

    } catch (err) {
        console.error('Failed to compile enriched product analytics collection:', err);
        res.status(500).json({ error: "Failed to compile product analytics" });
    }
});

export default router;