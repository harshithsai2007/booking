import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    user: mongoose.Types.ObjectId;
    hotel: mongoose.Types.ObjectId;
    room: mongoose.Types.ObjectId;
    bookingReference: string;
    checkInDate: Date;
    checkOutDate: Date;
    guests: {
        adults: number;
        children: number;
    };
    totalAmount: number;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    paymentStatus: 'paid' | 'pending' | 'failed';
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    bookingReference: { type: String, required: true, unique: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: {
        adults: { type: Number, required: true },
        children: { type: Number, required: true }
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'pending', 'cancelled', 'completed'], default: 'confirmed' },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
    paymentMethod: { type: String, default: 'UPI' }
}, { timestamps: true });

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
