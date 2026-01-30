import React, { useEffect, useState } from 'react';
import SearchWidget from '../components/features/SearchWidget';
import HotelCard from '../components/features/HotelCard';
import { getFeaturedHotels } from '../services/api';
import { motion } from 'framer-motion';

const Home = () => {
    const [featuredHotels, setFeaturedHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await getFeaturedHotels();
                setFeaturedHotels(res.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
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
