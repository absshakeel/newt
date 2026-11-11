import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { uploadImageToR2 } from '../utils/r2Upload';

export const uploadSingleImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      throw new ApiError('No image file provided', 400, 'NO_FILE');
    }

    const { url, key } = await uploadImageToR2(file);
    res.status(201).json({ success: true, url, key });
  } catch (error) {
    next(error);
  }
};
