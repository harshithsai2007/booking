import { Request, Response } from 'express';
import User from '../models/User';
import Hotel from '../models/Hotel';

interface AuthRequest extends Request {
    user?: any;
}

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('getProfile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const { fullName, phone, address, profileImage } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    ...(fullName && { fullName }),
                    ...(phone && { phone }),
                    ...(address && { address }),
                    ...(profileImage && { profileImage })
                }
            },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('updateProfile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const { hotelId } = req.body;
        if (!hotelId) return res.status(400).json({ message: 'Hotel ID required' });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.favorites.indexOf(hotelId);
        if (index > -1) {
            user.favorites.splice(index, 1); // Remove
        } else {
            user.favorites.push(hotelId); // Add
        }

        await user.save();
        res.json({ favorites: user.favorites });
    } catch (error) {
        console.error('toggleFavorite error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findById(req.user.id).populate('favorites');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user.favorites);
    } catch (error) {
        console.error('getFavorites error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
