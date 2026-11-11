import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
  photographer_id: mongoose.Types.ObjectId;
  service_id: mongoose.Types.ObjectId;
  images: string[];
  description?: string;
  created_at: Date;
  updated_at: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    photographer_id: {
      type: Schema.Types.ObjectId,
      ref: 'Photographer',
      required: true
    },
    service_id: {
      type: Schema.Types.ObjectId,
      ref: 'PhotographyService',
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

PortfolioSchema.index({ photographer_id: 1, service_id: 1 }, { unique: true });

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);