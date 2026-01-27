import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile, updateProfile, getMyBookings, getFavorites } from '../services/api';
import { User, Mail, Phone, MapPin, Loader, Save, Calendar, Clock, Heart, History, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HotelCard from '../components/features/HotelCard';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'bookings', 'favorites'

    useEffect(() => {
        const fetchAllData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const [profileRes, bookingsRes, favoritesRes] = await Promise.all([
                    getProfile().catch(() => ({ data: null })),
                    getMyBookings().catch(() => ({ data: [] })),
                    getFavorites().catch(() => ({ data: [] }))
                ]);

                if (profileRes.data) {
                    setUser(profileRes.data);
                } else {
                    // Fallback to localStorage if API fails but token exists
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) setUser(JSON.parse(storedUser));
                }

                setBookings(bookingsRes.data || []);
                setFavorites(favoritesRes.data || []);
            } catch (error: any) {
                console.error('Error fetching profile data:', error);
                setMessage('Error loading profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [navigate]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            const res = await updateProfile(user);
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data)); // Sync with localStorage
            window.dispatchEvent(new Event('auth-change')); // Notify Navbar
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-apple-black">
            <Loader className="w-8 h-8 text-white animate-spin" />
        </div>
    );

    // If loading finished and user still null, something is wrong (likely auth failed)
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-apple-black flex-col gap-4 text-white">
                <p>Unable to load user profile. Please log in again.</p>
                <Link to="/login" className="px-6 py-2 bg-white text-black rounded-xl font-bold">Log In</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-apple-black px-4">
            <div className="max-w-6xl mx-auto">

                {/* Profile Header */}
                <div className="relative mb-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center relative shadow-2xl overflow-hidden group">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-zinc-500" />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white cursor-pointer">
                                Change
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold text-white mb-2">{user?.fullName}</h1>
                            <p className="text-zinc-400 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4" /> {user?.email}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-sm">
                                    <span className="text-zinc-500 mr-2">Bookings</span>
                                    <span className="text-white font-bold">{bookings.length}</span>
                                </div>
                                <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-sm">
                                    <span className="text-zinc-500 mr-2">Favorites</span>
                                    <span className="text-white font-bold">{favorites.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex gap-2 mb-8 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800/50 w-fit">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'info' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Settings className="w-4 h-4" /> Profile Info
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'bookings' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <History className="w-4 h-4" /> Booking History
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'favorites' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Heart className="w-4 h-4" /> Favorites
                    </button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'info' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                                    <form onSubmit={handleUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute w-5 h-5 text-zinc-600 left-3 top-2.5" />
                                                    <input
                                                        type="text"
                                                        className="w-full bg-black/30 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/20 transition-colors"
                                                        value={user?.fullName || ''}
                                                        onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Email Address</label>
                                                <div className="relative opacity-50">
                                                    <Mail className="absolute w-5 h-5 text-zinc-600 left-3 top-2.5" />
                                                    <input
                                                        type="email"
                                                        disabled
                                                        className="w-full bg-black/30 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none cursor-not-allowed"
                                                        value={user?.email || ''}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute w-5 h-5 text-zinc-600 left-3 top-2.5" />
                                                    <input
                                                        type="text"
                                                        className="w-full bg-black/30 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/20 transition-colors"
                                                        value={user?.phone || ''}
                                                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-zinc-500 text-xs uppercase tracking-wider font-bold">City / Location</label>
                                                <div className="relative">
                                                    <MapPin className="absolute w-5 h-5 text-zinc-600 left-3 top-2.5" />
                                                    <input
                                                        type="text"
                                                        className="w-full bg-black/30 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/20 transition-colors"
                                                        value={user?.address?.city || ''}
                                                        onChange={(e) => setUser({ ...user, address: { ...user.address, city: e.target.value } })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 pt-4">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="flex-1 md:flex-none px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                                            >
                                                {saving ? <Loader className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> Save Profile</>}
                                            </button>
                                            {message && (
                                                <span className={`text-sm font-medium ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                                                    {message}
                                                </span>
                                            )}
                                        </div>
                                    </form>
                                </div>
                                <div className="space-y-8">
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                                        <h3 className="text-white font-bold mb-4">Account Status</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-zinc-400">Verified User</span>
                                                <span className={user?.isVerified ? 'text-green-400' : 'text-yellow-400'}>
                                                    {user?.isVerified ? 'Yes' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-zinc-400">Account Role</span>
                                                <span className="text-white capitalize">{user?.role || 'User'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div className="space-y-6">
                                {bookings.length > 0 ? (
                                    bookings.map((booking: any) => (
                                        <div key={booking._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all group p-6">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden">
                                                    <img src={booking.hotel?.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-white mb-1">{booking.hotel?.name}</h3>
                                                            <div className="flex items-center gap-3 text-sm text-zinc-500">
                                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.checkInDate).toLocaleDateString()}</span>
                                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.status}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-xl font-bold text-white">₹{booking.totalAmount?.toLocaleString()}</span>
                                                    </div>
                                                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-zinc-800">
                                                        <span className="text-zinc-500 text-xs">Ref: {booking.bookingReference}</span>
                                                        <Link to={`/hotels/${booking.hotelId}`} className="text-white text-sm hover:underline">View Details</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-zinc-800">
                                        <History className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                        <h3 className="text-xl font-medium text-white mb-2">No bookings yet</h3>
                                        <p className="text-zinc-500 mb-6">Looks like you haven't booked any stays yet.</p>
                                        <Link to="/hotels" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">Start Browsing</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div>
                                {favorites.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {favorites.map((hotel: any, index: number) => (
                                            <HotelCard key={hotel.id || index} hotel={hotel} index={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-zinc-800">
                                        <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                        <h3 className="text-xl font-medium text-white mb-2">No favorites yet</h3>
                                        <p className="text-zinc-500 mb-6">Save your favorite hotels to find them easily later.</p>
                                        <Link to="/hotels" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">Find Hotels</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Profile;
