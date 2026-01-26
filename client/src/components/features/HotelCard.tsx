import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HotelCardProps {
    hotel: any;
    index: number;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4">
                    <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-md text-xs font-medium text-white border border-white/10">
                        {hotel.featured ? 'Featured' : 'Popular'}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-medium text-white mb-1 group-hover:text-zinc-200 transition-colors">{hotel.name}</h3>
                        <div className="flex items-center text-zinc-400 text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {hotel.location.city}, {hotel.location.state}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm font-medium">{hotel.starRating}</span>
                    </div>
                </div>

                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <p className="text-zinc-500 text-xs uppercase tracking-wide">Starting from</p>
                        <p className="text-xl font-semibold text-white">₹{hotel.priceRange.min.toLocaleString()}<span className="text-zinc-500 text-sm font-normal"> / night</span></p>
                    </div>
                    <Link
                        to={`/hotels/${hotel._id}`}
                        className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default HotelCard;
