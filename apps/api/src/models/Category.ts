import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  icon?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String
    },
    icon: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

CategorySchema.index({ name: 1 }, { unique: true });

export default mongoose.model<ICategory>('Category', CategorySchema);