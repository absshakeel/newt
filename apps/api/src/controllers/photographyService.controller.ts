import { Request, Response, NextFunction } from 'express';
import PhotographyService from '../models/PhotographyService';
import Portfolio from '../models/Portfolio';
import { createPhotographyServiceSchema, updatePhotographyServiceSchema } from '@gtour/validation';
import { ApiError } from '../utils/ApiError';

export const getAllServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const services = await PhotographyService.find()
      .populate('photographer_id', 'name profile_image')
      .sort({ price_per_session: 1 });

    res.json({
      success: true,
      services
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await PhotographyService.findById(req.params.id)
      .populate('photographer_id', 'name profile_image');

    if (!service) {
      throw new ApiError('Service not found', 404, 'SERVICE_NOT_FOUND');
    }

    const portfolio = await Portfolio.find({ service_id: req.params.id });

    res.json({
      success: true,
      service,
      portfolio
    });
  } catch (error) {
    next(error);
  }
};

export const createPhotographyService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createPhotographyServiceSchema.parse(req.body);

    const service = await PhotographyService.create(validatedData);

    res.status(201).json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

export const updatePhotographyService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = updatePhotographyServiceSchema.parse(req.body);

    const service = await PhotographyService.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('photographer_id', 'name profile_image');

    if (!service) {
      throw new ApiError('Service not found', 404, 'SERVICE_NOT_FOUND');
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

export const deletePhotographyService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await PhotographyService.findByIdAndDelete(req.params.id);
    if (!service) {
      throw new ApiError('Service not found', 404, 'SERVICE_NOT_FOUND');
    }

    await Portfolio.deleteMany({ service_id: req.params.id });

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};