import express from 'express';
import {Vehicle} from "../models/vehicles.js"

const router = express.Router();

// GET all vehicles
router.get('/all', async (req, res) => {
    try {
        const vehicle_data = await Vehicle.find({});
        res.status(200).json(vehicle_data);

    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Find a specific vehicle
router.get('/find/:id', async function(req, res) {
    try {
        const vehicleId = req.params.id;

        // Mongoose's findById handles the ObjectId conversion for you!
        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found"});
        }

        // Send the JSON back to the frontend
        res.status(200).json(vehicle);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server error: Check if the ID format is correct" });
    }
});

router.get('/find/type/:type', async function(req, res) {
    try {
        const vehicleType = req.params.type;

        // Mongoose's findById handles the ObjectId conversion for you!
        let vehicles = await Vehicle.find({type: vehicleType});

        if (!vehicles  || vehicles.length === 0) {
            vehicles = await Vehicle.aggregate([    
                {$sample: {size: 5}}
            ])
        }

        // Send the JSON back to the frontend
        res.status(200).json(vehicles);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server error: Check if the ID format is correct" });
    }
});



export default router;