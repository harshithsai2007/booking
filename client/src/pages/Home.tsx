import React, { useEffect, useState } from 'react';
import SearchWidget from '../components/features/SearchWidget';
import HotelCard from '../components/features/HotelCard';
import { getFeaturedHotels } from '../services/api';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const Home = () => {
    const [featuredHotels, setFeaturedHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await getFeaturedHotels();
                setFeaturedHotels(res.data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching hotels:', err);
                setError(err.response?.data?.message || err.message || 'Failed to connect to server');
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-apple-black"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                    >
                        Discover the Soul of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">Telugu Heritage</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-zinc-300 max-w-2xl mx-auto mb-12"
                    >
                        Experience world-class hospitality in the heart of Andhra Pradesh and Telangana.
                        From royal palaces to serene beaches.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex justify-center"
                    >
                        <SearchWidget />
                    </motion.div>
                </div>
            </section>

            {/* Featured Hotels Section */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Featured Destinations</h2>
                        <p className="text-zinc-400">Curated selection of our finest properties.</p>
                    </div>
                    <button className="text-white border-b border-white pb-1 hover:text-zinc-300 hover:border-zinc-300 transition-colors">
                        View All Hotels
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-96 bg-zinc-900/50 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-900/10 rounded-3xl border border-red-500/20 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Connection Error</h3>
                        <p className="text-zinc-400 max-w-sm mx-auto mb-6">
                            {error}. This usually means the server is having trouble connecting to the database.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-zinc-200 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                ) : featuredHotels.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-zinc-500" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No Hotels Found</h3>
                        <p className="text-zinc-400 max-w-sm mx-auto">
                            It seems your database is currently empty. Please run the seeding script to populate your hotel collection.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredHotels.map((hotel, index) => (
                            <HotelCard key={hotel._id || index} hotel={hotel} index={index} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
