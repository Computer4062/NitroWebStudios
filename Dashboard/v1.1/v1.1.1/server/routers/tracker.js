import express from 'express';
import { getLiveCount } from '../utils/socket.js';

const router = express.Router();

router.get('/admin/live-count', (req, res) => {
  res.json({
    activeUsers: getLiveCount(),
    timestamp: new Date().toISOString()
  });
});

export default router;