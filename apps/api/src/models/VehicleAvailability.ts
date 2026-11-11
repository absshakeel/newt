import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicleAvailability extends Document {
  vehicle_id: mongoose.Types.ObjectId;
  date: Date;
  available_units: number;
  status: 'available' | 'unavailable' | 'partial';
  created_at: Date;
  updated_at: Date;
}

const VehicleAvailabilitySchema = new Schema<IVehicleAvailability>(
  {
    vehicle_id: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    available_units: {
      type: Number,
      required: true,
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
VehicleAvailabilitySchema.index({ vehicle_id: 1, date: 1 }, { unique: true });

export default mongoose.model<IVehicleAvailability>('VehicleAvailability', VehicleAvailabilitySchema);