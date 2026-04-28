import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mysql from 'mysql2/promise';
import pool from './models/vehicles.js'
import 'dotenv/config';

import productsRoute from "./routers/vehicles.js";

// Code for setting up express app
const PORT = process.env.PORT;
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
app.use('/public/uploads', express.static('public/uploads'));
app.set('etag', false);

app.use("/api/stocks", productsRoute)

// Functions for connecting to SQL DB

async function connectToDB() {
    try {
        // With mysql2/promise, we can "test" the connection by getting a connection from the pool
        const connection = await pool.getConnection();
        console.log('✅ Successfully connected to MySQL (nitro_wp) via mysql2');
        
        connection.release(); // Release it back to the pool
        return pool;

    } catch (error) {
        console.error('❌ SQL Connection failed:', error.message);
        process.exit(1);
    }
}

// Start Server after DB check
connectToDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT} 🚀`);
    });

    server.on('close', async () => {
        // Properly shut down the pool when the server closes
        await pool.end();
        console.log('SQL Pool closed.');
    });
});