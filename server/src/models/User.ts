import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    fullName: string;
    email: string;
    password?: string;
    phone: string;
    profileImage?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        pinCode: string;
    };
    role: 'user' | 'admin';
    isVerified: boolean;
    favorites: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String, required: true },
    profileImage: { type: String, default: '' },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pinCode: { type: String }
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
