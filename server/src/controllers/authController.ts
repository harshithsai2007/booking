import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db, admin } from '../firestore';
import { z } from 'zod';

const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().min(10),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        // Check if user exists
        const usersSnapshot = await db.collection('users')
            .where('email', '==', validatedData.email)
            .limit(1)
            .get();

        if (!usersSnapshot.empty) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(validatedData.password, salt);

        // Create new user
        const userRef = db.collection('users').doc();
        await userRef.set({
            fullName: validatedData.fullName,
            email: validatedData.email,
            password: hashedPassword,
            phone: validatedData.phone,
            profileImage: '',
            address: {},
            role: 'user',
            isVerified: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        const token = jwt.sign(
            { id: userRef.id, role: 'user' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: userRef.id,
                fullName: validatedData.fullName,
                email: validatedData.email,
                role: 'user'
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        // Find user by email
        const usersSnapshot = await db.collection('users')
            .where('email', '==', validatedData.email)
            .limit(1)
            .get();

        if (usersSnapshot.empty) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const userDoc = usersSnapshot.docs[0];
        const userData = userDoc.data();

        const isMatch = await bcrypt.compare(validatedData.password, userData.password || '');
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: userDoc.id, role: userData.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: userDoc.id,
                fullName: userData.fullName,
                email: userData.email,
                role: userData.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
