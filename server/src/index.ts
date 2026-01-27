import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Initialize Firebase (no MongoDB!)
import './firestore';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
import authRoutes from './routes/auth';
import hotelRoutes from './routes/hotels';
import bookingRoutes from './routes/bookings';
import userRoutes from './routes/users';

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('LuxStay API is running with Firebase! 🔥');
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('🔥 Using Firebase Firestore');
    console.log('🔑 JWT Secret check:', process.env.JWT_SECRET ? 'Loaded ✅' : 'NOT LOADED ❌');
});
