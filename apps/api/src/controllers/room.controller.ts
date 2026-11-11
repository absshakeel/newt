import { Request, Response, NextFunction } from 'express';
import Room from '../models/Room';
import RoomAvailability from '../models/RoomAvailability';
import { createRoomSchema, createRoomAvailabilitySchema } from '@gtour/validation';
import { ApiError } from '../utils/ApiError';

/**
 * @swagger
 * /rooms/hotel/{hotelId}:
 *   get:
 *     summary: Get rooms by hotel
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: List of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 rooms:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
export const getRoomsByHotel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rooms = await Room.find({ hotel_id: req.params.hotelId })
      .sort({ price_per_night: 1 });

    res.json({
      success: true,
      rooms
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 room:
 *                   type: object
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
export const getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      throw new ApiError('Room not found', 404, 'ROOM_NOT_FOUND');
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createRoomSchema.parse(req.body);

    const room = await Room.create(validatedData);

    res.status(201).json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createRoomSchema.partial().parse(req.body);

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!room) {
      throw new ApiError('Room not found', 404, 'ROOM_NOT_FOUND');
    }

    res.json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      throw new ApiError('Room not found', 404, 'ROOM_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date } = req.query;

    const availability = await RoomAvailability.find({
      room_id: req.params.id,
      date: date ? new Date(date as string) : { $gte: new Date() }
    }).sort({ date: 1 });

    res.json({
      success: true,
      availability
    });
  } catch (error) {
    next(error);
  }
};

export const createRoomAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createRoomAvailabilitySchema.parse(req.body);

    const availability = await RoomAvailability.create(validatedData);

    res.status(201).json({
      success: true,
      availability
    });
  } catch (error) {
    next(error);
  }
};