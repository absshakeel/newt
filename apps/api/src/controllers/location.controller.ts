import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import Location from '../models/Location';
import { ApiError } from '../utils/ApiError';
import { createLocationSchema, updateLocationSchema } from '@gtour/validation';

function assertObjectId(id: string | string[] | undefined): string {
  const value = Array.isArray(id) ? id[0] : id;
  if (!value || !mongoose.isValidObjectId(value)) throw new ApiError('Invalid location id', 400, 'INVALID_ID');
  return value;
}

function handleZod(error: unknown): never | void {
  if (error instanceof ZodError) throw new ApiError('Validation failed', 400, 'VALIDATION_ERROR', error.flatten());
}

export const getAllLocations = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const locations = await Location.find().sort({ country: 1, name: 1 });
    res.json({ success: true, locations });
  } catch (error) {
    next(error);
  }
};

export const getLocationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = assertObjectId(req.params.id);
    const location = await Location.findById(id);
    if (!location) throw new ApiError('Location not found', 404, 'LOCATION_NOT_FOUND');
    res.json({ success: true, location });
  } catch (error) {
    next(error);
  }
};

export const createLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createLocationSchema.parse(req.body);
    const location = await Location.create(data);
    res.status(201).json({ success: true, location });
  } catch (error) {
    try { handleZod(error); } catch (e) { return next(e); }
    next(error);
  }
};

export const updateLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = assertObjectId(req.params.id);
    const data = updateLocationSchema.parse(req.body);
    const location = await Location.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!location) throw new ApiError('Location not found', 404, 'LOCATION_NOT_FOUND');
    res.json({ success: true, location });
  } catch (error) {
    try { handleZod(error); } catch (e) { return next(e); }
    next(error);
  }
};

export const deleteLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = assertObjectId(req.params.id);
    const location = await Location.findByIdAndDelete(id);
    if (!location) throw new ApiError('Location not found', 404, 'LOCATION_NOT_FOUND');
    res.json({ success: true, message: 'Location deleted successfully' });
  } catch (error) {
    next(error);
  }
};
