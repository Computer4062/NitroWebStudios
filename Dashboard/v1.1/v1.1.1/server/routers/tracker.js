import express from 'express';
import { getLiveCount } from '../utils/socket.js';
import { PageVisit } from '../models/visits.js';
import {Vehicle} from "../models/vehicles.js"

const router = express.Router();

router.get('/admin/live-count', (req, res) => {
  res.json({
    activeUsers: getLiveCount(),
    timestamp: new Date().toISOString()
  });
});

router.get('/admin/top-products', async (req, res) => {
    try {
        // 1. Get visits that start with '/inventory/'
        const visits = await PageVisit.find({ path: { $regex: /^\/inventory\// } })
            .sort({ hits: -1 })
            .limit(10);

        // 2. Map through visits to fetch Product details
        const detailedVisits = await Promise.all(visits.map(async (visit) => {
            // Extract the ID (the part after /inventory/)
            const productId = visit.path.split('/inventory/');

            // Only proceed if it looks like a valid MongoDB ObjectId
            if (productId[1] && productId[1].length === 24) {
                const product = await Vehicle.findById(productId[1]).select('model images');

                if (product) {
                    return {
                        name: product.model,
                        image: product.images[0],
                        hits: visit.hits,
                        path: visit.path
                    };
                }
            }
            return null;
        }));

        // Filter out any nulls (visits to deleted products or invalid IDs)
        res.json(detailedVisits.filter(v => v !== null));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to compile product analytics" });
    }
});

// Add this to your analytics routes file
router.post('/admin/reset-product-hits', async (req, res) => {
    try {
        // Only reset paths that start with /inventory/
        await PageVisit.updateMany(
            { path: { $regex: /^\/inventory\// } },
            { $set: { hits: 0 } }
        );
        res.json({ message: "Product visit counts have been reset to 0." });
    } catch (err) {
        res.status(500).json({ error: "Failed to reset counts" });
    }
});

export default router;