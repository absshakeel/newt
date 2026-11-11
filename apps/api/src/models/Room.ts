import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  hotel_id: mongoose.Types.ObjectId;
  room_type: string;
  bed_type: string;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  images: string[];
  created_at: Date;
  updated_at: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    hotel_id: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true
    },
    room_type: {
      type: String,
      required: true,
      trim: true
    },
    bed_type: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    price_per_night: {
      type: Number,
      required: true,
      min: 0
    },
    amenities: [
      {
        type: String
      }
    ],
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

RoomSchema.index({ hotel_id: 1 });
RoomSchema.index({ price_per_night: 1 });

export default mongoose.model<IRoom>('Room', RoomSchema);