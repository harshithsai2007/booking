import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    hotel: mongoose.Types.ObjectId;
    rating: number; // 1-5
    comment: string;
    categories: {
        cleanliness: number;
        service: number;
        location: number;
        value: number;
    };
}

const ReviewSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        categories: {
            cleanliness: { type: Number, min: 1, max: 5 },
            service: { type: Number, min: 1, max: 5 },
            location: { type: Number, min: 1, max: 5 },
            value: { type: Number, min: 1, max: 5 },
        },
    },
    { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
