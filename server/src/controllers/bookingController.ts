import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Hotel from '../models/Hotel';
import Room from '../models/Room';
import { z } from 'zod';

// Minimal interface for authenticated request (middleware adds user)
interface AuthRequest extends Request {
    user?: any;
}

const createBookingSchema = z.object({
    hotelId: z.string(),
    roomId: z.string(),
    checkInDate: z.string(),
    checkOutDate: z.string(),
    guests: z.object({
        adults: z.number().min(1),
        children: z.number(),
    }),
});

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        console.log('📝 Creating booking for user:', req.user.id);
        const data = createBookingSchema.parse(req.body);

        const room = await Room.findById(data.roomId);
        const hotel = await Hotel.findById(data.hotelId);

        if (!hotel || !room) {
            return res.status(404).json({ message: 'Hotel or Room not found' });
        }

        // Calculate Nights
        const start = new Date(data.checkInDate);
        const end = new Date(data.checkOutDate);
        const timeDiff = Math.abs(end.getTime() - start.getTime());
        const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

        // Calculate Total Price
        const totalAmount = nights * (room.pricePerNight || 5000) * 1.12; // Adding 12% GST

        const bookingReference = `LUX${Date.now()}`;

        // Create booking in MongoDB
        const booking = await Booking.create({
            user: req.user.id,
            hotel: data.hotelId,
            room: data.roomId,
            bookingReference,
            checkInDate: start,
            checkOutDate: end,
            guests: data.guests,
            totalAmount,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'UPI'
        });

        res.status(201).json(booking);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        console.error('createBooking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // Get all bookings for this user and populate hotel and room info
        const bookings = await Booking.find({ user: req.user.id })
            .populate('hotel')
            .populate('room')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error('getMyBookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
