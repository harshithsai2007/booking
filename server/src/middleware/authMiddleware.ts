import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    console.log('🔒 Auth Check - Headers:', JSON.stringify(req.headers));

    if (req.headers.authorization && req.headers.authorization.toLowerCase().startsWith('bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('🎫 Token found in header');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = decoded;
            console.log('✅ Token verified for user:', (req.user as any).id);
            return next();
        } catch (error: any) {
            console.error('❌ JWT Verify Error Name:', error.name);
            console.error('❌ JWT Verify Error Message:', error.message);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired, please log in again' });
            }
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.warn('⚠️ No token found in headers');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};
