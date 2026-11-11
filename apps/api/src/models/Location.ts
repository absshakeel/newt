import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  country: string;
  region?: string;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const LocationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    region: {
      type: String,
      trim: true
    },
    description: {
      type: String
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  {
    timestamps: true
  }
);

LocationSchema.index({ country: 1, region: 1 });
LocationSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<ILocation>('Location', LocationSchema);