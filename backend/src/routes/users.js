const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /users/{identifier}
// Resolve user DB id by email or get user by ID
router.get('/:identifier', async (req, res, next) => {
  try {
    const { identifier } = req.params;

    // Check if identifier is a UUID (with or without hyphens)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isUuid = uuidRegex.test(identifier);

    let query;
    let params;

    if (isUuid) {
      // Lookup by user ID
      query = 'SELECT id, email FROM users WHERE id = $1';
      params = [identifier];
    } else {
      // Assume it's an email (decode potential URL encoding)
      const email = decodeURIComponent(identifier);
      query = 'SELECT id, email FROM users WHERE email = $1';
      params = [email];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        details: `No user found with identifier: ${identifier}`
      });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
