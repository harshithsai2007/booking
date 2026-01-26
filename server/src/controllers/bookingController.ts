import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Room from '../models/Room';
import Hotel from '../models/Hotel';
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

        const data = createBookingSchema.parse(req.body);

        const room = await Room.findById(data.roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const hotel = await Hotel.findById(data.hotelId);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        // Calculate Nights
        const start = new Date(data.checkInDate);
        const end = new Date(data.checkOutDate);
        const timeDiff = Math.abs(end.getTime() - start.getTime());
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (nights < 1) return res.status(400).json({ message: 'Invalid dates' });

        // Calculate Total Price
        const totalAmount = nights * room.pricePerNight * 1.12; // Adding 12% GST roughly

        const bookingReference = `LUX${Date.now()}`;

        const booking = new Booking({
            user: req.user.id,
            hotel: data.hotelId,
            room: data.roomId,
            bookingReference,
            checkInDate: start,
            checkOutDate: end,
            guests: data.guests,
            totalAmount,
            status: 'confirmed', // Auto-confirm for demo
            paymentStatus: 'paid', // Mock payment
            paymentMethod: 'UPI',
        });

        await booking.save();

        res.status(201).json(booking);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const bookings = await Booking.find({ user: req.user.id })
            .populate('hotel', 'name location images')
            .populate('room', 'type')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
