import { Request, Response, NextFunction } from 'express';
import Hotel from '../models/Hotel';
import { hotelSearchSchema } from '@gtour/validation';
import { ApiError } from '../utils/ApiError';

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: Get all hotels
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 hotels:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
export const getAllHotels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hotels = await Hotel.find()
      .populate('destination_id', 'name')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      hotels
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /hotels/{id}:
 *   get:
 *     summary: Get hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 hotel:
 *                   type: object
 *       404:
 *         description: Hotel not found
 *       500:
 *         description: Server error
 */
export const getHotelById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('destination_id', 'name');

    if (!hotel) {
      throw new ApiError('Hotel not found', 404, 'HOTEL_NOT_FOUND');
    }

    res.json({
      success: true,
      hotel
    });
  } catch (error) {
    next(error);
  }
};

export const searchHotels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = hotelSearchSchema.parse(req.query);

    const query: any = {};

    if (validatedData.destination_id) {
      query.destination_id = validatedData.destination_id;
    }

    if (validatedData.min_rating) {
      query.rating = { $gte: validatedData.min_rating };
    }

    if (validatedData.min_price) {
      query.price_per_night = { $gte: validatedData.min_price };
    }

    if (validatedData.max_price) {
      query.price_per_night = { $lte: validatedData.max_price };
    }

    if (validatedData.search) {
      query.$text = { $search: validatedData.search };
    }

    const sort: any = {};
    if (validatedData.sort_by) {
      sort[validatedData.sort_by] = validatedData.sort_order === 'asc' ? 1 : -1;
    }

    const hotels = await Hotel.find(query)
      .populate('destination_id', 'name')
      .sort(sort)
      .skip((validatedData.page - 1) * validatedData.limit)
      .limit(validatedData.limit);

    const total = await Hotel.countDocuments(query);

    res.json({
      success: true,
      hotels,
      pagination: {
        page: validatedData.page,
        limit: validatedData.limit,
        total,
        pages: Math.ceil(total / validatedData.limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = hotelSearchSchema.parse(req.body);

    const hotel = await Hotel.create(validatedData);

    res.status(201).json({
      success: true,
      hotel
    });
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = hotelSearchSchema.partial().parse(req.body);

    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('destination_id', 'name');

    if (!hotel) {
      throw new ApiError('Hotel not found', 404, 'HOTEL_NOT_FOUND');
    }

    res.json({
      success: true,
      hotel
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      throw new ApiError('Hotel not found', 404, 'HOTEL_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};