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

import {Account} from '../models/users.js'

import logger from '../utils/Logger.js';

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
		{userId: user._id, admin: user.admin, username: user.username},
		process.env.JWT_SECRET_KEY,
		{expiresIn: '7d'}
	);

	res.cookie('token', token, {
		httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
		maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days time
	});

    logger("ADMIN", "USER SIGNED IN");
	res.status(200).json({code: 200, message: "Successful login"});    
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
			admin: user.admin
		});
	}catch(error){
		// If fake or expired
		console.error("JWT verfication failed: ", error.message);
		return res.status(401).json({authenciated: false, message: "Invalid token"})
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