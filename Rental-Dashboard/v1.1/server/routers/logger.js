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

const logPath = path.join(__dirname, '..', 'LOG');

// To fetch all log data
router.get("/user/logs", (req, res) => {
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

// 🔒 Route to Clear Logs (Protected so only Admins can execute it)
router.delete('/admin/clear-logs', async (req, res) => {
    try {
        // 1. Double check if the file even exists before trying to clear it
        if (!fs.existsSync(logPath)) {
            return res.status(404).json({ message: "Log file not found or already empty." });
        }

        // 2. Truncate forces the file size back to 0, completely wiping the text inside
        fs.truncate(logPath, 0, (err) => {
            if (err) {
                console.error("Failed to clear log file:", err);
                return res.status(500).json({ message: "Failed to clear the log file on disk." });
            }

            return res.status(200).json({ message: "System activity logs cleared successfully." });
        });

    } catch (error) {
        console.error("Server error during log clearing:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;