import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    name?: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApiError('No token provided', 401, 'NO_TOKEN');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new ApiError('JWT secret is not configured', 500, 'JWT_SECRET_MISSING');
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError('Invalid or expired token', 401, 'INVALID_TOKEN'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError('Not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError('Not authorized', 403, 'FORBIDDEN');
    }

    next();
  };
};