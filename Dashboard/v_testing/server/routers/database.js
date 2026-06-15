import express from 'express'
import {Stock} from "../models/vehicles.js"
import Logger from '../utils/Logger.js';

const router = express.Router();

router.get("/admin/download", async (req, res) => {
    try {
        // 1. Fetch all products
        const stocks = await Stock.find({});

        // 2. Set headers to tell the browser it's a file download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=stock_database_export.json');

        // 3. Log the action (using our new logger!)
        Logger("ADMIN", "DB_DOWNLOAD");

        // 4. Send the data
        res.status(200).send(JSON.stringify(stocks, null, 2));
    } catch (err) {
        res.status(500).send("Export failed");
    }
});

export default router;