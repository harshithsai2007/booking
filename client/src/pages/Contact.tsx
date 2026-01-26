import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-apple-black">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
                    <p className="text-zinc-400">We're here to help you plan your perfect stay.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Email</p>
                                        <p className="text-zinc-400">support@luxstay.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Phone</p>
                                        <p className="text-zinc-400">+91 40 1234 5678</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Headquarters</p>
                                        <p className="text-zinc-400">UB City, Vittal Mallya Road,<br />Bangalore, KA 560001</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-64 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                            Map Integration Coming Soon
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">First Name</label>
                                    <input type="text" className="w-full bg-black/30 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" required />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">Last Name</label>
                                    <input type="text" className="w-full bg-black/30 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-sm mb-2">Email</label>
                                <input type="email" className="w-full bg-black/30 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" required />
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-sm mb-2">Message</label>
                                <textarea className="w-full h-32 bg-black/30 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" required></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                            >
                                {submitted ? 'Message Sent!' : <><Send className="w-4 h-4" /> Send Message</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
