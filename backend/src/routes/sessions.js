const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validators, validate } = require('../utils/validators');

// POST /v1/upload-session
router.post('/upload-session', validate(validators.uploadSession), async (req, res, next) => {
  try {
    const { patientId, userId, patientName, status, startTime, templateId } = req.body;

    const result = await pool.query(
      `INSERT INTO recording_sessions 
       (patient_id, user_id, patient_name, status, start_time, template_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [patientId, userId, patientName, status, startTime, templateId]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
});

// GET /v1/all-session?userId={userId}
router.get('/all-session', async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter', details: null });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ error: 'Invalid userId format', details: 'Must be a valid UUID' });
    }

    // Join sessions with patients to get patient details
    const result = await pool.query(
      `SELECT 
        rs.id as session_id,
        rs.patient_id,
        rs.user_id,
        rs.patient_name,
        rs.status,
        rs.start_time,
        rs.end_time,
        rs.template_id,
        rs.created_at as session_created_at,
        p.name as patient_name_full,
        p.pronouns,
        p.email,
        p.background,
        p.medical_history,
        p.family_history,
        p.social_history,
        p.previous_treatment
       FROM recording_sessions rs
       LEFT JOIN patients p ON rs.patient_id = p.id
       WHERE rs.user_id = $1
       ORDER BY rs.start_time DESC`,
      [userId]
    );

    // Build response with patientMap
    const sessions = [];
    const patientMap = {};

    result.rows.forEach(row => {
      const session = {
        id: row.session_id,
        patient_id: row.patient_id,
        user_id: row.user_id,
        patient_name: row.patient_name,
        status: row.status,
        start_time: row.start_time,
        end_time: row.end_time,
        template_id: row.template_id,
        created_at: row.session_created_at
      };
      sessions.push(session);

      // Add to patientMap if patient exists
      if (row.patient_id && !patientMap[row.patient_id]) {
        patientMap[row.patient_id] = {
          id: row.patient_id,
          name: row.patient_name_full || row.patient_name,
          pronouns: row.pronouns,
          email: row.email,
          background: row.background,
          medical_history: row.medical_history,
          family_history: row.family_history,
          social_history: row.social_history,
          previous_treatment: row.previous_treatment
        };
      }
    });

    res.json({ sessions, patientMap });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
