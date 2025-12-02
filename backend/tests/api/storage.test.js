const { request, getAuthHeader } = require('../utils/helper');
const db = require('../../src/db');

const SEEDED_USER_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

describe('Storage Management', () => {
  describe('Get Presigned URL', () => {
    let sessionId;

    beforeEach(async () => {
      // Create a patient first
      const patient = await db.query(
        'INSERT INTO patients (user_id, name) VALUES ($1, $2) RETURNING id',
        [SEEDED_USER_ID, 'Test Patient']
      ).then(r => r.rows[0]);

      // Create a session
      const session = await db.query(
        `INSERT INTO recording_sessions 
         (patient_id, user_id, patient_name, status, start_time) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id`,
        [patient.id, SEEDED_USER_ID, 'Test Patient', 'recording', new Date()]
      ).then(r => r.rows[0]);

      sessionId = session.id;
    });

    it('should return presigned URL for chunk', async () => {
      const payload = {
        sessionId,
        chunkNumber: 1,
        mimeType: 'audio/wav'
      };

      const res = await request()
        .post('/v1/get-presigned-url')
        .set(getAuthHeader())
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        url: expect.stringContaining(`https://storage.googleapis.com/bucket/sessions/${sessionId}/chunk_1.wav`),
        gcsPath: `sessions/${sessionId}/chunk_1.wav`,
        publicUrl: expect.stringContaining(`https://storage.googleapis.com/bucket/public/sessions/${sessionId}/chunk_1.wav`)
      });
    });

    it('should return 400 for invalid request body', async () => {
      const res = await request()
        .post('/v1/get-presigned-url')
        .set(getAuthHeader())
        .send({ sessionId: 'invalid' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation error');
    });
  });

  describe('Notify Chunk Uploaded', () => {
    let sessionId;

    beforeEach(async () => {
      // Create a patient first
      const patient = await db.query(
        'INSERT INTO patients (user_id, name) VALUES ($1, $2) RETURNING id',
        [SEEDED_USER_ID, 'Test Patient']
      ).then(r => r.rows[0]);

      // Create a session
      const session = await db.query(
        `INSERT INTO recording_sessions 
         (patient_id, user_id, patient_name, status, start_time) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id`,
        [patient.id, SEEDED_USER_ID, 'Test Patient', 'recording', new Date()]
      ).then(r => r.rows[0]);

      sessionId = session.id;
    });

    it('should store chunk info when not last chunk', async () => {
      const payload = {
        sessionId,
        gcsPath: `sessions/${sessionId}/chunk_1.wav`,
        chunkNumber: 1,
        isLast: false,
        totalChunksClient: 5,
        publicUrl: `https://storage.googleapis.com/bucket/public/sessions/${sessionId}/chunk_1.wav`,
        mimeType: 'audio/wav',
        selectedTemplate: 'Default',
        selectedTemplateId: 'template_123',
        model: 'whisper'
      };

      const res = await request()
        .post('/v1/notify-chunk-uploaded')
        .set(getAuthHeader())
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({});

      // Verify chunk was stored
      const chunk = await db.query(
        'SELECT * FROM audio_chunks WHERE session_id = $1 AND chunk_number = $2',
        [sessionId, 1]
      ).then(r => r.rows[0]);

      expect(chunk).toBeDefined();
      expect(chunk.gcs_path).toBe(payload.gcsPath);
      expect(chunk.mime_type).toBe(payload.mimeType);

      // Verify session status is still 'recording' (not completed)
      const session = await db.query(
        'SELECT status FROM recording_sessions WHERE id = $1',
        [sessionId]
      ).then(r => r.rows[0]);

      expect(session.status).toBe('recording');
    });

    it('should update session status when last chunk', async () => {
      const payload = {
        sessionId,
        gcsPath: `sessions/${sessionId}/chunk_5.wav`,
        chunkNumber: 5,
        isLast: true,
        totalChunksClient: 5,
        publicUrl: `https://storage.googleapis.com/bucket/public/sessions/${sessionId}/chunk_5.wav`,
        mimeType: 'audio/wav',
        selectedTemplate: 'Default',
        selectedTemplateId: 'template_123',
        model: 'whisper'
      };

      const res = await request()
        .post('/v1/notify-chunk-uploaded')
        .set(getAuthHeader())
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({});

      // Verify session status updated to 'completed'
      const session = await db.query(
        'SELECT status, end_time FROM recording_sessions WHERE id = $1',
        [sessionId]
      ).then(r => r.rows[0]);

      expect(session.status).toBe('completed');
      expect(session.end_time).toBeDefined();
    });

    it('should return 400 for invalid request body', async () => {
      const res = await request()
        .post('/v1/notify-chunk-uploaded')
        .set(getAuthHeader())
        .send({ sessionId: 'invalid' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation error');
    });
  });
});
