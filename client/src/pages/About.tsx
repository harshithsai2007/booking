import React from 'react';
import { Building, Globe, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-apple-black">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Redefining Heritage Hospitality</h1>
                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                        LuxStay is more than just a booking platform. We are curators of experiences, connecting you with the rich cultural tapestry of Andhra Pradesh and Telangana.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"
                            alt="Luxury Interior"
                            className="rounded-2xl shadow-2xl border border-zinc-800"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-white">Our Story</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Founded in 2024, LuxStay began with a simple mission: to showcase the hidden gems of Telugu states in a way that meets global luxury standards. We partner with exclusive properties that offer not just a stay, but a story.
                        </p>
                        <p className="text-zinc-400 leading-relaxed">
                            From the bustling streets of Hyderabad to the serene coast of Vizag, every hotel in our collection is handpicked for its architectural beauty, service excellence, and cultural significance.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
                    {[
                        { icon: Building, label: 'Premium Properties', value: '150+' },
                        { icon: Users, label: 'Happy Guests', value: '50k+' },
                        { icon: Globe, label: 'Cities Covered', value: '12' },
                        { icon: Award, label: 'Awards Won', value: '15' },
                    ].map((stat, index) => (
                        <div key={index} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center hover:border-zinc-700 transition-colors">
                            <stat.icon className="w-8 h-8 text-white mx-auto mb-4" />
                            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-zinc-500 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
