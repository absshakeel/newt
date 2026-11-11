import { Request, Response, NextFunction } from 'express';
import Vehicle from '../models/Vehicle';
import VehicleProvider from '../models/VehicleProvider';
import { createVehicleProviderSchema, updateVehicleProviderSchema } from '@gtour/validation';
import { ApiError } from '../utils/ApiError';

export const getAllProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const providers = await VehicleProvider.find()
      .sort({ rating: -1 });

    res.json({
      success: true,
      providers
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await VehicleProvider.findById(req.params.id);

    if (!provider) {
      throw new ApiError('Provider not found', 404, 'PROVIDER_NOT_FOUND');
    }

    const vehicles = await Vehicle.find({ provider_id: req.params.id });

    res.json({
      success: true,
      provider,
      vehicles
    });
  } catch (error) {
    next(error);
  }
};

export const createVehicleProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createVehicleProviderSchema.parse(req.body);

    const provider = await VehicleProvider.create(validatedData);

    res.status(201).json({
      success: true,
      provider
    });
  } catch (error) {
    next(error);
  }
};

export const updateVehicleProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = updateVehicleProviderSchema.parse(req.body);

    const provider = await VehicleProvider.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!provider) {
      throw new ApiError('Provider not found', 404, 'PROVIDER_NOT_FOUND');
    }

    res.json({
      success: true,
      provider
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVehicleProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const provider = await VehicleProvider.findByIdAndDelete(req.params.id);
    if (!provider) {
      throw new ApiError('Provider not found', 404, 'PROVIDER_NOT_FOUND');
    }

    await Vehicle.deleteMany({ provider_id: req.params.id });

    res.json({
      success: true,
      message: 'Provider deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};