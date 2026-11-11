import mongoose, { Schema, Document } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  description: string;
  address: string;
  phone?: string;
  email?: string;
  images: string[];
  rating?: number;
  destination_id: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const HotelSchema = new Schema<IHotel>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    images: [
      {
        type: String
      }
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    destination_id: {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
      required: true
    }
  },
  {
    timestamps: true
  }
);

HotelSchema.index({ destination_id: 1 });
HotelSchema.index({ rating: -1 });
HotelSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IHotel>('Hotel', HotelSchema);