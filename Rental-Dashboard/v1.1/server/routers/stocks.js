import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';

import pool from "../db.js" // MySQL pool

import Logger from "../utils/Logger.js"

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

        const existingVehicle = existingRows.map(row => {
            return {
                ...row,
                img: typeof row.img === 'string' ? JSON.parse(row.img) : row.img
            };
        });

        // 2. Delete the old physical files from the 'public' folder (only if new images were uploaded)
        if (req.files && req.files.length > 0 && existingVehicle.img && existingVehicle.img.length > 0) {
            existingVehicle.img.forEach(filePath => {
                const cleanPath = filePath.replace(/^\/+|;+/g, '');
                const absolutePath = path.join(__dirname, '..', 'public', cleanPath);

                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                }
            });
        }

        // 3. Build the update payload
        const updateData = { ...req.body };

        if (req.files && req.files.length > 0) {
            updateData.img = JSON.stringify(req.files.map(file => `/uploads/products/${file.filename}`));
        }

        // 4. Build dynamic SET clause using only whitelisted fields present in the body
        const fieldsToUpdate = Object.keys(updateData).filter(key => ALLOWED_UPDATE_FIELDS.includes(key));

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }

        const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
        const values = fieldsToUpdate.map(field => {
            // Normalize boolean/number fields coming from FormData strings
            if (field === 'draft' || field === 'highlight') {
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

        // 5. Return the updated row
        const [updatedRows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
        res.json(updatedRows[0]);

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

        const vehicle = rows[0];

        // 2. Delete physical files from the server
        if (vehicle.img && vehicle.img.length > 0) {
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