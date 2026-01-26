import mongoose, { Schema, Document } from 'mongoose';

export interface IHotel extends Document {
    name: string;
    description: string;
    location: {
        address: string;
        city: string; // e.g., Hyderabad, Vizag
        district: string;
        state: string; // AP or Telangana
        pinCode: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    starRating: number;
    images: string[];
    amenities: string[]; // Standard
    regionalAmenities: string[]; // e.g., "Temple Visit", "Kuchipudi"
    policies: {
        checkInTime: string;
        checkOutTime: string;
        cancellationPolicy: string;
    };
    featured: boolean;
    rating: number;
    reviewCount: number;
    priceRange: { min: number; max: number };
}

const HotelSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        location: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            district: { type: String },
            state: { type: String, required: true },
            pinCode: { type: String, required: true },
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        starRating: { type: Number, required: true, min: 1, max: 5 },
        images: [{ type: String }],
        amenities: [{ type: String }], // WiFi, Pool, etc.
        regionalAmenities: [{ type: String }], // Local specifics
        policies: {
            checkInTime: { type: String, default: '12:00 PM' },
            checkOutTime: { type: String, default: '11:00 AM' },
            cancellationPolicy: { type: String },
        },
        featured: { type: Boolean, default: false },
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        priceRange: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export default mongoose.model<IHotel>('Hotel', HotelSchema);
