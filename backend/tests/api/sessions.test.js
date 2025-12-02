const { request, getAuthHeader } = require('../utils/helper');
const db = require('../../src/db');

const SEEDED_USER_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

describe('Session Management', () => {
  describe('Create Session', () => {
    let patientId;

    beforeEach(async () => {
      const result = await db.query(
        'INSERT INTO patients (user_id, name) VALUES ($1, $2) RETURNING id',
        [SEEDED_USER_ID, 'Test Patient']
      );
      patientId = result.rows[0].id;
    });

    it('should create a new session and return 201', async () => {
      const newSession = {
        patientId,
        userId: SEEDED_USER_ID,
        patientName: 'Test Patient',
        status: 'recording',
        startTime: new Date().toISOString(),
        templateId: null
      };

      const res = await request()
        .post('/v1/upload-session')
        .set(getAuthHeader())
        .send(newSession);

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();

      // Verify session was created in database
      const dbSession = await db.query(
        'SELECT * FROM recording_sessions WHERE id = $1',
        [res.body.id]
      ).then(r => r.rows[0]);

      expect(dbSession).toBeDefined();
      expect(dbSession.patient_id).toBe(patientId);
      expect(dbSession.status).toBe('recording');
    });

    it('should return 400 for invalid request body', async () => {
      const res = await request()
        .post('/v1/upload-session')
        .set(getAuthHeader())
        .send({ patientId: 'invalid' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation error');
    });
  });

  describe('Get All Sessions', () => {
    let patientId;

    beforeEach(async () => {
      // Clean up any existing sessions for this user to ensure test isolation
      await db.query('DELETE FROM recording_sessions WHERE user_id = $1', [SEEDED_USER_ID]);
      
      const result = await db.query(
        'INSERT INTO patients (user_id, name, pronouns) VALUES ($1, $2, $3) RETURNING id',
        [SEEDED_USER_ID, 'Test Patient', 'they/them']
      );
      patientId = result.rows[0].id;
    });

    it('should return empty list when no sessions exist', async () => {
      const res = await request()
        .get('/v1/all-session')
        .query({ userId: SEEDED_USER_ID })
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ sessions: [], patientMap: {} });
    });

    it('should return sessions with patientMap', async () => {
      // Create a session
      const session = await db.query(
        `INSERT INTO recording_sessions 
         (patient_id, user_id, patient_name, status, start_time) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id`,
        [patientId, SEEDED_USER_ID, 'Test Patient', 'recording', new Date()]
      ).then(r => r.rows[0]);

      const res = await request()
        .get('/v1/all-session')
        .query({ userId: SEEDED_USER_ID })
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body.sessions).toHaveLength(1);
      expect(res.body.sessions[0].id).toBe(session.id);
      expect(res.body.patientMap).toHaveProperty(patientId);
      expect(res.body.patientMap[patientId]).toMatchObject({
        id: patientId,
        name: 'Test Patient',
        pronouns: 'they/them'
      });
    });

    it('should return 400 for missing userId', async () => {
      const res = await request()
        .get('/v1/all-session')
        .set(getAuthHeader());

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing userId parameter');
    });

    it('should return 400 for invalid userId format', async () => {
      const res = await request()
        .get('/v1/all-session')
        .query({ userId: 'invalid-uuid' })
        .set(getAuthHeader());

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid userId format');
    });
  });

  describe('Fetch Sessions by Patient', () => {
    let patientId;

    beforeEach(async () => {
      const result = await db.query(
        'INSERT INTO patients (user_id, name) VALUES ($1, $2) RETURNING id',
        [SEEDED_USER_ID, 'Test Patient']
      );
      patientId = result.rows[0].id;
    });

    it('should return sessions for patient', async () => {
      // Create a session for this patient
      const session = await db.query(
        `INSERT INTO recording_sessions 
         (patient_id, user_id, patient_name, status, start_time) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, date, session_title, session_summary, start_time`,
        [patientId, SEEDED_USER_ID, 'Test Patient', 'recording', new Date()]
      ).then(r => r.rows[0]);

      const res = await request()
        .get(`/v1/fetch-session-by-patient/${patientId}`)
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body.sessions).toHaveLength(1);
      expect(res.body.sessions[0].id).toBe(session.id);
    });
  });
});
