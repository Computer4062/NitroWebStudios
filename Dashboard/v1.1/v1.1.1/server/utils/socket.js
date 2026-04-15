let liveUserCount = 0;

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    liveUserCount++;
    console.log(`User connected. Live: ${liveUserCount}`);

    socket.on('disconnect', () => {
      liveUserCount = Math.max(0, liveUserCount - 1);
      console.log(`User disconnected. Live: ${liveUserCount}`);
    });
  });
};

// This helper allows other files to "peek" at the count
export const getLiveCount = () => liveUserCount;