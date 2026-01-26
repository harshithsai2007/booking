import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
    hotel: mongoose.Types.ObjectId;
    type: string; // e.g., Deluxe, Suite, Presidential
    description: string;
    pricePerNight: number;
    capacity: {
        adults: number;
        children: number;
    };
    amenities: string[];
    images: string[];
    count: number; // Total rooms of this type
    isAvailable: boolean;
}

const RoomSchema: Schema = new Schema(
    {
        hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
        type: { type: String, required: true },
        description: { type: String },
        pricePerNight: { type: Number, required: true },
        capacity: {
            adults: { type: Number, required: true },
            children: { type: Number, default: 0 },
        },
        amenities: [{ type: String }],
        images: [{ type: String }],
        count: { type: Number, default: 1 },
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IRoom>('Room', RoomSchema);
