import express from 'express';
import pool from "../models/vehicles.js"

const router = express.Router();

// GET all vehicles
router.get('/all', async (req, res) => {
    try {
        // 1. Execute the SQL Query
        // In MySQL, 'rows' contains the actual data array
        const [rows] = await pool.execute('SELECT * FROM vehicles');

        // 2. Format the data (Optional)
        // If you stored images as a JSON string, you need to parse them back to an array
        const vehicles = rows.map(vehicle => ({
            ...vehicle,
            // Convert "['img1.jpg']" back to ['img1.jpg']
            images: typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images,
            // Convert 0/1 back to false/true for your React frontend
            draft: Boolean(vehicle.is_draft),
            _electric: Boolean(vehicle.is_electric),
            featured: Boolean(vehicle.is_featured)
        }));

        res.status(200).json(vehicles);

    } catch (error) {
        console.error("Error fetching vehicles from SQL:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Find a specific vehicle
router.get('/find/:id', async function(req, res) {
    try {
        const vehicleId = req.params.id;

        // 1. Query the database using a placeholder (?) for the ID
        const [rows] = await pool.execute('SELECT * FROM vehicles WHERE id = ?', [vehicleId]);

        // 2. Check if a vehicle was returned
        if (rows.length === 0) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const vehicle = rows;

        // 3. Format the data for the frontend
        // We parse the images string back into an array and convert bits to booleans
        const formattedVehicle = rows.map(vehicle => ({
            ...vehicle,
            // Convert "['img1.jpg']" back to ['img1.jpg']
            images: typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images,
            // Convert 0/1 back to false/true for your React frontend
            draft: Boolean(vehicle.is_draft),
            _electric: Boolean(vehicle.is_electric),
            featured: Boolean(vehicle.is_featured)
        }));

        // Send the JSON back to the frontend
        res.status(200).json(formattedVehicle);

    } catch (error) {
        console.error("Backend SQL Error:", error);
        res.status(500).json({ message: "Server error: Check if the ID exists in the database" });
    }
});

router.get('/find/type/:type', async function(req, res) {
    try {
        const vehicleType = req.params.type;

        // 1. Try to find vehicles of the specific type
        let [rows] = await pool.execute(
            'SELECT * FROM vehicles WHERE vehicle_type = ?', 
            [vehicleType]
        );

        // 2. If no vehicles found for that type, get 5 random vehicles
        if (rows.length === 0) {
            console.log(`No vehicles found for type: ${vehicleType}. Fetching random samples.`);
            
            // ORDER BY RAND() is the SQL version of {$sample: {size: 5}}
            [rows] = await pool.execute(
                'SELECT * FROM vehicles ORDER BY RAND() LIMIT 5'
            );
        }

        // 3. Format the data for the frontend (parsing JSON and Booleans)
        const formattedVehicles = rows.map(vehicle => ({
            ...vehicle,
            images: typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images,
            draft: Boolean(vehicle.is_draft),
            _electric: Boolean(vehicle.is_electric),
            featured: Boolean(vehicle.is_featured)
        }));

        res.status(200).json(formattedVehicles);

    } catch (error) {
        console.error("Backend SQL Error:", error);
        res.status(500).json({ message: "Server error fetching vehicle types" });
    }
});

export default router;