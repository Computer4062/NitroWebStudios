import express from 'express'
import pool from '../db.js' // MySQL pool
import Logger from '../utils/Logger.js';

const router = express.Router();

router.get("/admin/download", async (req, res) => {
    try {
        // 1. Fetch all products
        const [vehicles] = await pool.query('SELECT * FROM vehicles');

        // 2. Set headers to tell the browser it's a file download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=vehicles_database_export.json');

        // 3. Log the action
        Logger("ADMIN", "DB_DOWNLOAD");

        // 4. Send the data
        res.status(200).send(JSON.stringify(vehicles, null, 2));
    } catch (err) {
        console.error("Export failed:", err);
        res.status(500).send("Export failed");
    }
});

export default router;