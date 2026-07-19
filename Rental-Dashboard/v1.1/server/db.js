import mysql from "mysql2/promise";
import 'dotenv/config'

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    
    // Pool settings (Crucial for performance)
    waitForConnections: true,  // Queue requests when the pool is full
    connectionLimit: 10,       // Max number of simultaneous connections
    queueLimit: 0,             // Unlimited queuing (0 = no limit)
    enableKeepAlive: true      // Prevents MySQL from dropping idle connections
})

export default pool;