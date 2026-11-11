import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AccountStatus } from '@gtour/shared-types';
import User from '../models/User';
import Profile from '../models/Profile';
import { z } from 'zod';
import { registerSchema, loginSchema, updateUserSchema } from '@gtour/validation';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiError } from '../utils/ApiError';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               name:
 *                 type: string
 *                 minLength: 2
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [tourist, hotel_owner, photographer, vehicle_provider, admin]
 *               account_status:
 *                 type: string
 *                 enum: [active, suspended, pending_verification]
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     token:
 *                       type: string
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
export const register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body) as {
      email: string;
      password: string;
      name: string;
      phone?: string;
      role?: string;
      account_status?: string;
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      throw new ApiError('User with this email already exists', 409, 'USER_EXISTS');
    }

    // Hash password
    const password_hash = await bcrypt.hash(validatedData.password, 10);

    // Email verification is not enabled for local development, so self-registered
    // accounts are activated immediately unless a specific status is provided.
    const accountStatus = validatedData.account_status ?? AccountStatus.ACTIVE;

    // Create user
    const user = await User.create({
      email: validatedData.email,
      password_hash,
      name: validatedData.name,
      phone: validatedData.phone,
      role: validatedData.role,
      account_status: accountStatus
    });

    // Create profile
    await Profile.create({
      user_id: user._id
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new ApiError('JWT secret is not configured', 500, 'JWT_SECRET_MISSING');
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          account_status: user.account_status
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     token:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account not active
 *       500:
 *         description: Server error
 */
export const login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body) as {
      email: string;
      password: string;
    };

    // Find user
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Check account status. In non-production/local environments, auto-activate
    // pending accounts since email verification is not required.
    if (user.account_status !== AccountStatus.ACTIVE) {
      if (process.env.NODE_ENV !== 'production' && user.account_status === AccountStatus.PENDING_VERIFICATION) {
        user.account_status = AccountStatus.ACTIVE;
        await user.save();
      } else {
        throw new ApiError('Account is not active', 403, 'ACCOUNT_NOT_ACTIVE');
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password_hash);
    if (!isPasswordValid) {
      throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new ApiError('JWT secret is not configured', 500, 'JWT_SECRET_MISSING');
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          account_status: user.account_status
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current user's account and profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user and profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     profile:
 *                       type: object
 *       401:
 *         description: Not authenticated
 */
export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError('Not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const user = await User.findById(req.user.userId).select('-password_hash');
    const profile = await Profile.findOne({ user_id: req.user.userId });

    res.json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update current user's account and profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               phone:
 *                 type: string
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *               preferred_language:
 *                 type: string
 *               travel_preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *               profile_image:
 *                 type: string
 *                 format: uri
 *               date_of_birth:
 *                 type: string
 *                 description: ISO date string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     profile:
 *                       type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 */
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError('Not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const body = { ...(req.body as Record<string, unknown>) };
    if (body.profile_image === '') delete body.profile_image;
    if (body.date_of_birth === '') body.date_of_birth = '';

    const validatedData = updateUserSchema.extend({
      date_of_birth: updateUserSchema.shape.date_of_birth.or(z.literal('')).optional(),
    }).parse(body) as {
      name?: string;
      phone?: string;
      bio?: string;
      preferred_language?: string;
      travel_preferences?: string[];
      profile_image?: string;
      date_of_birth?: string;
      address?: string;
    };

    const userUpdates: Record<string, unknown> = {};
    if (validatedData.name !== undefined) userUpdates.name = validatedData.name;
    if (validatedData.phone !== undefined) userUpdates.phone = validatedData.phone;

    const profileUpdates: Record<string, unknown> = {};
    const profileUnsets: Record<string, 1> = {};
    if (validatedData.bio !== undefined) profileUpdates.bio = validatedData.bio;
    if (validatedData.preferred_language !== undefined) profileUpdates.preferred_language = validatedData.preferred_language;
    if (validatedData.travel_preferences !== undefined) profileUpdates.travel_preferences = validatedData.travel_preferences;
    if (validatedData.profile_image !== undefined) {
      profileUpdates.profile_image = validatedData.profile_image;
    }
    // allow explicit clear from raw body (removed before parse for URL validation)
    if ((req.body as Record<string, unknown>)?.profile_image === '') {
      delete profileUpdates.profile_image;
      profileUnsets.profile_image = 1;
    }
    if (validatedData.address !== undefined) profileUpdates.address = validatedData.address;
    if (validatedData.date_of_birth !== undefined) {
      if (validatedData.date_of_birth === '') {
        profileUnsets.date_of_birth = 1;
      } else {
        const dob = new Date(validatedData.date_of_birth);
        if (Number.isNaN(dob.getTime())) {
          throw new ApiError('Invalid date of birth', 400, 'VALIDATION_ERROR');
        }
        profileUpdates.date_of_birth = dob;
      }
    }

    let user = await User.findById(req.user.userId).select('-password_hash');
    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (Object.keys(userUpdates).length > 0) {
      const updatedUser = await User.findByIdAndUpdate(req.user.userId, userUpdates, {
        new: true,
        runValidators: true,
      }).select('-password_hash');
      user = updatedUser ?? user;
    }

    const profileOps: Record<string, Record<string, unknown>> = {};
    if (Object.keys(profileUpdates).length > 0) profileOps.$set = profileUpdates;
    if (Object.keys(profileUnsets).length > 0) profileOps.$unset = profileUnsets;

    let profile = await Profile.findOne({ user_id: req.user.userId });
    if (Object.keys(profileOps).length > 0 || !profile) {
      profile = await Profile.findOneAndUpdate(
        { user_id: req.user.userId },
        Object.keys(profileOps).length > 0 ? profileOps : { $setOnInsert: { user_id: req.user.userId } },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
    }

    res.json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};