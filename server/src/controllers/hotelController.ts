import { Request, Response } from 'express';
import Hotel from '../models/Hotel';
import Room from '../models/Room';

export const getHotels = async (req: Request, res: Response) => {
    try {
        const { city, minPrice, maxPrice, stars, amenities, search, sort } = req.query;

        let query: any = {};

        if (city) query['location.city'] = city;
        if (stars) query.starRating = { $in: (stars as string).split(',') }; // e.g. ?stars=3,4,5
        if (minPrice || maxPrice) {
            query['priceRange.min'] = { $gte: Number(minPrice) || 0 };
            if (maxPrice) query['priceRange.max'] = { $lte: Number(maxPrice) };
        }
        if (amenities) {
            query.amenities = { $all: (amenities as string).split(',') };
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } },
                { 'location.state': { $regex: search, $options: 'i' } }
            ];
        }

        let hotels = Hotel.find(query);

        // Sorting
        if (sort === 'priceLow') hotels = hotels.sort({ 'priceRange.min': 1 });
        else if (sort === 'priceHigh') hotels = hotels.sort({ 'priceRange.min': -1 });
        else if (sort === 'rating') hotels = hotels.sort({ rating: -1 });
        else hotels = hotels.sort({ createdAt: -1 }); // Newest/Default

        const results = await hotels.exec();
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getHotelById = async (req: Request, res: Response) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        // Fetch rooms for this hotel
        const rooms = await Room.find({ hotel: hotel._id });

        res.json({ ...hotel.toObject(), rooms });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFeaturedHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ featured: true }).limit(6);
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
