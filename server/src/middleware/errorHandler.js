import { ZodError } from 'zod';

export function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed. Please verify your input.',
      details: formattedErrors
    });
  }

  // Handle Supabase or PostgreSQL unique violation errors
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      error: 'A record with this information already exists.'
    });
  }

  // Handle standard HTTP or application errors
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'An unexpected internal server error occurred.'
    : err.message || 'An unexpected error occurred.';

  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message || err);

  res.status(statusCode).json({
    success: false,
    error: message
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.originalUrl} not found.`
  });
}
