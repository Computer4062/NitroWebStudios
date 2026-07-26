import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';

import pool from "../db.js" // MySQL pool

import Logger from "../utils/Logger.js"
import { jsonArrayNormalizer } from '../utils/normalizer.js';

// Router configuration
const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/products/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const shortId = Math.random().toString(36).substring(2, 6);
    const timestamp = Date.now().toString().slice(-6);
    const newName = `${timestamp}-${shortId}${ext}`;
    cb(null, newName);
  }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB per image
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fields allowed to be updated via PUT (whitelist to prevent SQL injection via column names)
const ALLOWED_UPDATE_FIELDS = [
    'name', 'draft', 'brand', 'type', 'fuel_type',
    'status', 'days_left', 'seats', 'gearbox', 'price', 'img',
    'user', 'highlight'
];

// ------------------------------------------------------------------------------------------------- //
// GET all products
router.get('/all', async (req, res) => {
    try {
        // 1. Fetch filtered rows from your database pool
        const [rows] = await pool.query('SELECT * FROM vehicles WHERE draft = false');
        
        // 2. Map through the rows to turn the 'img' JSON string into a true JS array
        const parsedRows = rows.map(row => {
            return {
                ...row,
                img: typeof row.img === 'string' ? JSON.parse(row.img) : row.img
            };
        });

        // 3. Send the clean, ready-to-use array back to your React frontend
        res.status(200).json(parsedRows);

    } catch (error) {
        console.error("Error fetching vehicles:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// GET drafted stock (scheduled to be public later)
router.get('/user/drafts', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM vehicles WHERE draft = true');
        res.status(200).json(rows);

    } catch (error) {
        console.error("Error fetching stock:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// Find a specific product
router.get('/find/one/:id', async function(req, res) {
    try {
        const productId = req.params.id;

        const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [productId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Vehicle not found"});
        }

        const parsedRows = rows.map(row => {
            return {
                ...row,
                img: typeof row.img === 'string' ? JSON.parse(row.img) : row.img
            };
        });

        // Send the JSON back to the frontend
        res.status(200).json(parsedRows[0]);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server error: Check if the ID format is correct" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// Find a product depending on the type of product searched for Ex: Sedan, SUV
router.get('/find/type/:type', async function(req, res) {
    try {
        const productType = req.params.type;

        let [vehicles] = await pool.query('SELECT * FROM vehicles WHERE type = ?', [productType]);

        if (!vehicles || vehicles.length === 0) {
            // Equivalent of $sample: {size: 5} -- random rows
            [vehicles] = await pool.query('SELECT * FROM vehicles ORDER BY RAND() LIMIT 5');
        }

        res.status(200).json(vehicles);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server error: Check if the ID format is correct" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// For adding a new product to the Stock
router.post('/user/addnew', upload.array('images'), async (req, res) => {
    try {
        // Text data is in req.body -- mapped to vehicles table columns
        const { name, draft, brand, type, fuel_type, status, days_left, seats, gearbox, price, user, highlight } = req.body;

        // Image details are in req.files
        const imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);

        const [result] = await pool.query(
            `INSERT INTO vehicles (name, draft, brand, type, fuel_type, status, days_left, seats, gearbox, price, img, user, highlight)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                draft === 'true' || draft === true ? 1 : 0,
                brand,
                type,
                fuel_type,
                status || 'Available',
                days_left ? Number(days_left) : null,
                Number(seats),
                gearbox,
                Number(price),
                JSON.stringify(imagePaths),
                user,
                highlight
            ]
        );

        res.status(201).json({ message: "Product added successfully!", id: result.insertId });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// For updating list of products in database


router.put('/user/update/:id', upload.array('images'), async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Find the existing vehicle to get the OLD image paths
        const [existingRows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);

        if (existingRows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingVehicle = {
            ...existingRows[0],
            img: typeof existingRows[0].img === 'string' ? JSON.parse(existingRows[0].img) : existingRows[0].img
        };

        // 2. Determine which existing images the frontend wants to KEEP.
        //    Sent as a JSON string of paths, e.g. '["/uploads/products/abc.jpg"]'
        let keptImages = [];
        if (req.body.existingImages) {
            try {
                keptImages = JSON.parse(req.body.existingImages);
            } catch (e) {
                keptImages = [];
            }
        }

        // 3. Figure out which OLD images are no longer wanted, and delete only those from disk
        const imagesToDelete = (existingVehicle.img || []).filter(
            oldPath => !keptImages.includes(oldPath)
        );

        imagesToDelete.forEach(filePath => {
            const cleanPath = filePath.replace(/^\/+|;+/g, '');
            const absolutePath = path.join(__dirname, '..', 'public', cleanPath);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        });

        // 4. Build the update payload
        const updateData = { ...req.body };
        delete updateData.existingImages; // not a real column, just used to compute img above

        // 5. Combine kept existing images with any newly uploaded files
        if (req.files && req.files.length > 0) {
            const newImagePaths = req.files.map(file => `/uploads/products/${file.filename}`);
            updateData.img = JSON.stringify([...keptImages, ...newImagePaths]);
        } else {
            // No new files uploaded — just persist whichever existing images were kept
            updateData.img = JSON.stringify(keptImages);
        }

        // 6. Build dynamic SET clause using only whitelisted fields present in the body
        const fieldsToUpdate = Object.keys(updateData).filter(key => ALLOWED_UPDATE_FIELDS.includes(key));

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
        const values = fieldsToUpdate.map(field => {
            if (field === 'draft' || field === 'highlighted') {
                return updateData[field] === 'true' || updateData[field] === true ? 1 : 0;
            }
            if (['days_left', 'seats', 'price'].includes(field)) {
                return updateData[field] === '' || updateData[field] == null ? null : Number(updateData[field]);
            }
            return updateData[field];
        });

        await pool.query(
            `UPDATE vehicles SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        // 7. Return the updated row
        const [updatedRows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
        res.json(updatedRows[0]);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// Given a full inventory path (e.g. "/inventory/5"), extract the ID and return
// both the vehicle's own details and a list of related vehicles (same type)
// in a single response — avoids the frontend needing two separate round-trips
// Safely normalizes a field into a real array, no matter how many layers
// of JSON stringification it went through
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

// ------------------------------------------------------------------------------------------------- //
router.get('/details-by-path', async (req, res) => {
    try {
        const { path: fullPath } = req.query;

        if (!fullPath) {
            return res.status(400).json({ message: "Missing 'path' query parameter" });
        }

        const match = fullPath.match(/^\/inventory\/(.+)$/);
        if (!match) {
            return res.status(400).json({ message: "Path does not match expected format /inventory/:id" });
        }

        const idStr = match[1];
        const id = Number(idStr);

        if (!Number.isInteger(id) || idStr === '') {
            return res.status(400).json({ message: "Invalid vehicle ID in path" });
        }

        // 1. Fetch the vehicle itself
        const [vehicleRows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);

        if (vehicleRows.length === 0) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const vehicle = {
            ...vehicleRows[0],
            img: normalizeJsonArray(vehicleRows[0].img)
        };

        // 2. Fetch related vehicles sharing the same type, excluding this one
        const [relatedRows] = await pool.query(
            'SELECT * FROM vehicles WHERE type = ? AND id != ? LIMIT 3',
            [vehicle.type, vehicle.id]
        );

        const related = relatedRows.map(row => ({
            ...row,
            img: normalizeJsonArray(row.img)
        }));

        // 3. Send both back together, fully normalized
        res.status(200).json({
            vehicle,
            related
        });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ------------------------------------------------------------------------------------------------- //
// Delete a product listing
router.delete('/user/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Find the product to get image paths before deleting the record
        const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Item not found" });

        const vehicle = {
            ...rows[0],
            img: jsonArrayNormalizer(rows[0].img)
        };

        // 2. Delete physical files from the server
        if (vehicle.img.length > 0) {
            vehicle.img.forEach(filePath => {
                const cleanPath = filePath.replace(/^\/+|;+/g, '');
                const absolutePath = path.join(__dirname, '..', 'public', cleanPath);

                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                }
            });
        }

        // 3. Delete from Database
        await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);

        res.status(200).json({ message: "Listing and associated images deleted successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
});

export default router;