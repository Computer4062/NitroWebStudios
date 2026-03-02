import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import sharp from 'sharp'

import nodemailer from 'nodemailer';
import crypto from 'crypto';
import 'dotenv/config';

import {Account} from '../models/users.js'

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// get POSTED password and username and compare with that in database

// Route 1: Initial Login
router.post('/login-step-1', async (req, res) => {
    const { username, password } = req.body;
    const user = await Account.findOne({ username });

    // 1. Verify credentials (assuming bcrypt for password check)
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // 2. Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 3. Save code to user doc temporarily
    user.verificationToken = code;
    user.verificationTokenExpires = Date.now() + 600000; // 10 min expiry
    await user.save();

    // 4. Send Email
    await transporter.sendMail({
        from: '"NitroWeb Security" <mihan.edirisinghe@gmail.com>',
        to: user.email,
        subject: "Your Login Code",
        html: `Your login code is: <b>${code}</b>`
    });

    res.status(200).json({ message: "Code sent to email" });
});

// Route 2: Final Verification
router.post('/login-step-2', async (req, res) => {
    const { username, code } = req.body;
    const user = await Account.findOne({ 
        username, 
        verificationToken: code,
        verificationTokenExpires: { $gt: Date.now() } 
    });

    if (!user) {
        return res.status(401).json({ message: "Invalid or expired code" });
    }

    // Clear tokens and Issue JWT Cookie here as you did before
    user.verificationToken = undefined;
	await user.save();

	// Add a cookie
	const token = jwt.sign(
		{userId: user._id, admin: user.admin},
		process.env.JWT_SECRET_KEY,
		{expiresIn: '7d'}
	);

	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days time
	});

	res.status(200).json({code: 200, message: "Successful login"});    
});

// -----------------------------------------------------

// Register a new user to the database
router.post('/register', async(req, res) => {
	try{
		const {
			username, password, email, admin,
			first_name, last_name
		} = req.body;

		// check if user already exsists
		const exsistingUser = await Account.findOne({username: username});

		if (exsistingUser){
			return res.status(400).json({code: 401, message: "Username already taken"});
		}

		// Hash the password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create and save new user with HASHED password
		const newUser = {
			username: username,
			password: hashedPassword,
			email: email,
			admin: admin,
			first_name: first_name,
			last_name: last_name
		};

		await Account.insertOne(newUser);
		res.status(200).json({code: 201, message: "User registered successfully!"});

	}catch(error){
		console.error("Error fetching menu:", error);
		res.status(500).json({code: 500, message: "Internal Server Error" });
	}
});

// -----------------------------------------------------

// Check cookies to see if user has logged in
router.get('/check-auth', async(req, res) => {
	// Check if 'token' cookie exsists
	const token = req.cookies.token;

	if(!token){
		// unauthorized warning
		return res.status(401).json({authenciated: false});
	}

	try{
		// Checks if token is valid AND matches to the secret key
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		let user = await Account.findById(decoded.userId);

		// If token is legit
		return res.status(200).json({
			authenciated: true,
			userId: decoded.userId,
			admin: user.admin
		});
	}catch(error){
		// If fake or expired
		console.error("JWT verfication failed: ", error.message);
		return res.status(401).json({authenciated: false, message: "Invalid token"})
	}
});

// -----------------------------------------------------

// Find profile of a specific user
router.get('/get-profile', async function(req, res) {
	try {
		// Get userID of user
		const token = req.cookies.token;
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const userId = decoded.userId;

		// Mongoose's findById handles the ObjectId conversion for you!
		const user = await Account.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "user not found"});
		}

		// Send the JSON back to the frontend
		res.status(200).json(user);

	} catch (error) {
		console.error("Backend Error:", error);
		res.status(500).json({ message: "Server error: Check if the ID format is correct" });
	}
});

// -----------------------------------------------------

// For uploading a profile picture
// Configure where to store the files
// Use Memory Storage so we can process the image before saving to disk
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB for extra security
});

router.post('/upload-profile-pic', upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No file uploaded.');
        
        // Grab the username from the FormData body
        const username = req.body.username; 
        
        if (!username) {
            return res.status(400).send('Username is required for naming the file.');
        }

        const filename = `${username}.jpg`;
        const outputPath = path.join(__dirname, '../public/images/profiles/', filename);

        // Process with Sharp to force JPG format
        await sharp(req.file.buffer)
            .resize(400, 400, { fit: 'cover' })
            .toFormat('jpeg')
            .toFile(outputPath);

        // Update the database to reflect the filename (using username)
	// CHANGE: Use findOneAndUpdate to target the 'username' field
        const updatedUser = await Account.findOneAndUpdate(
            { username: username }, // Search criteria
            { profile_img: filename }, // Data to update
            { new: true } // Return the updated document
        );

		if (!updatedUser) {
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
// 1. Setup Email Transporter (Use Gmail or an SMTP service)
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

// 2. ROUTE: Trigger/Send Verification Email
router.post('/send-verification', async (req, res) => {
    try {
        const user = await Account.findOne({ username: req.body.username });
        if (!user) return res.status(404).send("User not found");

        // Generate a random 32-character hex token
        const token = crypto.randomBytes(32).toString('hex');
        
        user.verificationToken = token;
        user.verificationTokenExpires = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

        await transporter.sendMail({
            from: '"NW Studios" <mihan.edirisinghe@gmail.com>',                                               // <-- CHANGE THIS
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

// 3. ROUTE: Confirm Verification
router.get('/verify-token', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await Account.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() } // Must not be expired
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        user.isVerified = true;
        user.verificationToken = undefined; // Clear the token
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).send("<h1>Email Verified Successfully!</h1><p>You can now log in.</p>");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -----------------------------------------------------

router.put('/update-profile', async (req, res) => {
    try {
        const { username, first_name, last_name, email, password } = req.body;

        // Prepare the update object
        let updateData = { first_name, last_name, email };

        // Only update password if the user actually typed something new
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await Account.findOneAndUpdate(
            { username: username },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during update" });
    }
});

// -----------------------------------------------------
// Code for managing other accounts

// Get all users for the management table
// Backend: admin.js
router.get('/users', async (req, res) => {
    try {
        // Added first_name and last_name to the selection
        const users = await Account.find({}, 'username email admin profile_img first_name last_name');
        res.json(users);
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

// Admin-only email update
router.put('/update-email/:id', async (req, res) => {
    try {
        await Account.findByIdAndUpdate(req.params.id, { email: req.body.email });
        res.status(200).json({ message: "Email updated successfully" });
    } catch (err) {
        res.status(500).send("Update failed");
    }
});

// Admin-only delete account
router.delete('/delete-user/:id', async (req, res) => {
    try {
        // Optional: Prevent admin from deleting themselves
        if (req.params.id === req.userId) {
            return res.status(400).json({ message: "You cannot delete your own admin account!" });
        }
        
        await Account.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Account deleted" });
    } catch (err) {
        res.status(500).send("Delete failed");
    }
});

// -----------------------------------------------------

// For logging out
router.post('/logout', (req, res) => {
    // The name 'token' must match the name you used when creating the cookie
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        path: '/' // Crucial: This must match the path used when the cookie was set
    });

    res.status(200).json({ message: "Logged out successfully" });
});

export default router;