import pool from '../db.js' // MySQL pool
import crypto from 'crypto';

// An in-memory cache to keep track of sessions that have already counted as a page view
// for a specific path today. Format: { "sess_abc123:/inventory/124": true }
const countedPageViews = new Set();

// In-memory batching queue — accumulates increments here instead of hitting
// the DB on every single page view. Format: { "/inventory/124": 3 }
const pendingIncrements = new Map();

const FLUSH_INTERVAL_MS = 5000; // adjust based on how "live" you need the counts to feel

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

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

/**
 * Applies one path's batched increment to the database, safely.
 * Uses a row lock (FOR UPDATE) inside a transaction so concurrent flushes
 * or overlapping requests can never race each other on the same row.
 */
async function flushPathIncrement(pagePath, incrementAmount) {
  const rightNow = new Date();
  const todayStr = formatDateString(rightNow);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Lock the row for the duration of this transaction — any other
    // transaction trying to touch this same path will wait until we commit
    const [rows] = await connection.query(
      'SELECT * FROM page_visits WHERE path = ? FOR UPDATE',
      [pagePath]
    );
    let record = rows[0];

    // If the path tracking page doesn't exist yet, create it
    if (!record) {
      await connection.query(
        `INSERT INTO page_visits (id, path, todays_hits, last_visited, hits, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          generateId(),
          pagePath,
          incrementAmount,
          rightNow,
          JSON.stringify([]),
          rightNow
        ]
      );
      await connection.commit();
      return;
    }

    let evaluationDateStr = formatDateString(record.last_visited);
    let newTodaysHits = record.todays_hits;
    let newHitsArray = record.hits; // already parsed into a JS array by mysql2

    if (evaluationDateStr === todayStr) {
      // SAME DAY: just add the batched increment
      newTodaysHits += incrementAmount;
    } else {
      // NEW DAY DETECTED: archive gap rows, same logic as the original
      console.log(`[Rollover] Moving to new day for path: ${pagePath}. Archiving gap rows...`);
      let isFirstIteration = true;
      const updatedHitsArray = [...newHitsArray];

      while (evaluationDateStr !== todayStr) {
        let finalCount = 0;

        if (isFirstIteration) {
          finalCount = record.todays_hits;
          isFirstIteration = false;
        }

        updatedHitsArray.push({
          date: evaluationDateStr,
          count: finalCount
        });

        const nextDayObject = advanceByOneDay(evaluationDateStr);
        evaluationDateStr = formatDateString(nextDayObject);
      }

      newHitsArray = updatedHitsArray;
      newTodaysHits = incrementAmount; // today starts fresh with this flush's batch
    }

    await connection.query(
      'UPDATE page_visits SET todays_hits = ?, hits = ?, last_visited = ? WHERE id = ?',
      [newTodaysHits, JSON.stringify(newHitsArray), rightNow, record.id]
    );

    await connection.commit();
    console.log(`[Database Update] ${pagePath} -> todaysHits: ${newTodaysHits} (+${incrementAmount})`);

  } catch (err) {
    await connection.rollback();
    console.error(`CRITICAL: Failed to flush increment for ${pagePath}:`, err);
    // Put the lost increment back in the queue so it isn't silently dropped
    pendingIncrements.set(pagePath, (pendingIncrements.get(pagePath) || 0) + incrementAmount);
  } finally {
    connection.release();
  }
}

/**
 * Runs on an interval — drains the in-memory queue and writes each
 * path's accumulated increment to the DB exactly once per flush cycle.
 */
async function flushAllPending() {
  if (pendingIncrements.size === 0) return;

  const snapshot = new Map(pendingIncrements);
  pendingIncrements.clear();

  for (const [pagePath, incrementAmount] of snapshot.entries()) {
    await flushPathIncrement(pagePath, incrementAmount);
  }
}

setInterval(flushAllPending, FLUSH_INTERVAL_MS);

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    const { sessionId } = socket.handshake.auth;

    console.log(`[Connection Attempt] Incoming socket connection string token: ${sessionId}`);

    if (!sessionId) {
      console.error(`[Connection Rejected] Missing authorization payload session token!`);
      return socket.disconnect();
    }

    socket.on('page_view', (data) => {
      const { pagePath } = data;
      if (!pagePath) return;

      const trackingSignature = `${sessionId}:${pagePath}`;

      if (!countedPageViews.has(trackingSignature)) {
        countedPageViews.add(trackingSignature);
        pendingIncrements.set(pagePath, (pendingIncrements.get(pagePath) || 0) + 1);
        socket.emit('page_view_success', { path: pagePath, queued: true });
      } else {
        console.log(`[Guard active] Bypass match found for signature: ${trackingSignature}`);
        socket.emit('page_view_success', { path: pagePath, queued: false });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Disconnect Session Completed]: ${sessionId}`);
    });
  });
};