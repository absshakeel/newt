import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import Category from '../models/Category';
import { ApiError } from '../utils/ApiError';
import { createCategorySchema, updateCategorySchema } from '@gtour/validation';

function assertObjectId(id: string | string[] | undefined): string {
  const value = Array.isArray(id) ? id[0] : id;
  if (!value || !mongoose.isValidObjectId(value)) throw new ApiError('Invalid category id', 400, 'INVALID_ID');
  return value;
}

function handleZod(error: unknown): never | void {
  if (error instanceof ZodError) throw new ApiError('Validation failed', 400, 'VALIDATION_ERROR', error.flatten());
}

export const getAllCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = assertObjectId(req.params.id);
    const category = await Category.findById(id);
    if (!category) throw new ApiError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createCategorySchema.parse(req.body);
    const category = await Category.create(data);
    res.status(201).json({ success: true, category });
  } catch (error) {
    try { handleZod(error); } catch (e) { return next(e); }
    if ((error as any)?.code === 11000) return next(new ApiError('Category name already exists', 409, 'DUPLICATE'));
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = assertObjectId(req.params.id);
    const data = updateCategorySchema.parse(req.body);
    const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!category) throw new ApiError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    res.json({ success: true, category });
  } catch (error) {
    try { handleZod(error); } catch (e) { return next(e); }
    if ((error as any)?.code === 11000) return next(new ApiError('Category name already exists', 409, 'DUPLICATE'));
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = assertObjectId(req.params.id);
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new ApiError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
