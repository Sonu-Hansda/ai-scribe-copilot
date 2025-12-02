const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /v1/fetch-default-template-ext?userId={userId}
router.get('/fetch-default-template-ext', async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId parameter', details: null });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ error: 'Invalid userId format', details: 'Must be a valid UUID' });
    }

    const result = await pool.query(
      'SELECT id, title, type FROM templates WHERE user_id = $1',
      [userId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
