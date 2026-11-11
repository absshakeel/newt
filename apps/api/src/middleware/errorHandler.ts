import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details
      }
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  });
};