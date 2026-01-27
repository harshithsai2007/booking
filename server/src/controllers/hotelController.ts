import { Request, Response } from 'express';
import { db } from '../firestore';

export const getHotels = async (req: Request, res: Response) => {
    try {
        const { city, minPrice, maxPrice, stars, amenities, search, sort } = req.query;

        let query = db.collection('hotels');

        // Apply filters
        if (city) {
            query = query.where('location.city', '==', city) as any;
        }
        if (stars) {
            const starArray = (stars as string).split(',').map(Number);
            query = query.where('starRating', 'in', starArray) as any;
        }

        // Fetch all matching hotels
        const snapshot = await query.get();
        let hotels = snapshot.docs.map(doc => ({ id: doc.id, _id: doc.id, ...doc.data() }));

        // Client-side filtering for complex queries (Firebase doesn't support all query types)
        if (minPrice || maxPrice) {
            hotels = hotels.filter((hotel: any) => {
                const min = hotel.priceRange?.min || 0;
                const max = hotel.priceRange?.max || Infinity;
                if (minPrice && min < Number(minPrice)) return false;
                if (maxPrice && max > Number(maxPrice)) return false;
                return true;
            });
        }

        if (amenities) {
            const amenitiesArray = (amenities as string).split(',');
            hotels = hotels.filter((hotel: any) =>
                amenitiesArray.every(a => hotel.amenities?.includes(a))
            );
        }

        if (search) {
            const searchLower = (search as string).toLowerCase();
            hotels = hotels.filter((hotel: any) =>
                hotel.name?.toLowerCase().includes(searchLower) ||
                hotel.location?.city?.toLowerCase().includes(searchLower) ||
                hotel.location?.state?.toLowerCase().includes(searchLower)
            );
        }

        // Sorting
        if (sort === 'priceLow') {
            hotels.sort((a: any, b: any) => (a.priceRange?.min || 0) - (b.priceRange?.min || 0));
        } else if (sort === 'priceHigh') {
            hotels.sort((a: any, b: any) => (b.priceRange?.min || 0) - (a.priceRange?.min || 0));
        } else if (sort === 'rating') {
            hotels.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
        }

        res.json(hotels);
    } catch (error) {
        console.error('getHotels error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getHotelById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const hotelDoc = await db.collection('hotels').doc(id).get();

        if (!hotelDoc.exists) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Fetch rooms subcollection
        const roomsSnapshot = await db.collection('hotels').doc(id).collection('rooms').get();
        const rooms = roomsSnapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));

        res.json({ id: hotelDoc.id, _id: hotelDoc.id, ...hotelDoc.data(), rooms });
    } catch (error) {
        console.error('getHotelById error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFeaturedHotels = async (req: Request, res: Response) => {
    try {
        const snapshot = await db.collection('hotels')
            .where('featured', '==', true)
            .limit(6)
            .get();

        const hotels = snapshot.docs.map(doc => ({ id: doc.id, _id: doc.id, ...doc.data() }));
        res.json(hotels);
    } catch (error) {
        console.error('getFeaturedHotels error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
