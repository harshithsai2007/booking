import { Request, Response } from 'express';
import { db, admin } from '../firestore';

interface AuthRequest extends Request {
    user?: any;
}

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const userDoc = await db.collection('users').doc(req.user.id).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = userDoc.data();
        const { password, ...userWithoutPassword } = userData as any;

        res.json({ id: userDoc.id, ...userWithoutPassword });
    } catch (error) {
        console.error('getProfile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const { fullName, phone, address, profileImage } = req.body;

        await db.collection('users').doc(req.user.id).update({
            ...(fullName && { fullName }),
            ...(phone && { phone }),
            ...(address && { address }),
            ...(profileImage && { profileImage }),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const updatedDoc = await db.collection('users').doc(req.user.id).get();
        const userData = updatedDoc.data();
        const { password, ...userWithoutPassword } = userData as any;

        res.json(userWithoutPassword);
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

        const userRef = db.collection('users').doc(req.user.id);
        const userDoc = await userRef.get();
        if (!userDoc.exists) return res.status(404).json({ message: 'User not found' });

        const userData = userDoc.data();
        const favorites = userData?.favorites || [];

        const index = favorites.indexOf(hotelId);
        if (index > -1) {
            favorites.splice(index, 1); // Remove
        } else {
            favorites.push(hotelId); // Add
        }

        await userRef.update({ favorites, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        res.json({ favorites });
    } catch (error) {
        console.error('toggleFavorite error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const userDoc = await db.collection('users').doc(req.user.id).get();
        if (!userDoc.exists) return res.status(404).json({ message: 'User not found' });

        const favorites = userDoc.data()?.favorites || [];
        if (favorites.length === 0) return res.json([]);

        // Fetch hotel details for favorites
        const hotelsSnapshot = await db.collection('hotels')
            .where(admin.firestore.FieldPath.documentId(), 'in', favorites.slice(0, 30))
            .get();

        const hotels = hotelsSnapshot.docs.map(doc => ({ id: doc.id, _id: doc.id, ...doc.data() }));
        res.json(hotels);
    } catch (error) {
        console.error('getFavorites error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
