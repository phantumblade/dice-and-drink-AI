import React, { useState, useMemo } from 'react';
import { Users, ChevronRight, Swords, Scroll, Timer, CheckCircle, XCircle, Info, HelpCircle, Calendar, Clock, Gift, BookOpen, User as UserIcon } from 'lucide-react';
import { useTournaments } from '../contexts/TournamentContext';
import { Tournament, TournamentType } from '../types';
import { useUser } from '../contexts/UserContext';

const Tournaments: React.FC = () => {
    const { user, registerForTournament, requestJoinTournament, withdrawFromTournament } = useUser();
    const { tournaments, loading } = useTournaments();
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [filterType, setFilterType] = useState<TournamentType | 'ALL'>('ALL');
    const [activeTab, setActiveTab] = useState<'browse' | 'my_tournaments'>('browse');

    const filteredTournaments = useMemo(() => {
        let list = tournaments;
        if (activeTab === 'my_tournaments' && user) {
            // Show both registered and pending
            const registeredIds = user.registeredTournaments || [];
            const pendingIds = user.pendingRequests || [];
            list = list.filter(t => registeredIds.includes(t.id) || pendingIds.includes(t.id));
        }
        if (filterType === 'ALL') return list;
        return list.filter(t => t.type === filterType);
    }, [filterType, activeTab, user, tournaments]);

    const userStats = useMemo(() => {
        if (!user) return { joined: 0, wins: 0, upcoming: 0 };
        const registeredIds = user.registeredTournaments || [];
        const joined = registeredIds.length;
        const wins = user.badges?.filter(b => b.name.includes('Vincitore')).length || 0;
        const upcoming = tournaments.filter(t => registeredIds.includes(t.id) && t.status === 'upcoming').length;
        return { joined, wins, upcoming };
    }, [user, tournaments]);

    const getStatusStyle = (status: Tournament['status']) => {
        switch (status) {
            case 'upcoming': return 'bg-neo-lime border-black text-black';
            case 'ongoing': return 'bg-neo-yellow border-black text-black animate-pulse';
            case 'completed': return 'bg-gray-200 border-gray-400 text-gray-500 line-through decoration-2';
            case 'cancelled': return 'bg-red-500 border-black text-white';
        }
    };

    const calculateCountdown = (dateString: string) => {
        const diff = new Date(dateString).getTime() - new Date().getTime();
        if (diff < 0) return "In Corso";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return `${days}gg rimanenti`;
    };

    const isPending = (tournamentId: string) => user?.pendingRequests?.includes(tournamentId) || false;
    const isRegistered = (tournamentId: string) => user?.registeredTournaments?.includes(tournamentId) || false;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-black pb-8">
                <div>
                    <h1 className="text-6xl font-black mb-2 uppercase">Bacheca Quest</h1>
                    <p className="text-xl font-bold text-neo-violet">Competi per la gloria, o muori (nei dadi) provandoci.</p>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="mb-12 bg-white border-2 border-black p-8 shadow-neo">
                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                    <Scroll className="w-6 h-6" /> Guida all'Avventuriero
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="relative p-6 bg-neo-bg border-2 border-black hover:-translate-y-1 transition-transform group">
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-black text-white flex items-center justify-center font-black text-xl border-2 border-white shadow-neo">1</div>
                        <h3 className="text-xl font-black uppercase mb-2 group-hover:text-neo-pink transition-colors">Iscrizione</h3>
                        <p className="text-sm font-medium">Scegli la tua battaglia. Per i tornei Standard, l'iscrizione è immediata. Per D&D, devi richiedere l'approvazione del Master.</p>
                    </div>
                    <div className="relative p-6 bg-neo-bg border-2 border-black hover:-translate-y-1 transition-transform group">
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-black text-white flex items-center justify-center font-black text-xl border-2 border-white shadow-neo">2</div>
                        <h3 className="text-xl font-black uppercase mb-2 group-hover:text-neo-cyan transition-colors">Preparazione</h3>
                        <p className="text-sm font-medium">Controlla cosa è incluso (booster, drink, personaggi pre-generati). Presentati 15 minuti prima.</p>
                    </div>
                    <div className="relative p-6 bg-neo-bg border-2 border-black hover:-translate-y-1 transition-transform group">
                        <div className="absolute -top-4 -left-4 w-10 h-10 bg-black text-white flex items-center justify-center font-black text-xl border-2 border-white shadow-neo">3</div>
                        <h3 className="text-xl font-black uppercase mb-2 group-hover:text-neo-lime transition-colors">Gloria</h3>
                        <p className="text-sm font-medium">Scala la classifica. I vincitori ottengono crediti bar e, per D&D, il diritto di vita o di morte sugli NPC.</p>
                    </div>
                </div>
            </div>

            {/* Tabs & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex gap-0 border-2 border-black bg-white">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`px-6 py-2 font-black uppercase hover:bg-neo-yellow transition-colors ${activeTab === 'browse' ? 'bg-black text-white hover:bg-black' : ''}`}
                    >
                        Tutti i Tornei
                    </button>
                    {user && (
                        <button
                            onClick={() => setActiveTab('my_tournaments')}
                            className={`px-6 py-2 font-black uppercase hover:bg-neo-yellow transition-colors border-l-2 border-black ${activeTab === 'my_tournaments' ? 'bg-black text-white hover:bg-black' : ''}`}
                        >
                            I Miei Tornei
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilterType('ALL')}
                        className={`px-4 py-2 font-bold border-2 border-black uppercase text-xs ${filterType === 'ALL' ? 'bg-black text-white' : 'bg-white'}`}
                    >
                        Tutti
                    </button>
                    {Object.values(TournamentType).map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 font-bold border-2 border-black uppercase text-xs ${filterType === type ? 'bg-neo-pink text-white' : 'bg-white'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                {filteredTournaments.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-400 font-bold text-gray-500">
                        Nessuna quest disponibile in questa categoria.
                    </div>
                ) : (
                    filteredTournaments.map((t) => {
                        const isDnD = t.type === TournamentType.DND;
                        return (
                            <div
                                key={t.id}
                                className={`group relative border-2 border-black p-0 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all flex flex-col sm:flex-row overflow-hidden min-h-[240px] cursor-pointer ${isDnD ? 'bg-amber-50' : 'bg-white'}`}
                                onClick={() => setSelectedTournament(t)}
                            >
                                {/* Image Strip */}
                                <div className="w-full sm:w-72 h-48 sm:h-auto border-b-2 sm:border-b-0 sm:border-r-2 border-black relative shrink-0">
                                    <img src={t.image} alt={t.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    <div className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-black uppercase border-2 border-black shadow-neo-sm ${getStatusStyle(t.status)}`}>
                                        {t.status}
                                    </div>
                                    {isDnD && (
                                        <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 text-xs font-black uppercase border-2 border-white shadow-lg flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" /> Story Mode
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            {/* HUGE GAME SYSTEM LABEL */}
                                            <h4 className="text-4xl font-black uppercase text-neo-violet leading-none mb-1 opacity-90 group-hover:opacity-100 transition-opacity">
                                                {t.gameSystem}
                                            </h4>
                                            <h3 className={`text-xl font-bold uppercase transition-colors ${isDnD ? 'font-serif tracking-wide text-amber-900' : ''}`}>
                                                {t.title}
                                            </h3>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <span className="bg-neo-bg border-2 border-black px-2 py-1 text-xs font-bold mb-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {new Date(t.date).toLocaleDateString()}
                                            </span>
                                            <span className="bg-neo-bg border-2 border-black px-2 py-1 text-xs font-bold flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <p className={`text-sm font-medium mb-4 line-clamp-2 mt-2 ${isDnD ? 'italic text-amber-800' : 'text-gray-700'}`}>
                                        {t.description}
                                    </p>

                                    {/* Badges/Tags */}
                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        <span className="text-[10px] uppercase font-bold px-2 py-1 bg-black text-white border border-black flex items-center gap-1">
                                            {t.frequency}
                                        </span>
                                        {t.includes?.map((inc, i) => (
                                            <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 bg-gray-100 border border-black flex items-center gap-1">
                                                <Gift className="w-3 h-3" /> {inc}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-dashed border-gray-300">
                                        <div className="flex items-center gap-4 text-sm font-bold">
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                <div className="w-24 h-3 bg-gray-200 border border-black relative rounded-full overflow-hidden">
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-neo-lime"
                                                        style={{ width: `${(t.filled / t.slots) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span>{t.filled}/{t.slots}</span>
                                            </div>
                                            {isRegistered(t.id) && <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Iscritto</span>}
                                            {isPending(t.id) && <span className="text-amber-600 flex items-center gap-1"><HelpCircle className="w-4 h-4" /> In Attesa</span>}
                                        </div>
                                        <button className="font-bold uppercase text-xs flex items-center gap-1 hover:underline">
                                            Dettagli & Iscritti <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Detail Modal */}
            {selectedTournament && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`bg-white border-4 border-black shadow-neo-lg max-w-3xl w-full p-0 relative max-h-[90vh] overflow-y-auto ${selectedTournament.type === TournamentType.DND ? 'bg-amber-50' : ''}`}>
                        <div className={`p-4 flex justify-between items-center border-b-2 border-black ${selectedTournament.type === TournamentType.DND ? 'bg-amber-200' : 'bg-neo-yellow'}`}>
                            <h2 className={`text-xl font-black uppercase ${selectedTournament.type === TournamentType.DND ? 'font-serif tracking-widest' : ''}`}>{selectedTournament.title}</h2>
                            <button onClick={() => setSelectedTournament(null)} className="font-bold hover:text-red-600 bg-white border-2 border-black px-2 shadow-sm">CHIUDI X</button>
                        </div>

                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-6 mb-8">
                                <div className="w-full md:w-1/3 h-40 border-2 border-black flex-shrink-0">
                                    <img src={selectedTournament.image} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-4xl font-black uppercase text-neo-violet mb-2">{selectedTournament.gameSystem}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="bg-black text-white px-2 py-1 text-xs font-bold uppercase">{selectedTournament.type}</span>
                                        <span className="bg-white border border-black px-2 py-1 text-xs font-bold uppercase">{selectedTournament.frequency}</span>
                                    </div>
                                    <p className="font-medium text-sm leading-relaxed border-l-4 border-gray-300 pl-4">{selectedTournament.description}</p>
                                </div>
                            </div>

                            {/* Detailed Rules & Includes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white border-2 border-black p-4 shadow-neo-sm">
                                    <h4 className="font-black uppercase mb-2 flex items-center gap-2 text-sm"><Info className="w-4 h-4" /> Regolamento & Info</h4>
                                    <p className="text-sm text-gray-700">{selectedTournament.rules || "Regolamento standard del sistema di gioco. Fair play richiesto."}</p>
                                    {selectedTournament.type === TournamentType.DND && (
                                        <p className="text-sm mt-2 font-serif text-amber-800">Master: {selectedTournament.dm}</p>
                                    )}
                                </div>
                                <div className="bg-white border-2 border-black p-4 shadow-neo-sm">
                                    <h4 className="font-black uppercase mb-2 flex items-center gap-2 text-sm"><Gift className="w-4 h-4" /> Incluso nell'Iscrizione</h4>
                                    <ul className="text-sm list-disc pl-4 space-y-1">
                                        {selectedTournament.includes?.map((inc, i) => (
                                            <li key={i}>{inc}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Participants List */}
                            <div className="mb-8 border-t-2 border-black pt-6">
                                <h3 className="font-black uppercase mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5" /> Partecipanti ({selectedTournament.filled}/{selectedTournament.slots})
                                </h3>
                                {selectedTournament.participantsList && selectedTournament.participantsList.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {selectedTournament.participantsList.map((p, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-neo-bg border border-black p-2">
                                                <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full border border-black bg-white" />
                                                <span className="text-xs font-bold truncate">{p.name}</span>
                                            </div>
                                        ))}
                                        {Array.from({ length: selectedTournament.slots - selectedTournament.filled }).map((_, i) => (
                                            <div key={`empty-${i}`} className="flex items-center justify-center gap-2 border border-dashed border-gray-400 p-2 opacity-50">
                                                <div className="w-8 h-8 rounded-full border border-gray-400 bg-gray-100"></div>
                                                <span className="text-xs font-bold text-gray-400">Libero</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm italic text-gray-500">Nessun partecipante visibile.</p>
                                )}
                            </div>

                            {/* Actions */}
                            {user ? (
                                <div className="space-y-3 border-t-2 border-black pt-6">
                                    {isRegistered(selectedTournament.id) ? (
                                        <div className="flex gap-4">
                                            <div className="flex-1 bg-neo-lime border-2 border-black py-3 font-black uppercase text-center flex items-center justify-center gap-2">
                                                <CheckCircle className="w-5 h-5" /> Sei Iscritto
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Sei sicuro di volerti ritirare?')) {
                                                        withdrawFromTournament(selectedTournament.id);
                                                        setSelectedTournament(null);
                                                    }
                                                }}
                                                className="bg-red-500 text-white border-2 border-black px-4 font-bold hover:bg-red-600"
                                            >
                                                Ritirati
                                            </button>
                                        </div>
                                    ) : isPending(selectedTournament.id) ? (
                                        <div className="flex gap-4">
                                            <div className="flex-1 bg-amber-100 border-2 border-black py-3 font-black uppercase text-center flex items-center justify-center gap-2 text-amber-800">
                                                <Clock className="w-5 h-5" /> In Attesa di Approvazione
                                            </div>
                                            <button
                                                onClick={() => {
                                                    withdrawFromTournament(selectedTournament.id); // Cancel request
                                                    setSelectedTournament(null);
                                                }}
                                                className="bg-red-500 text-white border-2 border-black px-4 font-bold hover:bg-red-600"
                                            >
                                                Annulla
                                            </button>
                                        </div>
                                    ) : (
                                        selectedTournament.type === TournamentType.DND ? (
                                            <button
                                                onClick={() => {
                                                    requestJoinTournament(selectedTournament.id);
                                                    setSelectedTournament(null);
                                                    alert("Richiesta inviata al Dungeon Master. Riceverai una notifica se accettato.");
                                                }}
                                                className="w-full bg-amber-700 text-white py-4 font-serif font-bold uppercase border-2 border-black hover:bg-amber-800 transition-colors shadow-neo"
                                            >
                                                Invia Richiesta al Master
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    registerForTournament(selectedTournament.id);
                                                    setSelectedTournament(null);
                                                }}
                                                className="w-full bg-black text-white py-4 font-black uppercase border-2 border-black hover:bg-neo-pink hover:text-white transition-colors shadow-neo"
                                            >
                                                Iscriviti Ora
                                            </button>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="text-center font-bold text-red-500 border-2 border-red-500 p-4 bg-red-50">
                                    Effettua il login per iscriverti ai tornei
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tournaments;