import express from 'express';
import { getProfile, updateProfile, getFavorites, toggleFavorite } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/toggle', protect, toggleFavorite);

export default router;
