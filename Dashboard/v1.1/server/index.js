import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config'

import stockRoutes from "./routers/stocks.js";
import accountRoutes from "./routers/users.js"
import loggerRoutes from "./routers/logger.js"
import databaseRouter from "./routers/database.js"
import editorRouter from "./routers/editor.js"
import trackerRouter from "./routers/tracker.js"

import { verifyAdmin, verifyUser } from './middleware/Authenciation.js';

import { createServer } from 'http';
import { Server } from 'socket.io';
import { initSocket } from './utils/socket.js';

import { PageVisit } from './models/visits.js';

// Code for setting up express app
const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;

const app = express()
const httpServer = createServer(app);

app.use(cookieParser());
app.use(cors({
	origin: ['http://localhost:5173', 'https://nitro-web-studios-themes.vercel.app', 'https://nitro-web-studios-themes-git-main-computer4062s-projects.vercel.app'],
	credentials: true
}));
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan("dev"))
app.use('/public/uploads', express.static('public/uploads'));
app.set('etag', false);

// For API calls that require admin/user access: Ex: updating inventory, updating profiles

app.use("/api/stocks/admin", verifyAdmin, stockRoutes); 			app.use("/api/stocks/user", verifyUser, stockRoutes);
app.use("/api/accounts/admin", verifyAdmin, accountRoutes); 		app.use("/api/accounts/user", verifyUser, accountRoutes)
app.use("/api/logs/admin", verifyAdmin, loggerRoutes); 				app.use("/api/logs/user", verifyUser, loggerRoutes)
app.use("/api/database/admin", verifyAdmin, databaseRouter); 		app.use("/api/database/user", verifyUser, databaseRouter)
app.use("/api/editor/admin", verifyAdmin, editorRouter); 			app.use("/api/editor/user", verifyUser, editorRouter)
app.use("/api/analytics/admin", verifyAdmin, trackerRouter); 		app.use("/api/analytics/user", verifyUser, trackerRouter);

// For API calls that does not require admin access

app.use("/api/stocks", stockRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/logs", loggerRoutes)
app.use("/api/database", databaseRouter)
app.use("/api/editor", editorRouter)
app.use("/api/analytics", trackerRouter);

// Initialize socket.io for tracking purposes

const io = new Server(httpServer, {
  cors: { origin: "*" }
});

initSocket(io);

// function to connect to Database
async function connectToDB() {
	try{
		const conn = await mongoose.connect(URI);
		console.log('✅ Successfully connected to MongoDB via Mongoose');

	} catch(error) {
		console.error('❌ Connection failed:', error.message);
        process.exit(1);
	}
}

connectToDB().then(() => {
	httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	});

	const server = app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT} 🚀`);
	});

	server.on('close', () => {
		client.close();
	});
});