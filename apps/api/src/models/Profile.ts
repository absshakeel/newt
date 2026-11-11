import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  user_id: mongoose.Types.ObjectId;
  bio?: string;
  preferred_language?: string;
  travel_preferences?: string[];
  profile_image?: string;
  date_of_birth?: Date;
  address?: string;
}

const ProfileSchema = new Schema<IProfile>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bio: {
      type: String,
      maxlength: 500
    },
    preferred_language: {
      type: String
    },
    travel_preferences: [
      {
        type: String
      }
    ],
    profile_image: {
      type: String
    },
    date_of_birth: {
      type: Date
    },
    address: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

ProfileSchema.index({ user_id: 1 }, { unique: true });

export default mongoose.model<IProfile>('Profile', ProfileSchema);