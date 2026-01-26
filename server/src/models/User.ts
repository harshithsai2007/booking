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
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        phone: { type: String, required: true },
        profileImage: { type: String },
        address: {
            street: String,
            city: String,
            state: String,
            pinCode: String,
        },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
