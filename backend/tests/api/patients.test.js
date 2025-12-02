const { request, getAuthHeader } = require('../utils/helper');
const db = require('../../src/db');

const SEEDED_USER_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

describe('Patient Management', () => {
  describe('Get Patients', () => {
    it('should return empty list when no patients exist', async () => {
      const res = await request()
        .get('/v1/patients')
        .query({ userId: SEEDED_USER_ID })
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ patients: [] });
    });

    it('should return list of patients', async () => {
      // Create a test patient
      const patient = await db.query(
        'INSERT INTO patients (user_id, name) VALUES ($1, $2) RETURNING id, name',
        [SEEDED_USER_ID, 'John Doe']
      ).then(r => r.rows[0]);

      const res = await request()
        .get('/v1/patients')
        .query({ userId: SEEDED_USER_ID })
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        patients: [{
          id: patient.id,
          name: patient.name
        }]
      });
    });

    it('should return 400 for missing userId', async () => {
      const res = await request()
        .get('/v1/patients')
        .set(getAuthHeader());

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing userId parameter');
    });

    it('should return 400 for invalid userId format', async () => {
      const res = await request()
        .get('/v1/patients')
        .query({ userId: 'invalid-uuid' })
        .set(getAuthHeader());

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid userId format');
    });
  });

  describe('Create Patient', () => {
    it('should create a new patient and return 201', async () => {
      const newPatient = {
        name: 'Jane Smith',
        userId: SEEDED_USER_ID
      };

      const res = await request()
        .post('/v1/add-patient-ext')
        .set(getAuthHeader())
        .send(newPatient);

      expect(res.status).toBe(201);
      expect(res.body.patient).toMatchObject({
        name: newPatient.name,
        user_id: SEEDED_USER_ID,
        pronouns: null
      });
      expect(res.body.patient.id).toBeDefined();
    });

    it('should return 400 for invalid request body', async () => {
      const res = await request()
        .post('/v1/add-patient-ext')
        .set(getAuthHeader())
        .send({ name: 'Missing userId' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation error');
    });
  });

  describe('Get Patient Details', () => {
    let patientId;

    beforeEach(async () => {
      const result = await db.query(
        'INSERT INTO patients (user_id, name, pronouns) VALUES ($1, $2, $3) RETURNING id',
        [SEEDED_USER_ID, 'Test Patient', 'they/them']
      );
      patientId = result.rows[0].id;
    });

    it('should return patient details', async () => {
      const res = await request()
        .get(`/v1/patient-details/${patientId}`)
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: patientId,
        name: 'Test Patient',
        pronouns: 'they/them',
        user_id: SEEDED_USER_ID
      });
    });

    it('should return 404 for unknown patient', async () => {
      const unknownId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567899';
      const res = await request()
        .get(`/v1/patient-details/${unknownId}`)
        .set(getAuthHeader());

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Patient not found');
    });

    it('should return 400 for invalid patientId format', async () => {
      const res = await request()
        .get('/v1/patient-details/invalid-uuid')
        .set(getAuthHeader());

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid patientId format');
    });
  });

  describe('Get Patient Sessions', () => {
    let patientId;

    beforeEach(async () => {
      const result = await db.query(
        'INSERT INTO patients (user_id, name) VALUES ($1, $2) RETURNING id',
        [SEEDED_USER_ID, 'Session Patient']
      );
      patientId = result.rows[0].id;
    });

    it('should return empty sessions list', async () => {
      const res = await request()
        .get(`/v1/fetch-session-by-patient/${patientId}`)
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ sessions: [] });
    });

    it('should return sessions for patient', async () => {
      // Create a session
      const session = await db.query(
        `INSERT INTO recording_sessions 
         (patient_id, user_id, patient_name, status, start_time) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, date, session_title, session_summary, start_time`,
        [patientId, SEEDED_USER_ID, 'Session Patient', 'recording', new Date()]
      ).then(r => r.rows[0]);

      const res = await request()
        .get(`/v1/fetch-session-by-patient/${patientId}`)
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body.sessions).toHaveLength(1);
      expect(res.body.sessions[0].id).toBe(session.id);
    });

    it('should return 400 for invalid patientId format', async () => {
      const res = await request()
        .get('/v1/fetch-session-by-patient/invalid-uuid')
        .set(getAuthHeader());

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid patientId format');
    });
  });
});
