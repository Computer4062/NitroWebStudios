import express from 'express'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Router configuration
const router = express.Router();

// Path configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// To fetch all log data
router.get("/user/logs", (req, res) => {
    const logPath = path.join(__dirname, '..', 'LOG');

    if (!fs.existsSync(logPath)) {
        return res.json([]); // Return empty if no log file yet
    }

    // Read file, split by new line, and filter out empty lines
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.trim().split('\n').map(line => {
        const [action, user, dateTime] = line.split('\t');
        return { action, user, dateTime };
    });

    res.json(lines.reverse()); // Reverse so newest logs are at the top
});

export default router;