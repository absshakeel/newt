import mongoose, { Schema, Document } from 'mongoose';
import { PaymentStatus } from '@gtour/shared-types';

export interface IPayment extends Document {
  booking_id: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_reference?: string;
  payment_status: PaymentStatus;
  payment_date?: Date;
  refund_status?: PaymentStatus;
  created_at: Date;
  updated_at: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    booking_id: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD',
      length: 3
    },
    payment_method: {
      type: String,
      required: true
    },
    transaction_reference: {
      type: String
    },
    payment_status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    payment_date: {
      type: Date
    },
    refund_status: {
      type: String,
      enum: Object.values(PaymentStatus)
    }
  },
  {
    timestamps: true
  }
);

PaymentSchema.index({ booking_id: 1 }, { unique: true });
PaymentSchema.index({ payment_status: 1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);