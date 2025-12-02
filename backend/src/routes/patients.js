const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validators, validate } = require('../utils/validators');

// GET /v1/patients?userId={userId}
router.get('/patients', async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter', details: null });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ error: 'Invalid userId format', details: 'Must be a valid UUID' });
    }

    const result = await pool.query(
      'SELECT id, name FROM patients WHERE user_id = $1',
      [userId]
    );

    res.json({ patients: result.rows });
  } catch (err) {
    next(err);
  }
});

// POST /v1/add-patient-ext
router.post('/add-patient-ext', validate(validators.addPatientExt), async (req, res, next) => {
  try {
    const { name, userId } = req.body;

    const result = await pool.query(
      `INSERT INTO patients (name, user_id, pronouns, email, background, medical_history, family_history, social_history, previous_treatment)
       VALUES ($1, $2, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
       RETURNING id, name, user_id, pronouns`,
      [name, userId]
    );

    const patient = result.rows[0];
    res.status(201).json({ 
      patient: {
        id: patient.id,
        name: patient.name,
        user_id: patient.user_id,
        pronouns: patient.pronouns
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /v1/patient-details/{patientId}
router.get('/patient-details/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(patientId)) {
      return res.status(400).json({ error: 'Invalid patientId format', details: 'Must be a valid UUID' });
    }

    const result = await pool.query(
      'SELECT * FROM patients WHERE id = $1',
      [patientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found', details: null });
    }

    const patient = result.rows[0];
    res.json({
      id: patient.id,
      name: patient.name,
      pronouns: patient.pronouns,
      email: patient.email,
      background: patient.background,
      medical_history: patient.medical_history,
      family_history: patient.family_history,
      social_history: patient.social_history,
      previous_treatment: patient.previous_treatment,
      user_id: patient.user_id,
      created_at: patient.created_at
    });
  } catch (err) {
    next(err);
  }
});

// GET /v1/fetch-session-by-patient/{patientId}
router.get('/fetch-session-by-patient/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(patientId)) {
      return res.status(400).json({ error: 'Invalid patientId format', details: 'Must be a valid UUID' });
    }

    const result = await pool.query(
      `SELECT id, date, session_title, session_summary, start_time 
       FROM recording_sessions 
       WHERE patient_id = $1`,
      [patientId]
    );

    res.json({ sessions: result.rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
