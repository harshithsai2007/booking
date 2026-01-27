import { Timestamp } from 'firebase-admin/firestore';

export interface User {
    fullName: string;
    email: string;
    password?: string;
    phone: string;
    profileImage?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        pinCode: string;
    };
    role: 'user' | 'admin';
    isVerified: boolean;
    favorites: string[]; // List of hotel IDs
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Hotel {
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
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Room {
    type: string;
    pricePerNight: number;
    capacity: { adults: number; children: number };
    amenities: string[];
    availability: boolean;
}

export interface Booking {
    userId: string; // Firebase user ID
    hotelId: string; // Firebase hotel ID
    roomId: string; // Firebase room ID (subcollection)
    bookingReference: string;
    checkInDate: Timestamp;
    checkOutDate: Timestamp;
    guests: {
        adults: number;
        children: number;
    };
    totalAmount: number;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    paymentStatus: 'paid' | 'pending' | 'failed';
    paymentMethod: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Review {
    userId: string;
    hotelId: string;
    rating: number;
    comment: string;
    createdAt: Timestamp;
}
