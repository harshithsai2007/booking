import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById, toggleFavorite } from '../services/api';
import { Star, MapPin, Check, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const HotelDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await getHotelById(id!);
                setHotel(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id]);

    const handleBookRoom = (roomId: string) => {
        // Navigate to Booking Page with Hotel and Room ID
        // We can pass state or query params
        navigate(`/booking?hotelId=${id}&roomId=${roomId}`);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!hotel) {
        return <div className="min-h-screen flex items-center justify-center text-white">Hotel not found</div>;
    }

    return (
        <div className="min-h-screen pt-20 pb-12 bg-apple-black">
            {/* Gallery Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[300px] md:h-[500px]">
                    <div className="md:row-span-2 h-full rounded-2xl overflow-hidden relative group">
                        <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    <div className="hidden md:grid grid-cols-2 gap-4 h-full">
                        {hotel.images.slice(1, 5).map((img: string, idx: number) => ( // Placeholder for multiple images if API returns more
                            <div key={idx} className="rounded-2xl overflow-hidden relative group">
                                <img
                                    src={img}
                                    alt={`Gallery ${idx}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        ))}
                        {/* Fallback if only 1 image, show placeholders or duplicate logic */}
                        {hotel.images.length === 1 && (
                            [1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-700">
                                    Image Placeholder
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
                {/* Left Content */}
                <div className="flex-1">
                    <div className="mb-8">
                        <div className="flex justify-between items-start mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{hotel.name}</h1>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleFavorite(hotel._id)}
                                    className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-red-500 transition-all"
                                >
                                    <Heart className="w-6 h-6" />
                                </button>
                                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white font-medium">{hotel.starRating} Stars</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center text-zinc-400 mb-6">
                            <MapPin className="w-5 h-5 mr-2" />
                            {hotel.location.address}, {hotel.location.city}, {hotel.location.state}
                        </div>
                        <p className="text-zinc-300 leading-relaxed text-lg">
                            {hotel.description}
                        </p>
                    </div>

                    <div className="border-t border-zinc-800 py-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                            {hotel.amenities.map((amenity: string) => (
                                <div key={amenity} className="flex items-center gap-3 text-zinc-300">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    {amenity}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-zinc-800 py-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Policies</h2>
                        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                            <div className="flex justify-between mb-4 pb-4 border-b border-zinc-800">
                                <span className="text-zinc-400">Check-in</span>
                                <span className="text-white font-medium">{hotel.policies?.checkInTime || '12:00 PM'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Check-out</span>
                                <span className="text-white font-medium">{hotel.policies?.checkOutTime || '11:00 AM'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Rooms */}
                <div className="lg:w-1/3">
                    <h2 className="text-2xl font-bold text-white mb-6">Select Room</h2>
                    <div className="space-y-6">
                        {hotel.rooms && hotel.rooms.length > 0 ? (
                            hotel.rooms.map((room: any) => (
                                <motion.div
                                    key={room._id}
                                    whileHover={{ y: -5 }}
                                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:shadow-xl transition-all"
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2">{room.type}</h3>
                                        <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{room.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {room.amenities.slice(0, 3).map((am: string) => (
                                                <span key={am} className="text-xs bg-black/30 px-2 py-1 rounded text-zinc-300">{am}</span>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="text-white">
                                                <span className="text-2xl font-bold">₹{room.pricePerNight.toLocaleString()}</span>
                                                <span className="text-sm text-zinc-500"> / night</span>
                                            </div>
                                            <button
                                                onClick={() => handleBookRoom(room._id)}
                                                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
                                            >
                                                Book <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="bg-zinc-900 p-6 rounded-2xl text-center text-zinc-500">
                                No rooms available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
