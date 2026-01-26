import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getHotels } from '../services/api';
import HotelCard from '../components/features/HotelCard';
import FilterSidebar from '../components/features/FilterSidebar';
import { Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Hotels = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Parse filters from URL
    const [filters, setFilters] = useState({
        city: searchParams.get('city') || '',
        minPrice: 0,
        maxPrice: 50000,
        stars: '',
        amenities: '',
        search: ''
    });

    useEffect(() => {
        const fetchHotelsData = async () => {
            setLoading(true);
            try {
                const query = {
                    ...filters,
                    city: filters.city || searchParams.get('city') || ''
                };
                const res = await getHotels(query);
                setHotels(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotelsData();
    }, [filters, searchParams]);

    const updateFilters = (newFilters: any) => {
        setFilters(newFilters);
        // Optional: Update URL params to reflect filters
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Mobile Filter Button */}
                <div className="lg:hidden flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-white">
                        {hotels.length} Hotels Found
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg text-white text-sm"
                    >
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                </div>

                {/* Sidebar */}
                <FilterSidebar
                    filters={filters}
                    setFilters={updateFilters}
                    isOpen={isSidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-6 hidden lg:flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-white">
                            {filters.city ? `Stays in ${filters.city}` : 'All Destinations'}
                        </h1>
                        <span className="text-zinc-400 text-sm">{hotels.length} properties found</span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="h-80 bg-zinc-900 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : hotels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {hotels.map((hotel: any, index: number) => (
                                <HotelCard key={hotel._id} hotel={hotel} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No hotels found</h3>
                            <p className="text-zinc-500">Try adjusting your filters or search for a different city.</p>
                            <button
                                onClick={() => setFilters({ city: '', minPrice: 0, maxPrice: 50000, stars: '', amenities: '', search: '' })}
                                className="mt-6 px-6 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hotels;
