import mysql from 'mysql2/promise';

// Create a connection pool (better for performance than a single connection)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Default for local development
    password: '',      // Default is empty for XAMPP/WAMP
    database: 'nitro_wp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;