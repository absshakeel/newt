import { Request, Response, NextFunction } from 'express';
import Payment from '../models/Payment';
import { createPaymentSchema, updatePaymentSchema } from '@gtour/validation';
import { ApiError } from '../utils/ApiError';

export const getPaymentByBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payment = await Payment.findOne({ booking_id: req.params.bookingId });

    if (!payment) {
      throw new ApiError('Payment not found', 404, 'PAYMENT_NOT_FOUND');
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    next(error);
  }
};

export const createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createPaymentSchema.parse(req.body);

    const payment = await Payment.create(validatedData);

    res.status(201).json({
      success: true,
      payment
    });
  } catch (error) {
    next(error);
  }
};

export const updatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = updatePaymentSchema.parse(req.body);

    const payment = await Payment.findOneAndUpdate(
      { booking_id: req.params.bookingId },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!payment) {
      throw new ApiError('Payment not found', 404, 'PAYMENT_NOT_FOUND');
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    next(error);
  }
};