import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FilterSidebarProps {
    filters: any;
    setFilters: (filters: any) => void;
    isOpen?: boolean;
    onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, isOpen, onClose }) => {
    const [priceRange, setPriceRange] = useState(filters.maxPrice || 50000);

    const handleAmenityChange = (amenity: string) => {
        const current = filters.amenities ? filters.amenities.split(',') : [];
        if (current.includes(amenity)) {
            setFilters({ ...filters, amenities: current.filter((a: string) => a !== amenity).join(',') });
        } else {
            setFilters({ ...filters, amenities: [...current, amenity].join(',') });
        }
    };

    return (
        <div className={`
      fixed inset-y-0 left-0 z-40 w-80 bg-zinc-900 border-r border-zinc-800 p-6 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:w-72 lg:bg-transparent lg:border-none lg:p-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-xl font-bold text-white">Filters</h2>
                <button onClick={onClose} className="text-zinc-400 hover:text-white"><X /></button>
            </div>

            <div className="space-y-8">
                {/* Price Range */}
                <div>
                    <h3 className="text-white font-medium mb-4">Price Range</h3>
                    <input
                        type="range"
                        min="500"
                        max="50000"
                        step="100"
                        value={priceRange}
                        onChange={(e) => {
                            setPriceRange(e.target.value);
                            setFilters({ ...filters, maxPrice: e.target.value });
                        }}
                        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between text-xs text-zinc-500 mt-2">
                        <span>₹500</span>
                        <span className="text-white font-medium">₹{parseInt(priceRange).toLocaleString()}</span>
                    </div>
                </div>

                {/* Star Rating */}
                <div>
                    <h3 className="text-white font-medium mb-4">Star Rating</h3>
                    <div className="space-y-2">
                        {[5, 4, 3, 2].map((star) => (
                            <label key={star} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-white focus:ring-0 checked:bg-white checked:border-white transition-colors"
                                    checked={filters.stars?.includes(String(star))}
                                    onChange={(e) => {
                                        const current = filters.stars ? filters.stars.split(',') : [];
                                        const newStars = e.target.checked
                                            ? [...current, String(star)].join(',')
                                            : current.filter((s: string) => s !== String(star)).join(',');
                                        setFilters({ ...filters, stars: newStars });
                                    }}
                                />
                                <span className="text-zinc-400 group-hover:text-white transition-colors text-sm">{star} Stars</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Create Amenities */}
                <div>
                    <h3 className="text-white font-medium mb-4">Amenities</h3>
                    <div className="space-y-2">
                        {['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'AC'].map((amenity) => (
                            <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-white focus:ring-0 checked:bg-white checked:border-white transition-colors"
                                    checked={filters.amenities?.includes(amenity)}
                                    onChange={() => handleAmenityChange(amenity)}
                                />
                                <span className="text-zinc-400 group-hover:text-white transition-colors text-sm">{amenity}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
