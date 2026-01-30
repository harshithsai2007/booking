import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
    hotel: mongoose.Types.ObjectId;
    type: string;
    pricePerNight: number;
    capacity: {
        adults: number;
        children: number;
    };
    amenities: string[];
    availability: boolean;
    count: number;
}

const RoomSchema: Schema = new Schema({
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    type: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    capacity: {
        adults: { type: Number, required: true },
        children: { type: Number, required: true }
    },
    amenities: [{ type: String }],
    availability: { type: Boolean, default: true },
    count: { type: Number, default: 1 }
}, { timestamps: true });

const Room = mongoose.model<IRoom>('Room', RoomSchema);
export default Room;
