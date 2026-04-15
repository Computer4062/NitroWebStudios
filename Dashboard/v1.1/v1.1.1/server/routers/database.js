import express from 'express'
import {Vehicle} from "../models/vehicles.js"
import Logger from '../utils/Logger.js';

const router = express.Router();

router.get("/admin/download", async (req, res) => {
    try {
        // 1. Fetch all data from your Vehicle model
        const vehicles = await Vehicle.find({});

        // 2. Set headers to tell the browser it's a file download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=vehicle_database_export.json');

        // 3. Log the action (using our new logger!)
        Logger("ADMIN", "DB_DOWNLOAD");

        // 4. Send the data
        res.status(200).send(JSON.stringify(vehicles, null, 2));
    } catch (err) {
        res.status(500).send("Export failed");
    }
});

export default router;