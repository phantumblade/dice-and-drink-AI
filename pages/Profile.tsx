import React, { useState, useRef, useEffect } from 'react';
import { User, Character } from '../types';
import { Mail, Shield, Clock, Settings, Trophy, Timer, Swords, X, Upload, Camera, Calendar, Scroll, Plus, Crown } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTournaments } from '../contexts/TournamentContext';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import CharacterCard from '../components/CharacterCard';
import CharacterCreationModal from '../components/CharacterCreationModal';
import DMDashboard from '../components/DMDashboard';

interface ProfileProps {
    user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
    const { updateProfile, withdrawFromTournament } = useUser();
    const { tournaments } = useTournaments();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'dm'>('overview');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [showCharModal, setShowCharModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [editForm, setEditForm] = useState({
        name: user.name,
        email: user.email,
        avatar: user.avatar || ''
    });

    useEffect(() => {
        if (activeTab === 'characters' || activeTab === 'dm') {
            fetchCharacters();
        }
    }, [activeTab, user.id]);

    const fetchCharacters = async () => {
        try {
            const res = await api.get<Character[]>(`/characters?userId=${user.id}`);
            setCharacters(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(editForm);
        setIsEditing(false);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await api.post(`/users/${user.id}/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newAvatarUrl = response.data.avatar;
            updateProfile({ ...user, avatar: newAvatarUrl });
            setEditForm(prev => ({ ...prev, avatar: newAvatarUrl }));

        } catch (error) {
            console.error('Error uploading avatar:', error);
            showToast('Errore durante il caricamento dell\'immagine', 'error');
        } finally {
            setIsUploading(false);
            showToast('Foto profilo aggiornata con successo!', 'success');
        }
    };

    const userTournaments = tournaments.filter(t => (user.registeredTournaments || []).includes(t.id));

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 pb-24">
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-md border-2 border-black shadow-neo-lg relative mb-8 overflow-hidden">
                {/* Header Banner */}
                <div className="h-32 md:h-48 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-neo-violet border-b-2 border-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                </div>

                <div className="px-6 md:px-10 pb-8">
                    <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-16 md:-mt-20 mb-6 gap-6">

                        {/* Avatar & Info */}
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-neo bg-gray-200 overflow-hidden relative">
                                    <img
                                        src={user.avatar || 'https://via.placeholder.com/150'}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="text-white w-8 h-8" />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <div className="mb-2">
                                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-900">{user.name}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2 font-bold">
                                    <span className="flex items-center gap-1 px-3 py-1 bg-neo-cyan border-2 border-black text-xs uppercase shadow-neo-sm">
                                        <Shield className="w-3 h-3" /> {user.role}
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-600 text-sm bg-gray-100 px-3 py-1 border border-gray-300 rounded-full">
                                        <Mail className="w-3 h-3" /> {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-black hover:bg-neo-yellow font-bold uppercase shadow-neo hover:shadow-none hover:translate-y-1 transition-all"
                        >
                            <Settings className="w-5 h-5" /> <span className="hidden md:inline">Modifica Profilo</span>
                        </button>
                    </div>

                    {/* Stats Row */}
                    {user.stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2 border-t-2 border-dashed border-gray-300 pt-8">
                            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-xs font-black uppercase text-gray-500 mb-1">Punti XP</p>
                                <p className="text-2xl md:text-3xl font-black text-neo-violet">{user.stats.xp}</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-xs font-black uppercase text-gray-500 mb-1">Partite</p>
                                <p className="text-2xl md:text-3xl font-black text-gray-800">{user.stats.gamesPlayed}</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-xs font-black uppercase text-gray-500 mb-1">Win Rate</p>
                                <p className="text-2xl md:text-3xl font-black text-neo-green">{user.stats.winRate}%</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-xs font-black uppercase text-gray-500 mb-1">Preferito</p>
                                <p className="text-lg md:text-xl font-black leading-tight mt-1 text-gray-800 truncate px-2">{user.stats.favoriteGame}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex justify-center mb-8 border-b-2 border-gray-200">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 font-black uppercase flex items-center gap-2 border-b-4 transition-all ${activeTab === 'overview' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <Trophy className="w-5 h-5" /> Panoramica
                </button>
                <button
                    onClick={() => setActiveTab('characters')}
                    className={`px-6 py-3 font-black uppercase flex items-center gap-2 border-b-4 transition-all ${activeTab === 'characters' ? 'border-amber-600 text-amber-800' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <Scroll className="w-5 h-5" /> Personaggi D&D
                </button>
                <button
                    onClick={() => setActiveTab('dm')}
                    className={`px-6 py-3 font-black uppercase flex items-center gap-2 border-b-4 transition-all ${activeTab === 'dm' ? 'border-neo-violet text-neo-violet' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <Crown className="w-5 h-5" /> DM Zone
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Column 1: Badges */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white border-2 border-black p-6 shadow-neo rounded-sm">
                            <h3 className="font-black flex items-center gap-2 mb-6 uppercase text-lg border-b-2 border-black pb-3">
                                <Trophy className="w-5 h-5 text-neo-yellow" /> Achievements
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {user.badges?.map(badge => (
                                    <div key={badge.id} className="group relative flex flex-col items-center justify-center p-3 border-2 border-gray-100 bg-gray-50 hover:border-black hover:bg-neo-bg transition-all cursor-help rounded-lg aspect-square">
                                        <span className="text-3xl mb-1">{badge.icon}</span>
                                        <span className="text-[10px] font-bold uppercase text-center leading-tight">{badge.name}</span>

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block w-40 bg-black text-white text-xs p-3 rounded shadow-xl text-center font-bold z-50 pointer-events-none">
                                            <div className="text-neo-yellow mb-1">{badge.name}</div>
                                            <div className="font-normal opacity-90">{badge.description}</div>
                                            <div className="mt-2 text-[10px] opacity-60 border-t border-gray-700 pt-1">Ottenuto il {new Date(badge.dateEarned).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 2 & 3: History & Bookings */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Live Bookings */}
                        <div className="bg-neo-bg border-2 border-black p-6 shadow-neo relative rounded-sm">
                            <div className="absolute -top-3 -left-3 bg-neo-lime border-2 border-black px-3 py-1 font-black text-xs uppercase shadow-sm transform -rotate-2">Attivi</div>
                            <h3 className="font-black flex items-center gap-2 mb-6 uppercase text-lg">
                                <Clock className="w-5 h-5" /> Prenotazioni & Sessioni
                            </h3>
                            {(!user.bookings || user.bookings.length === 0) ? (
                                <div className="bg-white/50 border-2 border-dashed border-gray-400 p-8 text-center rounded-lg">
                                    <p className="text-gray-500 font-medium">Nessuna prenotazione futura.</p>
                                    <button className="mt-4 text-sm font-bold underline hover:text-neo-violet">Prenota un tavolo</button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {(user.bookings || []).map(booking => (
                                        <div key={booking.id} className="p-4 bg-white border-2 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-neo-sm hover:translate-x-1 transition-transform gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-black text-white p-3 font-black text-center leading-none w-16 rounded">
                                                    <span className="text-xl block">{booking.date.split('-')[2]}</span>
                                                    <span className="text-xs uppercase opacity-80">Dic</span> {/* Mock month for now */}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">Tavolo per {booking.participants}</p>
                                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                                        <Clock className="w-3 h-3" /> {booking.time} ({booking.duration}h)
                                                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                        <span>{booking.items.length} oggetti pre-ordinati</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-xs px-3 py-1 bg-neo-pink text-white border-2 border-black font-bold uppercase rounded-full self-start sm:self-center">Confermato</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Active Tournaments */}
                        <div className="bg-white border-2 border-black p-6 shadow-neo rounded-sm">
                            <h3 className="font-black flex items-center gap-2 mb-6 uppercase text-lg border-b-2 border-black pb-3">
                                <Swords className="w-5 h-5" /> I Miei Tornei
                            </h3>
                            {userTournaments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Non sei iscritto a nessun torneo.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {userTournaments.map(t => (
                                        <div key={t.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0 gap-4">
                                            <div className="flex items-center gap-4">
                                                <img src={t.image} className="w-12 h-12 object-cover border-2 border-black rounded-md" alt="" />
                                                <div>
                                                    <p className="font-bold uppercase text-sm md:text-base">{t.title}</p>
                                                    <p className="text-xs text-gray-600 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {new Date(t.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                                {t.status === 'upcoming' && (
                                                    <span className="text-xs font-bold text-neo-violet flex items-center gap-1 bg-neo-violet/10 px-2 py-1 rounded">
                                                        <Timer className="w-3 h-3" />
                                                        {Math.ceil((new Date(t.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} giorni
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Ritirarsi dal torneo?')) withdrawFromTournament(t.id);
                                                    }}
                                                    className="text-xs text-red-500 font-bold hover:bg-red-50 px-3 py-1 rounded transition-colors"
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
            )}

            {activeTab === 'characters' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black uppercase text-amber-900">Le Tue Schede</h2>
                        <button
                            onClick={() => setShowCharModal(true)}
                            className="bg-black text-white px-4 py-2 font-bold uppercase border-2 border-black hover:bg-neo-lime hover:text-black transition-all shadow-neo hover:shadow-none flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Nuovo Personaggio
                        </button>
                    </div>

                    {characters.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-amber-400 bg-amber-50 rounded-lg">
                            <Scroll className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                            <h3 className="text-xl font-black uppercase text-amber-800 mb-2">Nessun personaggio trovato</h3>
                            <p className="text-amber-700 font-medium mb-6">Crea il tuo primo eroe per unirti alle campagne!</p>
                            <button
                                onClick={() => setShowCharModal(true)}
                                className="bg-amber-600 text-white px-6 py-3 font-bold uppercase hover:bg-amber-700 transition-colors rounded shadow-lg"
                            >
                                Crea Personaggio
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {characters.map(char => (
                                <CharacterCard key={char.id} character={char} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'dm' && (
                <DMDashboard />
            )}

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border-4 border-black w-full max-w-md p-6 shadow-neo-lg transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
                            <h2 className="text-2xl font-black uppercase">Modifica Profilo</h2>
                            <button onClick={() => setIsEditing(false)} className="hover:bg-gray-100 p-1 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2 text-gray-600">Nome Utente</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-cyan/30 transition-all rounded-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-2 text-gray-600">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-cyan/30 transition-all rounded-sm"
                                />
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-neo-lime border-2 border-black py-4 font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all text-lg tracking-wide rounded-sm">
                                    Salva Modifiche
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Character Creation Modal */}
            {showCharModal && (
                <CharacterCreationModal
                    onClose={() => setShowCharModal(false)}
                    onCreated={fetchCharacters}
                />
            )}
        </div>
    );
};

export default Profile;