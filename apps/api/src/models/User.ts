import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, AccountStatus } from '@gtour/shared-types';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  role: UserRole;
  account_status: AccountStatus;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password_hash: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.TOURIST
    },
    account_status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.PENDING_VERIFICATION
    }
  },
  {
    timestamps: true
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema);