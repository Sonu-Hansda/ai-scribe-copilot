const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validators, validate } = require('../utils/validators');

// POST /v1/get-presigned-url
router.post('/get-presigned-url', validate(validators.getPresignedUrl), async (req, res, next) => {
  try {
    const { sessionId, chunkNumber, mimeType } = req.body;

    // Generate fake GCS path as per spec
    const gcsPath = `sessions/${sessionId}/chunk_${chunkNumber}.wav`;
    const bucket = 'bucket'; // placeholder bucket name

    res.json({
      url: `https://storage.googleapis.com/${bucket}/${gcsPath}`,
      gcsPath: gcsPath,
      publicUrl: `https://storage.googleapis.com/${bucket}/public/${gcsPath}`
    });
  } catch (err) {
    next(err);
  }
});

// POST /v1/notify-chunk-uploaded
router.post('/notify-chunk-uploaded', validate(validators.notifyChunkUploaded), async (req, res, next) => {
  try {
    const {
      sessionId,
      gcsPath,
      chunkNumber,
      isLast,
      totalChunksClient,
      publicUrl,
      mimeType,
      selectedTemplate,
      selectedTemplateId,
      model
    } = req.body;

    // Upsert into audio_chunks table
    await pool.query(
      `INSERT INTO audio_chunks (session_id, chunk_number, gcs_path, public_url, mime_type)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (session_id, chunk_number) 
       DO UPDATE SET gcs_path = $3, public_url = $4, mime_type = $5, uploaded_at = NOW()`,
      [sessionId, chunkNumber, gcsPath, publicUrl, mimeType]
    );

    // If this is the last chunk, update session status to 'completed'
    if (isLast) {
      await pool.query(
        `UPDATE recording_sessions 
         SET status = 'completed', end_time = NOW()
         WHERE id = $1`,
        [sessionId]
      );
    }

    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
