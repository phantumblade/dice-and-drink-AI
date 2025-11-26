import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Shield, Clock, Heart, Settings, Trophy, Calendar, DollarSign, X, Check, Gamepad2, Timer, Swords } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTournaments } from '../contexts/TournamentContext';

interface ProfileProps {
    user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
    const { updateProfile, withdrawFromTournament } = useUser();
    const { tournaments } = useTournaments();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user.name,
        email: user.email,
        avatar: user.avatar || ''
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(editForm);
        setIsEditing(false);
    };

    const userTournaments = tournaments.filter(t => (user.registeredTournaments || []).includes(t.id));

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="bg-white border-2 border-black shadow-neo-lg relative mb-8">
                {/* Header Banner */}
                <div className="h-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-neo-violet border-b-2 border-black"></div>

                <div className="px-8 pb-8">
                    <div className="relative flex flex-col md:flex-row justify-between items-end -mt-16 mb-6 gap-4">
                        <div className="flex items-end gap-6">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-32 h-32 rounded-none border-2 border-black bg-white object-cover shadow-neo"
                            />
                            <div className="mb-2">
                                <h1 className="text-4xl font-black uppercase tracking-tighter">{user.name}</h1>
                                <div className="flex items-center gap-4 mt-1 font-bold">
                                    <span className="flex items-center gap-1 px-3 py-1 bg-neo-cyan border-2 border-black text-xs uppercase shadow-neo-sm">
                                        <Shield className="w-3 h-3" /> {user.role}
                                    </span>
                                    <span className="text-gray-600 text-sm">{user.email}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-black hover:bg-neo-yellow font-bold uppercase shadow-neo hover:shadow-none hover:translate-y-1 transition-all"
                        >
                            <Settings className="w-5 h-5" /> Impostazioni
                        </button>
                    </div>

                    {/* Stats Row */}
                    {user.stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 border-t-2 border-black pt-8">
                            <div className="text-center">
                                <p className="text-xs font-black uppercase text-gray-500 mb-1">Punti XP</p>
                                <p className="text-3xl font-black text-neo-violet">{user.stats.xp}</p>
                            </div>
                            <div className="text-center border-l-2 border-gray-200">
                                <p className="text-xs font-black uppercase text-gray-500 mb-1">Partite Giocate</p>
                                <p className="text-3xl font-black">{user.stats.gamesPlayed}</p>
                            </div>
                            <div className="text-center border-l-2 border-gray-200">
                                <p className="text-xs font-black uppercase text-gray-500 mb-1">Win Rate</p>
                                <p className="text-3xl font-black">{user.stats.winRate}%</p>
                            </div>
                            <div className="text-center border-l-2 border-gray-200">
                                <p className="text-xs font-black uppercase text-gray-500 mb-1">Gioco Preferito</p>
                                <p className="text-lg font-black leading-tight mt-1">{user.stats.favoriteGame}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Badges */}
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-white border-2 border-black p-6 shadow-neo">
                        <h3 className="font-black flex items-center gap-2 mb-4 uppercase text-lg border-b-2 border-black pb-2">
                            <Trophy className="w-5 h-5 text-neo-yellow" /> Achievements
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {user.badges?.map(badge => (
                                <div key={badge.id} className="group relative flex flex-col items-center justify-center p-2 border-2 border-gray-200 hover:border-black hover:bg-neo-bg transition-all cursor-help">
                                    <span className="text-2xl">{badge.icon}</span>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block w-32 bg-black text-white text-xs p-2 text-center font-bold z-10">
                                        {badge.name}
                                        <div className="text-[10px] font-normal opacity-80">{badge.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2 & 3: History & Bookings */}
                <div className="md:col-span-2 space-y-8">
                    {/* Live Bookings */}
                    <div className="bg-neo-bg border-2 border-black p-6 shadow-neo relative">
                        <div className="absolute -top-3 -left-3 bg-neo-lime border-2 border-black px-2 font-black text-xs uppercase shadow-sm">Attivi</div>
                        <h3 className="font-black flex items-center gap-2 mb-4 uppercase text-lg">
                            <Clock className="w-5 h-5" /> Prenotazioni & Sessioni
                        </h3>
                        {(!user.bookings || user.bookings.length === 0) ? (
                            <p className="text-gray-500 italic text-sm">Nessuna prenotazione futura.</p>
                        ) : (
                            <div className="space-y-4">
                                {(user.bookings || []).map(booking => (
                                    <div key={booking.id} className="p-4 bg-white border-2 border-black flex justify-between items-center shadow-neo-sm hover:translate-x-1 transition-transform">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-black text-white p-2 font-black text-center leading-none w-16">
                                                <span className="text-xl block">{booking.date.split('-')[2]}</span>
                                                <span className="text-xs uppercase">{booking.time}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold">Tavolo per {booking.participants}</p>
                                                <p className="text-sm font-medium text-gray-600">Durata: {booking.duration}h • Pre-ordine: {booking.items.length} oggetti</p>
                                            </div>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-neo-pink text-white border-2 border-black font-bold uppercase">Confermato</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Tournaments */}
                    <div className="bg-white border-2 border-black p-6 shadow-neo">
                        <h3 className="font-black flex items-center gap-2 mb-4 uppercase text-lg border-b-2 border-black pb-2">
                            <Swords className="w-5 h-5" /> I Miei Tornei
                        </h3>
                        {userTournaments.length === 0 ? (
                            <p className="text-gray-500 italic text-sm">Non sei iscritto a nessun torneo.</p>
                        ) : (
                            <div className="space-y-4">
                                {userTournaments.map(t => (
                                    <div key={t.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                                        <div className="flex items-center gap-3">
                                            <img src={t.image} className="w-10 h-10 object-cover border border-black" alt="" />
                                            <div>
                                                <p className="font-bold uppercase text-sm">{t.title}</p>
                                                <p className="text-xs text-gray-600">{new Date(t.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {t.status === 'upcoming' && (
                                                <span className="text-xs font-bold text-neo-violet flex items-center gap-1">
                                                    <Timer className="w-3 h-3" />
                                                    {/* Simple day diff logic for display */}
                                                    {Math.ceil((new Date(t.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} giorni
                                                </span>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (confirm('Ritirarsi dal torneo?')) withdrawFromTournament(t.id);
                                                }}
                                                className="text-xs text-red-500 font-bold hover:underline"
                                            >
                                                Ritirati
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white border-4 border-black w-full max-w-md p-6 shadow-neo-lg">
                        <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2">
                            <h2 className="text-2xl font-black uppercase">Modifica Profilo</h2>
                            <button onClick={() => setIsEditing(false)}><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Nome</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full border-2 border-black p-2 font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full border-2 border-black p-2 font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Avatar URL</label>
                                <input
                                    type="text"
                                    value={editForm.avatar}
                                    onChange={e => setEditForm({ ...editForm, avatar: e.target.value })}
                                    className="w-full border-2 border-black p-2 font-bold text-xs"
                                />
                            </div>
                            <button type="submit" className="w-full bg-neo-lime border-2 border-black py-3 font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all">
                                Salva Modifiche
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;