import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Account} from '../models/users.js'

const router = express.Router();

// get POSTED password and username and compare with that in database
router.post('/login', async (req, res) => {
	try {
		const {username, password} = req.body;

		//find user by username
		const user = await Account.findOne({username: username});

		if(!user){
			return res.status(401).json({code: 401, message: "Invalid username or password"});
		}

		//compare entered and hashed password
		const isMatch = await bcrypt.compare(password, user.password);

		if(isMatch){
			// SUCCESS

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

		} else {
			// PASSWORD MISMATCH
			res.status(401).json({code: 402, message: "Invalid username or password"});
		}

		res.status(200);

	} catch (error) {
		console.error("Error fetching menu:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// Register a new user to the database
router.post('/register', async(req, res) => {
	try{
		const {username, password} = req.body;

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
			password: hashedPassword
		};

		await Account.insertOne(newUser);
		res.status(200).json({code: 201, message: "User registered successfully!"});

	}catch(error){
		console.error("Error fetching menu:", error);
		res.status(500).json({code: 500, message: "Internal Server Error" });
	}
});

// Check cookies to see if user has logged in
router.get('/check-auth', (req, res) => {
	// Check if 'token' cookie exsists
	const token = req.cookies.token;

	if(!token){
		// unauthorized warning
		return res.status(401).json({authenciated: false});
	}

	try{
		// Checks if token is valid AND matches to the secret key
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

		// If token is legit
		return res.status(200).json({
			authenciated: true,
			userId: decoded.userId,
			admin: decoded.admin
		});
	}catch(error){
		// If fake or expired
		console.error("JWT verfication failed: ", error.message);
		return res.status(401).json({authenciated: false, message: "Invalid token"})
	}
});

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