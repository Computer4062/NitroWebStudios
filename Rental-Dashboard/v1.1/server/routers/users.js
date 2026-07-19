import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';
import sharp from 'sharp'

import nodemailer from 'nodemailer';
import crypto from 'crypto';
import 'dotenv/config';

import pool from '../db.js' // MySQL pool

import { verifyAdmin, verifyUser } from '../middleware/Authenciation.js';
import logger from '../utils/Logger.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generates a 24-character hex string, mimicking the old Mongo ObjectId format
function generateId() {
    return crypto.randomBytes(12).toString('hex');
}

// For sending emails with transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Route 1: Initial Login
router.post('/login-step-1', async (req, res) => {
    try {
        const { username, password } = req.body;

        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        // 1. Verify credentials
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // 2. Generate a 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 600000); // 10 min expiry

        // 3. Save code to user row temporarily
        await pool.query(
            'UPDATE users SET verification_token = ?, verification_token_expires = ?, updated_at = NOW() WHERE id = ?',
            [code, expires, user.id]
        );

        // 4. Send Email
        await transporter.sendMail({
            from: '"NitroWeb Security" <mihan.edirisinghe@gmail.com>',
            to: user.email,
            subject: "Your Login Code",
            html: `Your login code is: <b>${code}</b>`
        });

        res.status(200).json({ message: "Code sent to email" });

    } catch (error) {
        console.error("Login step 1 error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route 2: Final Verification
router.post('/login-step-2', async (req, res) => {
    try {
        const { username, code } = req.body;

        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ? AND verification_token = ? AND verification_token_expires > NOW()',
            [username, code]
        );
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid or expired code" });
        }

        // Clear token
        await pool.query(
            'UPDATE users SET verification_token = NULL, verification_token_expires = NULL, updated_at = NOW() WHERE id = ?',
            [user.id]
        );

        // Add a cookie
        const token = jwt.sign(
            { userId: user.id, admin: user.admin, username: user.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        logger(username, "USER SIGNED IN");
        res.status(200).json({ code: 200, message: "Successful login" });

    } catch (error) {
        console.error("Login step 2 error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// -----------------------------------------------------

// Register a new user to the database
router.post('/admin/register', verifyUser, async (req, res) => {
    try {
        const {
            username, password, email, admin,
            first_name, last_name
        } = req.body;

        // check if user already exists
        const [existingRows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);

        if (existingRows.length > 0) {
            return res.status(400).json({ code: 401, message: "Username already taken" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newId = generateId();

        await pool.query(
            `INSERT INTO users (id, username, password, email, admin, first_name, last_name, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                newId,
                username,
                hashedPassword,
                email,
                admin ? 1 : 0,
                first_name,
                last_name
            ]
        );

        logger(username, `USER REGISTERED ${username} | ADMIN: ${admin}`);
        res.status(200).json({ code: 201, message: "User registered successfully!" });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ code: 500, message: "Internal Server Error" });
    }
});

// -----------------------------------------------------

// Check cookies to see if user has logged in
router.get('/check-auth', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ authenciated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ authenciated: false });
        }

        return res.status(200).json({
            authenciated: true,
            admin: user.admin
        });
    } catch (error) {
        console.error("JWT verfication failed: ", error.message);
        return res.status(401).json({ authenciated: false, message: "Invalid token" })
    }
});

// -----------------------------------------------------

// Check cookies to see the username of the user
router.get('/check-username', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ authenciated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ authenciated: false });
        }

        return res.status(200).json({
            name: user.username
        });
    } catch (error) {
        console.error("JWT verfication failed: ", error.message);
        return res.status(401).json({ authenciated: false, message: "Invalid token" })
    }
});

// -----------------------------------------------------

// Find profile of a specific user
router.get('/user/get-profile', async function (req, res) {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.userId;

        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "user not found" });
        }

        // Never send the password hash back to the frontend
        const { password, ...safeUser } = rows[0];

        res.status(200).json(safeUser);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ message: "Server error: Check if the ID format is correct" });
    }
});

// -----------------------------------------------------

// For uploading a profile picture
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/user/upload-profile-pic', upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No file uploaded.');

        const username = req.body.username;

        if (!username) {
            return res.status(400).send('Username is required for naming the file.');
        }

        const filename = `${username}.jpg`;
        const outputPath = path.join(__dirname, '../public/uploads/profiles/', filename);

        // Process with Sharp to force JPG format
        await sharp(req.file.buffer)
            .resize(400, 400, { fit: 'cover' })
            .toFormat('jpeg')
            .toFile(outputPath);

        // Update the database to reflect the filename
        const [result] = await pool.query(
            'UPDATE users SET profile_img = ?, updated_at = NOW() WHERE username = ?',
            [filename, username]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found in database." });
        }

        res.status(200).json({
            message: 'Success',
            filename: filename
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).send("Error processing image.");
    }
});

// -----------------------------------------------------

// For email verification

// ROUTE: Trigger/Send Verification Email
router.post('/send-verification', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [req.body.username]);
        const user = rows[0];
        if (!user) return res.status(404).send("User not found");

        // Generate a random 32-character hex token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour expiry

        await pool.query(
            'UPDATE users SET verification_token = ?, verification_token_expires = ?, updated_at = NOW() WHERE id = ?',
            [token, expires, user.id]
        );

        const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

        await transporter.sendMail({
            from: '"NW Studios" <mihan.edirisinghe@gmail.com>',
            to: user.email,
            subject: "Verify your email address",
            html: `<h1>Welcome!</h1><p>Please click the link below to verify your account:</p>
                   <a href="${verificationUrl}">Verify Email</a>`
        });

        res.status(200).json({ message: "Verification email sent!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ROUTE: Confirm Verification
router.get('/verify-token', async (req, res) => {
    const { token } = req.query;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE verification_token = ? AND verification_token_expires > NOW()',
            [token]
        );
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        await pool.query(
            'UPDATE users SET is_verified = 1, verification_token = NULL, verification_token_expires = NULL, updated_at = NOW() WHERE id = ?',
            [user.id]
        );

        res.status(200).send("<h1>Email Verified Successfully!</h1><p>You can now log in.</p>");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -----------------------------------------------------

router.put('/user/update-profile', async (req, res) => {
    try {
        const { username, first_name, last_name, email, password } = req.body;

        // Build dynamic update fields
        const fields = ['first_name = ?', 'last_name = ?', 'email = ?'];
        const values = [first_name, last_name, email];

        // Only update password if the user actually typed something new
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            fields.push('password = ?');
            values.push(hashedPassword);
        }

        fields.push('updated_at = NOW()');

        const [result] = await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE username = ?`,
            [...values, username]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during update" });
    }
});

// -----------------------------------------------------
// Code for managing other accounts

// Get all users for the management table
router.get('/user/users', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT username, email, admin, profile_img, first_name, last_name FROM users'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

// Admin-only email update
router.put('/admin/update-email/:id', async (req, res) => {
    try {
        await pool.query(
            'UPDATE users SET email = ?, updated_at = NOW() WHERE id = ?',
            [req.body.email, req.params.id]
        );
        res.status(200).json({ message: "Email updated successfully" });
    } catch (err) {
        res.status(500).send("Update failed");
    }
});

// Admin-only delete account
router.delete('/admin/delete-user/:id', async (req, res) => {
    try {
        // Optional: Prevent admin from deleting themselves
        if (req.params.id === req.userId) {
            return res.status(400).json({ message: "You cannot delete your own admin account!" });
        }

        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: "Account deleted" });
    } catch (err) {
        res.status(500).send("Delete failed");
    }
});

// Delete own account
router.delete('/user/delete-self/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: "Account deleted" });
    } catch (err) {
        res.status(500).send("Delete failed");
    }
});

// -----------------------------------------------------

// For logging out
router.post('/user/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        path: '/'
    });

    res.status(200).json({ message: "Logged out successfully" });
});

export default router;