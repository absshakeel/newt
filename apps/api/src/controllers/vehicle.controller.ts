import { Request, Response, NextFunction } from 'express';
import Vehicle from '../models/Vehicle';
import VehicleAvailability from '../models/VehicleAvailability';
import { createVehicleSchema, updateVehicleSchema, createVehicleAvailabilitySchema } from '@gtour/validation';
import { ApiError } from '../utils/ApiError';

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vehicles:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
export const getAllVehicles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicles = await Vehicle.find()
      .populate('provider_id', 'name')
      .sort({ price_per_day: 1 });

    res.json({
      success: true,
      vehicles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 vehicle:
 *                   type: object
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
export const getVehicleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('provider_id', 'name');

    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404, 'VEHICLE_NOT_FOUND');
    }

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createVehicleSchema.parse(req.body);

    const vehicle = await Vehicle.create(validatedData);

    res.status(201).json({
      success: true,
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = updateVehicleSchema.parse(req.body);

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('provider_id', 'name');

    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404, 'VEHICLE_NOT_FOUND');
    }

    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      throw new ApiError('Vehicle not found', 404, 'VEHICLE_NOT_FOUND');
    }

    await VehicleAvailability.deleteMany({ vehicle_id: req.params.id });

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicleAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date } = req.query;

    const availability = await VehicleAvailability.find({
      vehicle_id: req.params.id,
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

export const createVehicleAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createVehicleAvailabilitySchema.parse(req.body);

    const availability = await VehicleAvailability.create(validatedData);

    res.status(201).json({
      success: true,
      availability
    });
  } catch (error) {
    next(error);
  }
};