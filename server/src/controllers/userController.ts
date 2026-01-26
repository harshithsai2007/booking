import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';

interface AuthRequest extends Request {
    user?: any;
}

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.fullName = req.body.fullName || user.fullName;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        user.profileImage = req.body.profileImage || user.profileImage;
        // user.location = req.body.location; // Not in schema

        await user.save();

        res.json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            profileImage: user.profileImage
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
