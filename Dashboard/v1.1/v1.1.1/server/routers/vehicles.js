import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';

import {Vehicle} from "../models/vehicles.js"

import Logger from "../utils/Logger.js"

// Router configuration
const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/vehicles/'); // Make sure this folder exists!
    },
    filename: (req, file, cb) => {
        // Creates a unique name: timestamp-originalname.jpg
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB per image
});

// Path configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------------------------------------------------- //
// GET all vehicles
router.get('/all', async (req, res) => {
    try {
        const vehicle_data = await Vehicle.find({ draft: false });
        res.status(200).json(vehicle_data);

    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// GET drafted vehicles (schedueled to be public later)
router.get('/admin/drafts', async (req, res) => {
    try {
        const vehicle_data = await Vehicle.find({ draft: true });
        res.status(200).json(vehicle_data);

    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// Find a specific vehicle
router.get('/find/one/:id', async function(req, res) {
    try {
        const vehicleId = req.params.id;

        // Mongoose's findById handles the ObjectId conversion for you!
        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found"});
        }

        // Send the JSON back to the frontend
        res.status(200).json([vehicle]);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server error: Check if the ID format is correct" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// Find a vehicle depending on the type of vehicle searched for Ex: Sedan
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

// ------------------------------------------------------------------------------------------------- //
// For adding a new vehicle to the database
router.post('/admin/addnew', upload.array('images'), async (req, res) => {
    try {
        // Text data is in req.body
        const { make, model, year, price, description, electric, featured, draft, type } = req.body;

        // Image details are in req.files
        // We map them to get just the filenames/paths to save in the DB
        const imagePaths = req.files.map(file => `/uploads/vehicles/${file.filename}`);

        const newVehicle = new Vehicle({
            make: make,
            model: model,
            year: Number(year),
            price: Number(price),
            description: description,
            _electric: electric === 'true', // FormData sends booleans as strings
            featured: featured === 'true',
            images: imagePaths, // Array of strings stored in MongoDB
            draft: draft,
            type: type
        });

        await newVehicle.save();
        
        res.status(201).json({ message: "Vehicle added successfully!", vehicle: newVehicle });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// For updating list of vehicles in database
router.put('/admin/update/:id', upload.array('images'), async (req, res) => {
    const { id } = req.params;

    // Delete the old images
    // 1. Find the existing vehicle to get the OLD image paths
        const existingVehicle = await Vehicle.findById(id);
        
        if (!existingVehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // 2. Delete the old physical files from the 'public' folder
        if (existingVehicle.images && existingVehicle.images.length > 0) {
            existingVehicle.images.forEach(filePath => {
                // Construct absolute path: adjust 'public' based on your folder structure
                const cleanPath = filePath.replace(/^\/+|;+/g, '');
                const absolutePath = path.join(__dirname, '..', 'public', cleanPath);
                
                // Check if file exists before trying to delete to avoid crashing
                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath); // Using sync for simplicity here
                }
            });
        }


    // Add the new images
    const updateData = req.body;

    // Check if new images were uploaded
    if (req.files && req.files.length > 0) {
        updateData.images = req.files.map(file => `/uploads/vehicles/${file.filename}`);
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedVehicle);
});

// ------------------------------------------------------------------------------------------------- //
// Delete a vehicle listing
router.delete('/admin/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Find the vehicle to get image paths before deleting the record
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) return res.status(404).json({ message: "Item not found" });

        // 2. Delete physical files from the server
        if (vehicle.images && vehicle.images.length > 0) {
            vehicle.images.forEach(filePath => {
                // Clean the path and join with root directory
                const cleanPath = filePath.replace(/^\/+|;+/g, '');
                const absolutePath = path.join(__dirname, '..', 'public', cleanPath);

                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                }
            });
        }

        // 3. Delete from Database
        await Vehicle.findByIdAndDelete(id);

        res.status(200).json({ message: "Listing and associated images deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;