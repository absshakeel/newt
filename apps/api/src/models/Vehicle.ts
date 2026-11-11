import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  name: string;
  type: string;
  capacity: number;
  price_per_day: number;
  features: string[];
  images: string[];
  provider_id: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    price_per_day: {
      type: Number,
      required: true,
      min: 0
    },
    features: [
      {
        type: String
      }
    ],
    images: [
      {
        type: String
      }
    ],
    provider_id: {
      type: Schema.Types.ObjectId,
      ref: 'VehicleProvider',
      required: true
    }
  },
  {
    timestamps: true
  }
);

VehicleSchema.index({ provider_id: 1 });
VehicleSchema.index({ price_per_day: 1 });

export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);