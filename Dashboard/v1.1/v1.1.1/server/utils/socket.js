import { PageVisit } from '../models/visits.js';

  let liveUserCount = 0;

export const initSocket = (io) => {

  io.on('connection', (socket) => {
    liveUserCount++;
    
    // Broadcast live count to everyone (optional) or just track it
    io.emit('live_update', liveUserCount);

    // Listen for page navigation
    socket.on('page_view', async (data) => {
      const { pagePath } = data;
      if (!pagePath) return;

      try {
        // Upsert: If path exists, increment hits by 1. If not, create it.
        await PageVisit.findOneAndUpdate(
          { path: pagePath },
          { 
            $inc: { hits: 1 },
            $set: { lastVisited: new Date() } 
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error('Error updating Mongoose analytics:', err);
      }
    });

    socket.on('disconnect', () => {
      liveUserCount = Math.max(0, liveUserCount - 1);
      io.emit('live_update', liveUserCount);
    });
  });
};

// Helper for the GET API
export const getLiveCount = () => liveUserCount; // Note: Ensure this variable is accessible