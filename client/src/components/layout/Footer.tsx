import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                <span className="font-bold text-white text-lg">L</span>
                            </div>
                            <span className="text-xl font-medium text-white">LuxStay</span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Discover the finest stays in Andhra Pradesh and Telangana. Curated luxury for the discerning traveler.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link to="/press" className="hover:text-white transition-colors">Press</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Support</h3>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Newsletter</h3>
                        <p className="text-zinc-500 text-sm mb-4">Subscribe for exclusive offers and travel inspiration.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 w-full"
                            />
                            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors">
                                Join
                            </button>
                        </div>
                    </div>

                </div>

                <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-600 text-sm">© 2026 LuxStay. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="text-zinc-600 text-sm">Made with ❤️ for AP & TS</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
