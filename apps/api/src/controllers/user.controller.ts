import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AccountStatus } from '@gtour/shared-types';
import User from '../models/User';
import Profile from '../models/Profile';
import { ApiError } from '../utils/ApiError';

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().select('-password_hash').sort({ created_at: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
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
 *       403:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password_hash');
    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }
    const profile = await Profile.findOne({ user_id: req.params.id });

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
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }

    await Profile.findOneAndDelete({ user_id: req.params.id });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError('Invalid user id', 400, 'INVALID_ID');
    }
    const { account_status } = req.body as { account_status?: string };
    const allowed = [AccountStatus.ACTIVE, AccountStatus.SUSPENDED, AccountStatus.PENDING_VERIFICATION];
    if (!account_status || !allowed.includes(account_status as AccountStatus)) {
      throw new ApiError('Invalid account status', 400, 'VALIDATION_ERROR');
    }
    const user = await User.findByIdAndUpdate(
      id,
      { account_status },
      { new: true, runValidators: true }
    ).select('-password_hash');
    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};