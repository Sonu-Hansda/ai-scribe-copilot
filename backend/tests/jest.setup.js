const db = require('../src/db');

beforeAll(async () => {
  // Add missing columns if they don't exist (for compatibility with spec)
  await db.query(`
    ALTER TABLE recording_sessions 
    ADD COLUMN IF NOT EXISTS date DATE,
    ADD COLUMN IF NOT EXISTS session_title TEXT,
    ADD COLUMN IF NOT EXISTS session_summary TEXT;
  `).catch(() => {}); // Ignore errors if columns already exist

  // Truncate all tables except templates/users seeds
  await db.query(`
    TRUNCATE TABLE audio_chunks, recording_sessions, patients RESTART IDENTITY CASCADE;
  `);
});

afterAll(async () => {
  await db.end();
});
