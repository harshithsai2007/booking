import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { User, Mail, Phone, MapPin, Loader, Save } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                setUser(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await updateProfile(user);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center text-white">Loading profile...</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-apple-black px-4">
            <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl text-center ${message.includes('success') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-zinc-500" />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white">
                                Change
                            </div>
                            {/* In a real app, file input would go here */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-zinc-400 text-sm">Full Name</label>
                            <div className="relative">
                                <User className="absolute w-5 h-5 text-zinc-500 left-3 top-2.5" />
                                <input
                                    type="text"
                                    className="w-full bg-black/30 border border-zinc-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-white/30"
                                    value={user.fullName}
                                    onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-zinc-400 text-sm">Email</label>
                            <div className="relative opacity-50">
                                <Mail className="absolute w-5 h-5 text-zinc-500 left-3 top-2.5" />
                                <input
                                    type="email"
                                    disabled
                                    className="w-full bg-black/30 border border-zinc-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 cursor-not-allowed"
                                    value={user.email}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-zinc-400 text-sm">Phone</label>
                            <div className="relative">
                                <Phone className="absolute w-5 h-5 text-zinc-500 left-3 top-2.5" />
                                <input
                                    type="text"
                                    className="w-full bg-black/30 border border-zinc-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-white/30"
                                    value={user.phone}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-zinc-400 text-sm">Address</label>
                            <div className="relative">
                                <MapPin className="absolute w-5 h-5 text-zinc-500 left-3 top-2.5" />
                                <input
                                    type="text"
                                    className="w-full bg-black/30 border border-zinc-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-white/30"
                                    value={user.address?.city || ''}
                                    placeholder="City"
                                    onChange={(e) => setUser({ ...user, address: { ...user.address, city: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
