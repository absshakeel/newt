import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  description: string;
  images: string[];
  estimated_budget?: number;
  best_visit_season?: string;
  average_rating?: number;
  views: number;
  category_id: mongoose.Types.ObjectId;
  location_id: mongoose.Types.ObjectId;
  archived_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

const DestinationSchema = new Schema<IDestination>(
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
    images: [
      {
        type: String
      }
    ],
    estimated_budget: {
      type: Number,
      min: 0
    },
    best_visit_season: {
      type: String
    },
    average_rating: {
      type: Number,
      min: 0,
      max: 5
    },
    views: {
      type: Number,
      default: 0
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    location_id: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true
    },
    archived_at: {
      type: Date,
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
DestinationSchema.index({ category_id: 1 });
DestinationSchema.index({ location_id: 1 });
DestinationSchema.index({ average_rating: -1 });
DestinationSchema.index({ views: -1 });
DestinationSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IDestination>('Destination', DestinationSchema);