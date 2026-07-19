import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @param {string} username - The name of the user (passed from the route)
 * @param {string} action - The description of the action
 */
function logger(username, action) {
    try {
        // 1. Ensure the log folder exists
        const logPath = path.join(__dirname, '..', 'LOG');
        
        // 2. Safety check: Ensure strings for padding
        const safeAction = (action || "Unknown Action").toString();
        const user = (username || "N/A").toString();
        const dateTime = new Date().toLocaleString();

        const logEntry = `${safeAction.padEnd(15)}\t${user.padEnd(15)}\t${dateTime}\n`;

        // 3. Append to file
        fs.appendFile(logPath, logEntry, (err) => {
            if (err) console.error("Log Write Error:", err);
        });
    } catch (crash) {
        console.error("The logger itself caused a crash:", crash);
    }
}

export default logger;