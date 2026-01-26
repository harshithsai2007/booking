import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getHotelById, createBooking } from '../services/api';
import { Calendar, User, CreditCard, CheckCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Booking = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hotelId = searchParams.get('hotelId');
    const roomId = searchParams.get('roomId');

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [hotel, setHotel] = useState<any>(null);
    const [selectedRoom, setSelectedRoom] = useState<any>(null);

    const [bookingData, setBookingData] = useState({
        checkInDate: '',
        checkOutDate: '',
        guests: { adults: 2, children: 0 }
    });

    useEffect(() => {
        // Check Auth
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }

        const fetchDetails = async () => {
            try {
                const res = await getHotelById(hotelId!);
                setHotel(res.data);
                const room = res.data.rooms.find((r: any) => r._id === roomId);
                setSelectedRoom(room);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (hotelId) fetchDetails();
    }, [hotelId, roomId, navigate]);

    const calculateTotal = () => {
        if (!selectedRoom || !bookingData.checkInDate || !bookingData.checkOutDate) return 0;
        const start = new Date(bookingData.checkInDate);
        const end = new Date(bookingData.checkOutDate);
        const nights = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        if (nights < 1) return 0;
        return nights * selectedRoom.pricePerNight * 1.12; // +12% GST
    };

    const handleBooking = async () => {
        setProcessing(true);
        try {
            await createBooking({
                hotelId, // Should match schema
                roomId,
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                guests: bookingData.guests
            });
            setStep(4); // Success Step
        } catch (error) {
            alert('Booking failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center text-white">Loading booking details...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-apple-black px-4">
            <div className="max-w-4xl mx-auto">

                {/* Progress Bar */}
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 -z-10 rounded-full"></div>
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                            {s === 4 ? <CheckCircle className="w-5 h-5" /> : s}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Form Area */}
                    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-2xl font-bold text-white mb-6">Dates & Guests</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-zinc-400 mb-2">Check-in Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-black/30 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-white/30"
                                            value={bookingData.checkInDate}
                                            onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-zinc-400 mb-2">Check-out Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-black/30 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-white/30"
                                            value={bookingData.checkOutDate}
                                            onChange={(e) => setBookingData({ ...bookingData, checkOutDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-zinc-400 mb-2">Adults</label>
                                            <input
                                                type="number" min="1"
                                                className="w-full bg-black/30 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-white/30"
                                                value={bookingData.guests.adults}
                                                onChange={(e) => setBookingData({ ...bookingData, guests: { ...bookingData.guests, adults: parseInt(e.target.value) } })}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-zinc-400 mb-2">Children</label>
                                            <input
                                                type="number" min="0"
                                                className="w-full bg-black/30 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-white/30"
                                                value={bookingData.guests.children}
                                                onChange={(e) => setBookingData({ ...bookingData, guests: { ...bookingData.guests, children: parseInt(e.target.value) } })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!bookingData.checkInDate || !bookingData.checkOutDate}
                                        className="w-full mt-4 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-2xl font-bold text-white mb-6">Guest Details</h2>
                                <div className="space-y-4">
                                    <p className="text-zinc-400 text-sm">Review your contact information.</p>
                                    {/* Assuming logged in, so pre-filled or just info */}
                                    <div className="bg-black/20 p-4 rounded-xl border border-zinc-800">
                                        <p className="text-white font-medium">Logged in User</p>
                                        <p className="text-zinc-500 text-sm">Example Email (from profile) </p>
                                    </div>

                                    <div>
                                        <label className="block text-zinc-400 mb-2">Special Requests (Optional)</label>
                                        <textarea
                                            className="w-full bg-black/30 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-white/30 h-24"
                                            placeholder="Any special needs?"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(1)} className="flex-1 border border-zinc-700 text-white py-3 rounded-xl hover:bg-zinc-800">Back</button>
                                        <button onClick={() => setStep(3)} className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200">Continue</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-2xl font-bold text-white mb-6">Payment</h2>
                                <div className="space-y-4 mb-6">
                                    <div className="p-4 border border-zinc-700 rounded-xl flex items-center gap-4 bg-black/30 cursor-pointer ring-1 ring-white/50">
                                        <CreditCard className="text-white" />
                                        <div>
                                            <p className="text-white font-medium">Credit/Debit Card</p>
                                            <p className="text-zinc-500 text-xs text-green-400">Mock Payment Enabled</p>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-zinc-800 rounded-xl flex items-center gap-4 opacity-50">
                                        <span className="text-white font-bold">UPI</span>
                                        <p className="text-zinc-500">Google Pay / PhonePe</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="flex-1 border border-zinc-700 text-white py-3 rounded-xl hover:bg-zinc-800">Back</button>
                                    <button
                                        onClick={handleBooking}
                                        disabled={processing}
                                        className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 flex items-center justify-center gap-2"
                                    >
                                        {processing ? <Loader className="animate-spin" /> : `Pay ₹${calculateTotal().toLocaleString()}`}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
                                <p className="text-zinc-400 mb-8">Your reservation at {hotel?.name} is secure.</p>
                                <div className="flex justify-center gap-4">
                                    <button onClick={() => navigate('/bookings')} className="px-6 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700">View Bookings</button>
                                    <button onClick={() => navigate('/')} className="px-6 py-3 bg-white text-black rounded-xl hover:bg-zinc-200">Return Home</button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar Summary */}
                    {step < 4 && (
                        <div className="lg:w-80">
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
                                <div className="flex gap-4 mb-4 pb-4 border-b border-zinc-800">
                                    <img src={hotel?.images[0]} className="w-20 h-20 rounded-lg object-cover" alt="Hotel" />
                                    <div>
                                        <p className="text-white font-medium text-sm">{hotel?.name}</p>
                                        <p className="text-zinc-500 text-xs mt-1">{selectedRoom?.type}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">Price per night</span>
                                        <span className="text-white">₹{selectedRoom?.pricePerNight.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-zinc-400">GST (12%)</span>
                                        <span className="text-white">Included</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-zinc-800">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-white">Total</span>
                                        <span className="text-white">₹{calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Booking;
