import { Octokit } from "octokit";
import express from "express"
import 'dotenv/config'

const router = express.Router();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const REPO_OWNER = process.env.GITHUB_REPO_OWNER;
const REPO_NAME = process.env.GITHUB_REPO_NAME;

router.get('/github/tree', async (req, res) => {
    console.log("Attempting to fetch tree for:", REPO_OWNER, REPO_NAME);
    try {
        const { data } = await octokit.rest.git.getTree({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            tree_sha: 'main', 
            recursive: true
        });
        
        console.log("GitHub responded with", data.tree.length, "files.");
        res.json(data.tree); 
    } catch (err) {
        console.error("GITHUB API ERROR:", err.response?.data || err.message);
        res.status(500).json({ error: err.message });
    }
});

// Route to get file content
router.get('/github/get-content', async (req, res) => {
    try {
        const { data } = await octokit.rest.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: req.query.path,
        });
        
        // GitHub sends content in Base64
        const content = Buffer.from(data.content, 'base64').toString();
        res.json({ content, sha: data.sha });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to push changes
router.post('/github/push-changes', async (req, res) => {
    try {
        const { path, content, message } = req.body;

        // 1. Get the current file SHA (required by GitHub to update)
        const { data: fileData } = await octokit.rest.repos.getContent({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: path,
        });

        // 2. Update the file
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: REPO_OWNER,
            repo: REPO_NAME,
            path: path,
            message: message,
            content: Buffer.from(content).toString('base64'),
            sha: fileData.sha
        });

        // 3. Log the action with your updated logger!
        //logger("ADMIN", `EDITED_SITE_FILE: ${path}`);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;