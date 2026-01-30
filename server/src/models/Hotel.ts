import mongoose, { Schema, Document } from 'mongoose';

export interface IHotel extends Document {
    name: string;
    description: string;
    location: {
        address: string;
        city: string;
        district: string;
        state: string;
        pinCode: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    starRating: number;
    images: string[];
    amenities: string[];
    regionalAmenities: string[];
    policies: {
        checkInTime: string;
        checkOutTime: string;
        cancellationPolicy: string;
    };
    featured: boolean;
    rating: number;
    reviewCount: number;
    priceRange: { min: number; max: number };
    createdAt: Date;
    updatedAt: Date;
}

const HotelSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        pinCode: { type: String, required: true },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    starRating: { type: Number, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    regionalAmenities: [{ type: String }],
    policies: {
        checkInTime: { type: String, default: '12:00 PM' },
        checkOutTime: { type: String, default: '11:00 AM' },
        cancellationPolicy: { type: String, default: 'Free cancellation 24 hours before check-in' }
    },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    priceRange: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    }
}, { timestamps: true });

export default mongoose.model<IHotel>('Hotel', HotelSchema);
