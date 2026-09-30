const sendSuccess = (res, data, options = {}) => {
  const { status = 200, message, meta } = options;
  const payload = { success: true, data };
  if (message) payload.message = message;
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
};

const sendError = (res, status, code, message, details) => {
  const error = { code, message };
  if (details !== undefined && details !== null) error.details = details;
  return res.status(status).json({ success: false, error });
};

module.exports = { sendSuccess, sendError };
