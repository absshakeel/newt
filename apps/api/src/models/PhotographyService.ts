import mongoose, { Schema, Document } from 'mongoose';

export interface IPhotographyService extends Document {
  photographer_id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price_per_session: number;
  duration_hours: number;
  images: string[];
  created_at: Date;
  updated_at: Date;
}

const PhotographyServiceSchema = new Schema<IPhotographyService>(
  {
    photographer_id: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price_per_session: {
      type: Number,
      required: true,
      min: 0
    },
    duration_hours: {
      type: Number,
      required: true,
      min: 0.5
    },
    images: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

PhotographyServiceSchema.index({ photographer_id: 1 });
PhotographyServiceSchema.index({ price_per_session: 1 });

export default mongoose.model<IPhotographyService>('PhotographyService', PhotographyServiceSchema);