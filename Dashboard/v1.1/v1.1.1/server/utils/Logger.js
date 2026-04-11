import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @param {string} username - The name of the user (passed from the route)
 * @param {string} action - The description of the action
 */
export const logger = (username, action) => {
    // Navigate to your LOG file (assuming it's in the parent directory)
    const logPath = path.join(__dirname, '..', 'LOG');
    
    // Ensure we have a string, default to Guest if null/undefined
    const user = username || "N/A";
    const dateTime = new Date().toLocaleString();

    // Format: Action (15 chars) | User (15 chars) | Date
    const logEntry = `${action.padEnd(15)}\t${user.padEnd(15)}\t${dateTime}\n`;

    fs.appendFile(logPath, logEntry, (err) => {
        if (err) {
            console.error("Critical: Failed to write to log file:", err);
        }
    });
};