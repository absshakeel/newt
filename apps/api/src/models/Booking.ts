import mongoose, { Schema, Document } from 'mongoose';
import { BookingStatus } from '@gtour/shared-types';

export interface IBooking extends Document {
  booking_reference: string;
  booking_type: 'hotel' | 'photography' | 'vehicle';
  start_date: Date;
  end_date: Date;
  guest_count: number;
  total_amount: number;
  status: BookingStatus;
  special_requests?: string;
  user_id: mongoose.Types.ObjectId;
  hotel_room_id?: mongoose.Types.ObjectId;
  photography_service_id?: mongoose.Types.ObjectId;
  vehicle_id?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    booking_reference: {
      type: String,
      required: true,
      unique: true
    },
    booking_type: {
      type: String,
      enum: ['hotel', 'photography', 'vehicle'],
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    guest_count: {
      type: Number,
      required: true,
      min: 1
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING
    },
    special_requests: {
      type: String,
      maxlength: 500
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hotel_room_id: {
      type: Schema.Types.ObjectId,
      ref: 'Room'
    },
    photography_service_id: {
      type: Schema.Types.ObjectId,
      ref: 'PhotographyService'
    },
    vehicle_id: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
BookingSchema.index({ user_id: 1 });
BookingSchema.index({ booking_reference: 1 }, { unique: true });
BookingSchema.index({ status: 1 });
BookingSchema.index({ start_date: 1, end_date: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);