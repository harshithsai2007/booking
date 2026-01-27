import { Request, Response } from 'express';
import { db, admin } from '../firestore';
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
        console.log('📦 Booking data:', req.body);

        const data = createBookingSchema.parse(req.body);

        // Fetch room from Firestore subcollection
        const roomDoc = await db
            .collection('hotels')
            .doc(data.hotelId)
            .collection('rooms')
            .doc(data.roomId)
            .get();

        let roomData = roomDoc.exists ? roomDoc.data() : null;
        const hotelDoc = await db.collection('hotels').doc(data.hotelId).get();
        let hotelData = hotelDoc.exists ? hotelDoc.data() : null;

        if (!hotelDoc.exists) {
            console.warn('⚠️ Hotel not found:', data.hotelId, '- using fallback');
            hotelData = { name: 'Prototype Hotel', location: { city: 'Unknown', state: 'Unknown' } };
        }

        if (!roomDoc.exists) {
            console.warn('⚠️ Room not found:', data.roomId, 'in hotel:', data.hotelId, '- using fallback');
            roomData = { type: 'Prototype Room', pricePerNight: 5000 };
        }

        // Calculate Nights
        const start = new Date(data.checkInDate);
        const end = new Date(data.checkOutDate);
        const timeDiff = Math.abs(end.getTime() - start.getTime());
        const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

        // Calculate Total Price
        const totalAmount = nights * (roomData?.pricePerNight || 5000) * 1.12; // Adding 12% GST

        const bookingReference = `LUX${Date.now()}`;

        // Create booking in Firestore
        const bookingRef = await db.collection('bookings').add({
            userId: req.user.id,
            hotelId: data.hotelId,
            roomId: data.roomId,
            bookingReference,
            checkInDate: admin.firestore.Timestamp.fromDate(start),
            checkOutDate: admin.firestore.Timestamp.fromDate(end),
            guests: data.guests,
            totalAmount,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'UPI',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const newBooking = await bookingRef.get();
        res.status(201).json({ id: newBooking.id, ...newBooking.data() });
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

        // Get all bookings for this user
        const bookingsSnapshot = await db
            .collection('bookings')
            .where('userId', '==', req.user.id)
            .get();

        const bookings = [];

        // Manually populate hotel and room data
        for (const bookingDoc of bookingsSnapshot.docs) {
            const bookingData = bookingDoc.data();

            // Fetch hotel
            const hotelDoc = await db.collection('hotels').doc(bookingData.hotelId).get();
            const hotelData = hotelDoc.exists ? hotelDoc.data() : {
                name: 'Unknown Hotel',
                location: { city: 'N/A', state: 'N/A' },
                images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800']
            };

            // Fetch room
            const roomDoc = await db
                .collection('hotels')
                .doc(bookingData.hotelId)
                .collection('rooms')
                .doc(bookingData.roomId)
                .get();
            const roomData = roomDoc.exists ? roomDoc.data() : { type: 'Unknown Room', pricePerNight: 0 };

            bookings.push({
                _id: bookingDoc.id,
                ...bookingData,
                hotel: { _id: bookingData.hotelId, ...hotelData },
                room: { _id: bookingData.roomId, ...roomData },
                // Convert Firestore Timestamps to ISO strings for frontend
                checkInDate: bookingData.checkInDate?.toDate?.().toISOString() || bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate?.toDate?.().toISOString() || bookingData.checkOutDate,
            });
        }

        // Sort by createdAt desc in memory
        bookings.sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return (dateB as any) - (dateA as any);
        });

        res.json(bookings);
    } catch (error) {
        console.error('getMyBookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
