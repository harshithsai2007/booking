import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Menu, X, LogOut, Settings, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);

    React.useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            setIsAuthenticated(!!token);
            if (userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (e) {
                    console.error('Failed to parse user data from localStorage', e);
                    localStorage.removeItem('user');
                }
            }
        };

        checkAuth();
        // Listen for validation events
        window.addEventListener('storage', checkAuth);
        // Custom event for immediate updates within same tab
        window.addEventListener('auth-change', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-change', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        window.location.href = '/';
    };

    return (
        <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-apple-black/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 ring-1 ring-white/5">
                            <span className="font-bold text-white text-lg">L</span>
                        </div>
                        <span className="self-center text-xl font-medium whitespace-nowrap text-white tracking-tight">LuxStay</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Home</Link>
                        <Link to="/hotels" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Hotels</Link>
                        <Link to="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</Link>
                        <Link to="/contact" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Contact</Link>
                        {isAuthenticated && (
                            <Link to="/bookings" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">My Bookings</Link>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-zinc-400 hover:text-white transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-zinc-600 transition-all">
                                        <span className="font-bold text-white">{user?.fullName?.charAt(0) || <User className="w-5 h-5 text-zinc-400" />}</span>
                                    </div>
                                </button>
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 overflow-hidden z-50">
                                        <div className="px-4 py-2 border-b border-zinc-800">
                                            <p className="text-sm text-white font-medium truncate">{user?.fullName}</p>
                                            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">Profile</Link>
                                        <Link to="/bookings" className="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">My Bookings</Link>
                                        <div className="h-px bg-zinc-800 my-1"></div>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/5 transition-all">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-400 hover:text-white">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-zinc-900 border-b border-zinc-800 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2">
                            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-zinc-800">Home</Link>
                            <Link to="/hotels" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-800">Hotels</Link>
                            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-800">About</Link>
                            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-800">Contact</Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to="/bookings" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:bg-zinc-800">My Bookings</Link>
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-800">Profile</Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-zinc-800"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white bg-white/10 hover:bg-white/20">Login</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
