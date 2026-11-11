import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomAvailability extends Document {
  room_id: mongoose.Types.ObjectId;
  date: Date;
  available_rooms: number;
  price_override?: number;
  status: 'available' | 'unavailable' | 'partial';
  created_at: Date;
  updated_at: Date;
}

const RoomAvailabilitySchema = new Schema<IRoomAvailability>(
  {
    room_id: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    available_rooms: {
      type: Number,
      required: true,
      min: 0
    },
    price_override: {
      type: Number,
      min: 0
    },
    status: {
      type: String,
      enum: ['available', 'unavailable', 'partial'],
      default: 'available'
    }
  },
  {
    timestamps: true
  }
);

// Composite index for availability queries
RoomAvailabilitySchema.index({ room_id: 1, date: 1 }, { unique: true });

export default mongoose.model<IRoomAvailability>('RoomAvailability', RoomAvailabilitySchema);