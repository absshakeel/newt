import { Request, Response, NextFunction } from 'express';
import Photographer from '../models/Photographer';
import PhotographyService from '../models/PhotographyService';
import Portfolio from '../models/Portfolio';
import { createPhotographerSchema, updatePhotographerSchema } from '@gtour/validation';
import { ApiError } from '../utils/ApiError';

export const getAllPhotographers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const photographers = await Photographer.find()
      .populate('destination_id', 'name')
      .sort({ rating: -1 });

    res.json({
      success: true,
      photographers
    });
  } catch (error) {
    next(error);
  }
};

export const getPhotographerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const photographer = await Photographer.findById(req.params.id)
      .populate('destination_id', 'name');

    if (!photographer) {
      throw new ApiError('Photographer not found', 404, 'PHOTOGRAPHER_NOT_FOUND');
    }

    const services = await PhotographyService.find({ photographer_id: req.params.id });

    res.json({
      success: true,
      photographer,
      services
    });
  } catch (error) {
    next(error);
  }
};

export const createPhotographer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createPhotographerSchema.parse(req.body);

    const photographer = await Photographer.create(validatedData);

    res.status(201).json({
      success: true,
      photographer
    });
  } catch (error) {
    next(error);
  }
};

export const updatePhotographer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = updatePhotographerSchema.parse(req.body);

    const photographer = await Photographer.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('destination_id', 'name');

    if (!photographer) {
      throw new ApiError('Photographer not found', 404, 'PHOTOGRAPHER_NOT_FOUND');
    }

    res.json({
      success: true,
      photographer
    });
  } catch (error) {
    next(error);
  }
};

export const deletePhotographer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const photographer = await Photographer.findByIdAndDelete(req.params.id);
    if (!photographer) {
      throw new ApiError('Photographer not found', 404, 'PHOTOGRAPHER_NOT_FOUND');
    }

    await PhotographyService.deleteMany({ photographer_id: req.params.id });
    await Portfolio.deleteMany({ photographer_id: req.params.id });

    res.json({
      success: true,
      message: 'Photographer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};