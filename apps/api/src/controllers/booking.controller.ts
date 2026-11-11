import { Response, NextFunction } from 'express';
import Booking from '../models/Booking';
import RoomAvailability from '../models/RoomAvailability';
import Payment from '../models/Payment';
import { createBookingSchema, updateBookingSchema } from '@gtour/validation';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiError } from '../utils/ApiError';

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError('Not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const validatedData = createBookingSchema.parse(req.body);

    // Validate dates
    if (new Date(validatedData.start_date) >= new Date(validatedData.end_date)) {
      throw new ApiError('End date must be after start date', 400, 'INVALID_DATES');
    }

    // Generate booking reference
    const bookingReference = `BTG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create booking
    const booking = await Booking.create({
      ...validatedData,
      booking_reference: bookingReference,
      user_id: req.user.userId
    });

    // Handle hotel booking
    if (validatedData.booking_type === 'hotel' && validatedData.hotel_room_id) {
      // Check availability
      const availability = await RoomAvailability.findOne({
        room_id: validatedData.hotel_room_id,
        date: { $gte: validatedData.start_date, $lte: validatedData.end_date }
      });

      if (!availability || availability.available_rooms <= 0) {
        throw new ApiError('No available rooms for the selected dates', 400, 'NO_AVAILABILITY');
      }

      // Update availability
      await RoomAvailability.updateMany(
        {
          room_id: validatedData.hotel_room_id,
          date: { $gte: validatedData.start_date, $lte: validatedData.end_date }
        },
        { $inc: { available_rooms: -1 } }
      );
    }

    // Create payment record
    await Payment.create({
      booking_id: booking._id,
      amount: validatedData.total_amount,
      currency: 'USD',
      payment_method: 'pending',
      payment_status: 'pending'
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError('Not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const booking = await Booking.findById(req.params.id)
      .populate('user_id', 'name email')
      .populate('hotel_room_id')
      .populate('photography_service_id')
      .populate('vehicle_id');

    if (!booking) {
      throw new ApiError('Booking not found', 404, 'BOOKING_NOT_FOUND');
    }

    // Check ownership
    if (booking.user_id.toString() !== req.user.userId.toString()) {
      throw new ApiError('Not authorized to access this booking', 403, 'FORBIDDEN');
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError('Not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const bookings = await Booking.find({ user_id: req.user.userId })
      .populate('hotel_room_id')
      .populate('photography_service_id')
      .populate('vehicle_id')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError('Not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const validatedData = updateBookingSchema.parse(req.body);

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true, runValidators: true }
    ).populate('user_id', 'name email')
     .populate('hotel_room_id')
     .populate('photography_service_id')
     .populate('vehicle_id');

    if (!booking) {
      throw new ApiError('Booking not found', 404, 'BOOKING_NOT_FOUND');
    }

    // Check ownership
    if (booking.user_id.toString() !== req.user.userId.toString()) {
      throw new ApiError('Not authorized to update this booking', 403, 'FORBIDDEN');
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError('Not authenticated', 401, 'NOT_AUTHENTICATED');
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    ).populate('user_id', 'name email')
     .populate('hotel_room_id')
     .populate('photography_service_id')
     .populate('vehicle_id');

    if (!booking) {
      throw new ApiError('Booking not found', 404, 'BOOKING_NOT_FOUND');
    }

    // Check ownership
    if (booking.user_id.toString() !== req.user.userId.toString()) {
      throw new ApiError('Not authorized to cancel this booking', 403, 'FORBIDDEN');
    }

    // Refund payment if completed
    if (booking.status === 'completed') {
      await Payment.findOneAndUpdate(
        { booking_id: booking._id },
        { payment_status: 'refunded', refund_status: 'refunded' }
      );
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};