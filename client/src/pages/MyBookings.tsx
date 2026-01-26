import React, { useEffect, useState } from 'react';
import { getMyBookings } from '../services/api';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await getMyBookings();
                setBookings(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <div className="min-h-screen pt-24 text-center text-white">Loading bookings...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-apple-black px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">My Bookings</h1>

                {bookings.length > 0 ? (
                    <div className="space-y-6">
                        {bookings.map((booking: any) => (
                            <div key={booking._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-64 h-48 md:h-auto relative">
                                        <img src={booking.hotel.images[0]} alt={booking.hotel.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium backdrop-blur-md">
                                            {booking.status}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h2 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors">{booking.hotel.name}</h2>
                                                <span className="text-lg font-bold text-white">₹{booking.totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center text-zinc-400 text-sm mb-4">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {booking.hotel.location.city}, {booking.hotel.location.state}
                                            </div>
                                            <div className="flex gap-6 text-sm">
                                                <div className="flex items-center gap-2 text-zinc-300">
                                                    <Calendar className="w-4 h-4 text-zinc-500" />
                                                    <span>{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-300">
                                                    <Clock className="w-4 h-4 text-zinc-500" />
                                                    <span>{Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 3600 * 24))} Nights</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-between items-center pt-4 border-t border-zinc-800">
                                            <span className="text-zinc-500 text-sm">Ref: {booking.bookingReference}</span>
                                            <Link to={`/hotels/${booking.hotel._id}`} className="flex items-center gap-1 text-white text-sm hover:text-zinc-300 transition-colors">
                                                View Hotel <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800">
                        <h3 className="text-xl font-medium text-white mb-2">No bookings found</h3>
                        <p className="text-zinc-500 mb-6">Start planning your next escape to Andhra Pradesh or Telangana.</p>
                        <Link to="/" className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors">
                            Explore Hotels
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
