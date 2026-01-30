import { Request, Response } from 'express';
import Hotel from '../models/Hotel';
import Room from '../models/Room';

export const getHotels = async (req: Request, res: Response) => {
    try {
        const { city, minPrice, maxPrice, stars, amenities, search, sort } = req.query;

        let query: any = {};

        // Apply filters
        if (city) {
            query['location.city'] = { $regex: new RegExp(city as string, 'i') };
        }
        if (stars) {
            const starArray = (stars as string).split(',').map(Number);
            query.starRating = { $in: starArray };
        }
        if (minPrice || maxPrice) {
            query['priceRange.min'] = {};
            if (minPrice) query['priceRange.min'].$gte = Number(minPrice);
            if (maxPrice) query['priceRange.min'].$lte = Number(maxPrice);
        }
        if (amenities) {
            const amenitiesArray = (amenities as string).split(',');
            query.amenities = { $all: amenitiesArray };
        }
        if (search) {
            const searchRegex = new RegExp(search as string, 'i');
            query.$or = [
                { name: searchRegex },
                { 'location.city': searchRegex },
                { 'location.state': searchRegex }
            ];
        }

        let mongoQuery = Hotel.find(query);

        // Sorting
        if (sort === 'priceLow') {
            mongoQuery = mongoQuery.sort({ 'priceRange.min': 1 });
        } else if (sort === 'priceHigh') {
            mongoQuery = mongoQuery.sort({ 'priceRange.min': -1 });
        } else if (sort === 'rating') {
            mongoQuery = mongoQuery.sort({ rating: -1 });
        }

        const hotels = await mongoQuery;
        res.json(hotels);
    } catch (error) {
        console.error('getHotels error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getHotelById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const hotel = await Hotel.findById(id);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Fetch rooms associated with the hotel
        const rooms = await Room.find({ hotel: id });

        res.json({ ...hotel.toObject(), rooms });
    } catch (error) {
        console.error('getHotelById error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFeaturedHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ featured: true }).limit(6);
        res.json(hotels);
    } catch (error) {
        console.error('getFeaturedHotels error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
