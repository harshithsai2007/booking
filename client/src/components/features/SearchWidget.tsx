import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchWidget = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/hotels?city=${location}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    };

    return (
        <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">

                {/* Location */}
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <MapPin className="w-5 h-5 text-zinc-400 group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Where are you going?"
                        className="w-full h-14 pl-12 pr-4 bg-black/20 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-black/30 transition-all border border-transparent focus:border-white/10"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                {/* Check In */}
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Calendar className="w-5 h-5 text-zinc-400 group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        onFocus={(e) => (e.target.type = 'date')}
                        onBlur={(e) => (e.target.type = 'text')}
                        placeholder="Check In"
                        className="w-full h-14 pl-12 pr-4 bg-black/20 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-black/30 transition-all border border-transparent focus:border-white/10"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                    />
                </div>

                {/* Check Out */}
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Calendar className="w-5 h-5 text-zinc-400 group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        onFocus={(e) => (e.target.type = 'date')}
                        onBlur={(e) => (e.target.type = 'text')}
                        placeholder="Check Out"
                        className="w-full h-14 pl-12 pr-4 bg-black/20 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-black/30 transition-all border border-transparent focus:border-white/10"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                    />
                </div>

                {/* Guests */}
                <div className="w-full md:w-32 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Users className="w-5 h-5 text-zinc-400 group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="number"
                        min="1"
                        placeholder="Guests"
                        className="w-full h-14 pl-12 pr-4 bg-black/20 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 hover:bg-black/30 transition-all border border-transparent focus:border-white/10"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                    />
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className="h-14 px-8 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchWidget;
