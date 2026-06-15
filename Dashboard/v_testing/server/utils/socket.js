import { PageVisit } from '../models/visits.js';

// An in-memory cache to keep track of sessions that have already counted as a page view 
// for a specific path today. Format: { "sess_abc123:/inventory/124": true }
const countedPageViews = new Set();

function formatDateString(dateInput) {
  if (!dateInput) return "";
  const parsedDate = new Date(dateInput);
  if (isNaN(parsedDate.getTime())) return "";
  return parsedDate.toISOString().slice(0, 10);
}

function advanceByOneDay(dateInput) {
  const d = new Date(dateInput + 'T00:00:00.000Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

/**
 * Analytics Engine: Handles custom increment tracking and backfills missing calendar gaps
 */
async function handlePageViewIncrement(pagePath, isNewViewForSession) {
  const rightNow = new Date();
  const todayStr = formatDateString(rightNow);

  try {
    let record = await PageVisit.findOne({ path: pagePath });

    // If the path tracking page doesn't exist yet, build it out
    if (!record) {
      await PageVisit.create({
        path: pagePath,
        todaysHits: isNewViewForSession ? 1 : 0, // Count it if it's a unique view session
        lastVisited: rightNow,
        hits: []
      });
      return;
    }

    let evaluationDateStr = formatDateString(record.lastVisited);

    if (evaluationDateStr === todayStr) {
      // SAME DAY: Only increment if this session hasn't loaded this specific page yet today
      if (isNewViewForSession) {
        record.todaysHits += 1;
      }
    } else {
      // NEW DAY DETECTED: Clear out yesterday's memory tracking cache
      countedPageViews.clear();

      console.log(`[Rollover] Moving to new day for path: ${pagePath}. Archiving gap rows...`);
      let isFirstIteration = true;
      const updatedHitsArray = [...record.hits];

      // Turn pages one day at a time until catching up to today
      while (evaluationDateStr !== todayStr) {
        let finalCount = 0;
        
        if (isFirstIteration) {
          finalCount = record.todaysHits;
          isFirstIteration = false;
        }

        updatedHitsArray.push({
          date: evaluationDateStr,
          count: finalCount
        });

        const nextDayObject = advanceByOneDay(evaluationDateStr);
        evaluationDateStr = formatDateString(nextDayObject);
      }

      record.hits = updatedHitsArray;
      
      // Initialize today's new bucket (starts at 1 if unique session view, 0 if it was a refresh bypass)
      record.todaysHits = isNewViewForSession ? 1 : 0; 
    }

    record.lastVisited = rightNow;
    
    record.markModified('hits');
    record.markModified('todaysHits');
    record.markModified('lastVisited');

    await record.save();
    console.log(`[Database Update] ${pagePath} -> todayHits: ${record.todaysHits}`);
  } catch (err) {
    console.error('CRITICAL: Database analytics processing fault:', err);
  }
}

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    const { sessionId } = socket.handshake.auth;

    console.log(`[Connection Attempt] Incoming socket connection string token: ${sessionId}`);

    if (!sessionId) {
      console.error(`[Connection Rejected] Missing authorization payload session token!`);
      return socket.disconnect();
    }

    socket.on('page_view', async (data) => {
      const { pagePath } = data;
      if (!pagePath) return;

      const trackingSignature = `${sessionId}:${pagePath}`;
      let isNewViewForSession = false;

      if (!countedPageViews.has(trackingSignature)) {
        countedPageViews.add(trackingSignature);
        isNewViewForSession = true;
      } else {
        console.log(`[Guard active] Bypass match found for signature: ${trackingSignature}`);
      }

      // 1. Process database mutation tracking mechanics
      await handlePageViewIncrement(pagePath, isNewViewForSession);

      // 2. Fetch updated count to return a verification receipt payload
      const updatedRecord = await PageVisit.findOne({ path: pagePath });

      // Send confirmation event directly back to the active tab console
      socket.emit('page_view_success', {
        path: pagePath,
        todaysHits: updatedRecord ? updatedRecord.todaysHits : 0
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Disconnect Session Completed]: ${sessionId}`);
    });
  });
};