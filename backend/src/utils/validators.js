const Joi = require('joi');

const validators = {
  // POST /v1/add-patient-ext
  addPatientExt: Joi.object({
    name: Joi.string().required(),
    userId: Joi.string().uuid().required(),
  }),

  // POST /v1/upload-session
  uploadSession: Joi.object({
    patientId: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required(),
    patientName: Joi.string().required(),
    status: Joi.string().valid('recording', 'completed', 'failed').required(),
    startTime: Joi.string().isoDate().required(),
    templateId: Joi.string().allow(null).optional(),
  }),

  // POST /v1/get-presigned-url
  getPresignedUrl: Joi.object({
    sessionId: Joi.string().uuid().required(),
    chunkNumber: Joi.number().integer().min(1).required(),
    mimeType: Joi.string().required(),
  }),

  // POST /v1/notify-chunk-uploaded
  notifyChunkUploaded: Joi.object({
    sessionId: Joi.string().uuid().required(),
    gcsPath: Joi.string().required(),
    chunkNumber: Joi.number().integer().min(1).required(),
    isLast: Joi.boolean().required(),
    totalChunksClient: Joi.number().integer().min(1).required(),
    publicUrl: Joi.string().required(),
    mimeType: Joi.string().required(),
    selectedTemplate: Joi.string().optional(),
    selectedTemplateId: Joi.string().optional(),
    model: Joi.string().optional(),
  }),
};

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details[0].message 
      });
    }
    next();
  };
}

module.exports = { validators, validate };
