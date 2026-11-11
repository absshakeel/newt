import mongoose, { Schema, Document } from 'mongoose';

export interface IPhotographer extends Document {
  name: string;
  bio?: string;
  email?: string;
  phone?: string;
  profile_image?: string;
  rating?: number;
  destination_id?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const PhotographerSchema = new Schema<IPhotographer>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      maxlength: 500
    },
    email: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    profile_image: {
      type: String
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    destination_id: {
      type: Schema.Types.ObjectId,
      ref: 'Destination'
    }
  },
  {
    timestamps: true
  }
);

PhotographerSchema.index({ destination_id: 1 });
PhotographerSchema.index({ rating: -1 });

export default mongoose.model<IPhotographer>('Photographer', PhotographerSchema);