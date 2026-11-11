import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicleProvider extends Document {
  name: string;
  email?: string;
  phone?: string;
  description?: string;
  rating?: number;
  created_at: Date;
  updated_at: Date;
}

const VehicleProviderSchema = new Schema<IVehicleProvider>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      maxlength: 500
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

VehicleProviderSchema.index({ rating: -1 });

export default mongoose.model<IVehicleProvider>('VehicleProvider', VehicleProviderSchema);