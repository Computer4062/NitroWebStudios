import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import 'dotenv/config';

import vehicleRoutes from "./routers/vehicles.js";
import accountRoutes from "./routers/users.js"

// Code for setting up express app
const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;
const app = express()

app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(morgan("dev"))
app.use('/public/images', express.static('public/images'));
app.use('/public/uploads', express.static('public/uploads'));
app.set('etag', false);

app.use("/api/vehicles", vehicleRoutes)
app.use("/api/accounts", accountRoutes)

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
	const server = app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT} 🚀`);
	});

	server.on('close', () => {
		client.close();
	});
});
