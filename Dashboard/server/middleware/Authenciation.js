import jwt from 'jsonwebtoken'
import {Account} from '../models/users.js'

// Go through browser cookies to verify user is an admin
// go thorugh browser cookies to find username --> compare againts db to find if admin
const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // 1. Verify the JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // 2. Find the user in DB
        const user = await Account.findById(decoded.userId);

        // 3. Check if they exist AND are an admin
        if (!user || !user.admin) {
            return res.status(403).json({ message: "Access denied. Admins only! -NW Studios" });
        }

        // 4. Attach user info to the request for later use and move to the route
        req.user = user;
        next(); 

    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

// Go through browser cookies to verify user is registered
// Prevents unauthorized users who finds out API calls from flooding the server with garbage
const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // 1. Verify the JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // 2. Find the user in DB
        const user = await Account.findById(decoded.userId);

		// 3. Check if user exsists
		if(!user){
			return res.status(401).json({message: "Access denied. Registered Users only! -NW Studios"});
		}

        // 4. Attach user info to the request for later use and move to the route
        req.user = user;
        next();

    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

export {verifyAdmin, verifyUser}