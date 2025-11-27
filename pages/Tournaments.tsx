import React, { useState, useMemo } from 'react';
import { Users, ChevronRight, Swords, Scroll, Timer, CheckCircle, Info, Gift, BookOpen, Filter, AlertTriangle, Dice5, Calendar, Clock, Trophy, Target, Zap, UserPlus } from 'lucide-react';
import { useTournaments } from '../contexts/TournamentContext';
import { useCampaigns } from '../contexts/CampaignContext';
import { Tournament, Campaign, Product } from '../types';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import { useProducts } from '../contexts/ProductContext';
import CampaignCard from '../components/CampaignCard';
import CampaignRequestModal from '../components/CampaignRequestModal';
import CampaignDetailModal from '../components/CampaignDetailModal';
import ProductDetailModal from '../components/ProductDetailModal';

const Tournaments: React.FC = () => {
    const { user, registerForTournament, withdrawFromTournament } = useUser();
    const { tournaments } = useTournaments();
    const { campaigns } = useCampaigns();
    const { showToast } = useToast();
    const { getProduct } = useProducts();

    const [viewMode, setViewMode] = useState<'tournaments' | 'campaigns'>('tournaments');
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [selectedCampaignDetail, setSelectedCampaignDetail] = useState<Campaign | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [filterGame, setFilterGame] = useState<string>('ALL');
    const [activeTab, setActiveTab] = useState<'browse' | 'my_tournaments'>('browse');

    // Filter out past tournaments
    const activeTournaments = useMemo(() => {
        const now = new Date();
        return tournaments.filter(t => new Date(t.date) > now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [tournaments]);

    const uniqueGames = useMemo(() => {
        const games = new Set(activeTournaments.map(t => t.gameSystem || 'Altro'));
        return ['ALL', ...Array.from(games)];
    }, [activeTournaments]);

    const filteredTournaments = useMemo(() => {
        let list = activeTournaments;

        if (activeTab === 'my_tournaments' && user) {
            const registeredIds = user.registeredTournaments || [];
            list = list.filter(t => registeredIds.includes(t.id));
        }

        if (filterGame !== 'ALL') {
            list = list.filter(t => (t.gameSystem || 'Altro') === filterGame);
        }

        return list;
    }, [filterGame, activeTab, user, activeTournaments]);

    const filteredCampaigns = useMemo(() => {
        return campaigns;
    }, [campaigns]);

    const stats = useMemo(() => {
        const totalTournaments = activeTournaments.length;
        const totalCampaigns = campaigns.length;
        const totalParticipants = activeTournaments.reduce((acc, t) => acc + t.filled, 0) + campaigns.reduce((acc, c) => acc + (c._count?.participants || 0), 0);
        return { totalTournaments, totalCampaigns, totalParticipants };
    }, [activeTournaments, campaigns]);

    const getStatusStyle = (status: Tournament['status']) => {
        switch (status) {
            case 'upcoming': return 'bg-neo-lime border-black text-black';
            case 'ongoing': return 'bg-neo-yellow border-black text-black animate-pulse';
            case 'completed': return 'bg-gray-200 border-gray-400 text-gray-500 line-through decoration-2';
            case 'cancelled': return 'bg-red-500 border-black text-white';
        }
    };

    const isRegistered = (tournamentId: string) => user?.registeredTournaments?.includes(tournamentId) || false;

    const getDaysRemaining = (dateString: string) => {
        const today = new Date();
        const tournamentDate = new Date(dateString);
        const diffTime = tournamentDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const isUrgent = (t: Tournament) => {
        return t.filled >= t.slots - 2;
    };

    const isClosingSoon = (dateString: string) => {
        const days = getDaysRemaining(dateString);
        return days > 3 && days <= 7;
    };

    const handleGameBadgeClick = (e: React.MouseEvent, gameId?: string) => {
        e.stopPropagation();
        if (gameId) {
            const product = getProduct(gameId);
            if (product) {
                setSelectedProduct(product);
            } else {
                showToast('Dettagli del gioco non disponibili', 'info');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
            {/* How It Works - Compact & Colorful */}
            <section className="bg-white border-b-2 border-black py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                        {/* Title */}
                        <div className="md:w-1/4 text-center md:text-left">
                            <h1 className="text-4xl font-black uppercase leading-none mb-2">
                                Arena <span className="text-neo-pink">Tornei</span>
                            </h1>
                            <p className="text-sm font-bold text-gray-600">
                                Dimostra il tuo valore. Vinci la gloria.
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            {/* Step 1 */}
                            <div className="bg-white border-2 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform flex items-center gap-4 relative overflow-hidden group">
                                <div className="bg-neo-yellow text-black w-10 h-10 flex items-center justify-center font-black text-xl border-2 border-black shadow-sm flex-shrink-0">1</div>
                                <div>
                                    <h3 className="font-black uppercase text-sm group-hover:text-neo-yellow transition-colors">Scegli la Sfida</h3>
                                    <p className="text-xs font-bold leading-tight mt-1 text-gray-600">Filtra per gioco e livello.</p>
                                </div>
                                <Swords className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all text-black" />
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white border-2 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform flex items-center gap-4 relative overflow-hidden group">
                                <div className="bg-neo-cyan text-black w-10 h-10 flex items-center justify-center font-black text-xl border-2 border-black shadow-sm flex-shrink-0">2</div>
                                <div>
                                    <h3 className="font-black uppercase text-sm group-hover:text-neo-cyan transition-colors">Iscriviti Online</h3>
                                    <p className="text-xs font-bold leading-tight mt-1 text-gray-600">Prenota il tuo posto.</p>
                                </div>
                                <UserPlus className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all text-black" />
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white border-2 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform flex items-center gap-4 relative overflow-hidden group">
                                <div className="bg-neo-pink text-black w-10 h-10 flex items-center justify-center font-black text-xl border-2 border-black shadow-sm flex-shrink-0">3</div>
                                <div>
                                    <h3 className="font-black uppercase text-sm group-hover:text-neo-pink transition-colors">Vinci Premi</h3>
                                    <p className="text-xs font-bold leading-tight mt-1 text-gray-600">Gloria eterna e loot.</p>
                                </div>
                                <Trophy className="w-12 h-12 absolute -right-2 -bottom-2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all text-black" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-black text-white p-6 border-2 border-black shadow-neo">
                    <div className="flex justify-between items-start mb-2">
                        <Swords className="w-8 h-8 text-neo-pink" />
                        <span className="text-xs font-bold uppercase text-gray-400">Tornei</span>
                    </div>
                    <p className="text-4xl font-black">{stats.totalTournaments}</p>
                    <p className="text-sm font-bold text-gray-400 uppercase">Eventi Competitivi</p>
                </div>
                <div className="bg-amber-100 p-6 border-2 border-black shadow-neo">
                    <div className="flex justify-between items-start mb-2">
                        <BookOpen className="w-8 h-8 text-amber-800" />
                        <span className="text-xs font-bold uppercase text-amber-800/60">GDR</span>
                    </div>
                    <p className="text-4xl font-black text-amber-900">{stats.totalCampaigns}</p>
                    <p className="text-sm font-bold text-amber-800/60 uppercase">Campagne Attive</p>
                </div>
                <div className="bg-neo-cyan p-6 border-2 border-black shadow-neo">
                    <div className="flex justify-between items-start mb-2">
                        <Users className="w-8 h-8 text-black" />
                        <span className="text-xs font-bold uppercase text-black/60">Community</span>
                    </div>
                    <p className="text-4xl font-black">{stats.totalParticipants}</p>
                    <p className="text-sm font-bold text-black/60 uppercase">Giocatori Totali</p>
                </div>
                <div className="bg-white p-6 border-2 border-black shadow-neo">
                    <div className="flex justify-between items-start mb-2">
                        <Dice5 className="w-8 h-8 text-black" />
                        <span className="text-xs font-bold uppercase text-gray-500">Info</span>
                    </div>
                    <p className="text-sm font-medium leading-tight mt-2">
                        Partecipa ai tornei per vincere premi o unisciti a una campagna per vivere storie epiche!
                    </p>
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex justify-center mb-12">
                <div className="inline-flex bg-white border-2 border-black p-1 shadow-neo">
                    <button
                        onClick={() => setViewMode('tournaments')}
                        className={`px-8 py-3 font-black uppercase text-lg flex items-center gap-2 transition-all ${viewMode === 'tournaments' ? 'bg-black text-white shadow-sm' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <Swords className="w-5 h-5" /> Tornei
                    </button>
                    <button
                        onClick={() => setViewMode('campaigns')}
                        className={`px-8 py-3 font-black uppercase text-lg flex items-center gap-2 transition-all ${viewMode === 'campaigns' ? 'bg-amber-400 text-black border-2 border-black shadow-sm -my-1 -mr-1 z-10' : 'hover:bg-amber-50 text-amber-800'}`}
                    >
                        <BookOpen className="w-5 h-5" /> Campagne GDR
                    </button>
                </div>
            </div>

            {viewMode === 'tournaments' ? (
                <>
                    {/* Header & Filters */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 border-b-4 border-black pb-6">
                        <div>
                            <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Prossimi Eventi</h2>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            {/* Tabs */}
                            <div className="flex border-2 border-black bg-white">
                                <button
                                    onClick={() => setActiveTab('browse')}
                                    className={`flex-1 px-6 py-3 font-black uppercase hover:bg-neo-yellow transition-colors ${activeTab === 'browse' ? 'bg-black text-white hover:bg-black' : ''}`}
                                >
                                    Tutti
                                </button>
                                {user && (
                                    <button
                                        onClick={() => setActiveTab('my_tournaments')}
                                        className={`flex-1 px-6 py-3 font-black uppercase hover:bg-neo-yellow transition-colors border-l-2 border-black ${activeTab === 'my_tournaments' ? 'bg-black text-white hover:bg-black' : ''}`}
                                    >
                                        I Miei
                                    </button>
                                )}
                            </div>

                            {/* Game Filter Dropdown */}
                            <div className="relative group min-w-[200px]">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter className="h-5 w-5 text-black" />
                                </div>
                                <select
                                    value={filterGame}
                                    onChange={(e) => setFilterGame(e.target.value)}
                                    className="appearance-none w-full bg-white border-2 border-black pl-10 pr-8 py-3 font-bold uppercase focus:outline-none focus:shadow-neo cursor-pointer hover:bg-gray-50 transition-all"
                                >
                                    <option value="ALL">Tutti i Giochi</option>
                                    {uniqueGames.filter(g => g !== 'ALL').map(game => (
                                        <option key={game} value={game}>{game}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <ChevronRight className="h-5 w-5 text-black rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-6">
                        {filteredTournaments.length === 0 ? (
                            <div className="text-center py-16 border-2 border-dashed border-gray-400 bg-gray-50">
                                <Swords className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-black uppercase text-gray-400">Nessun torneo trovato</h3>
                                <p className="text-gray-500 font-bold">Prova a cambiare i filtri o torna più tardi.</p>
                            </div>
                        ) : (
                            filteredTournaments.map((t) => {
                                const urgent = isUrgent(t);
                                const closing = isClosingSoon(t.date);

                                return (
                                    <div
                                        key={t.id}
                                        className="group relative border-2 border-black p-0 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all flex flex-col md:flex-row overflow-hidden min-h-[260px] cursor-pointer bg-white"
                                        onClick={() => setSelectedTournament(t)}
                                    >
                                        {/* Image Strip */}
                                        <div className="w-full md:w-80 h-48 md:h-auto border-b-2 md:border-b-0 md:border-r-2 border-black relative shrink-0 overflow-hidden">
                                            <img src={t.image} alt={t.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />

                                            <div className={`absolute top-0 left-0 px-3 py-1 text-xs font-black uppercase border-b-2 border-r-2 border-black shadow-sm ${getStatusStyle(t.status)}`}>
                                                {t.status}
                                            </div>

                                            {closing && (
                                                <div className="absolute top-10 left-0 bg-red-600 text-white px-3 py-1 text-xs font-black uppercase border-b-2 border-r-2 border-black shadow-sm animate-pulse flex items-center gap-1">
                                                    <Timer className="w-3 h-3" /> Affrettati! -{getDaysRemaining(t.date.toString()) - 3}gg
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col justify-center relative">
                                            {/* Urgency Badge */}
                                            {urgent && (
                                                <div className="absolute top-4 right-4 flex items-center gap-1 text-red-600 font-black uppercase text-xs border-2 border-red-600 px-2 py-1 bg-red-50 rotate-3 shadow-sm">
                                                    <AlertTriangle className="w-3 h-3" /> Ultimi Posti!
                                                </div>
                                            )}

                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <button
                                                        onClick={(e) => handleGameBadgeClick(e, t.gameId)}
                                                        className="text-sm font-black uppercase text-white bg-black px-2 py-0.5 hover:bg-neo-violet transition-colors flex items-center gap-1"
                                                        title="Vedi dettagli gioco"
                                                    >
                                                        {t.gameSystem} <Info className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                    <span className="text-neo-violet font-bold uppercase text-sm">{t.type}</span>
                                                </div>
                                                <h3 className="text-3xl font-black uppercase leading-none mb-2 group-hover:text-neo-violet transition-colors">
                                                    {t.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm font-bold text-gray-700">
                                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 border border-black rounded-sm">
                                                        <Calendar className="w-4 h-4" /> {new Date(t.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 border border-black rounded-sm">
                                                        <Clock className="w-4 h-4" /> {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-sm font-medium mb-6 line-clamp-2 text-gray-600">
                                                {t.description}
                                            </p>

                                            {/* Rewards */}
                                            <div className="flex gap-2 mb-6 flex-wrap">
                                                {(() => {
                                                    try {
                                                        const includes = t.includes ? JSON.parse(t.includes) : [];
                                                        return Array.isArray(includes) ? includes.map((inc: string, i: number) => (
                                                            <span key={i} className="text-[10px] uppercase font-black px-2 py-1 bg-neo-yellow/20 border border-neo-yellow text-amber-700 flex items-center gap-1 shadow-sm">
                                                                <Gift className="w-3 h-3" /> {inc}
                                                            </span>
                                                        )) : null;
                                                    } catch (e) {
                                                        return null;
                                                    }
                                                })()}
                                            </div>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-dashed border-gray-300">
                                                <div className="flex items-center gap-4 text-sm font-bold">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        <div className="w-32 h-4 bg-gray-200 border-2 border-black relative rounded-full overflow-hidden">
                                                            <div
                                                                className={`absolute top-0 left-0 h-full ${urgent ? 'bg-red-500' : 'bg-neo-lime'}`}
                                                                style={{ width: `${(t.filled / t.slots) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={urgent ? 'text-red-600' : ''}>{t.filled}/{t.slots}</span>
                                                    </div>
                                                    {isRegistered(t.id) && <span className="text-green-600 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded border border-green-200"><CheckCircle className="w-3 h-3" /> Iscritto</span>}
                                                </div>
                                                <button className="font-black uppercase text-xs flex items-center gap-1 hover:underline bg-black text-white px-3 py-1 border-2 border-transparent hover:border-black hover:bg-white hover:text-black transition-all">
                                                    Dettagli <ChevronRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* Campaigns Header */}
                    <div className="mb-8 border-b-4 border-black pb-6">
                        <h1 className="text-5xl md:text-6xl font-serif font-black mb-2 uppercase tracking-tighter text-amber-900">Campagne GDR</h1>
                        <p className="text-xl font-bold text-amber-700">Vivi storie indimenticabili. Trova il tuo party.</p>
                    </div>

                    {/* Campaigns List */}
                    <div className="space-y-6">
                        {filteredCampaigns.length === 0 ? (
                            <div className="text-center py-16 border-2 border-dashed border-amber-400 bg-amber-50">
                                <BookOpen className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-black uppercase text-amber-400">Nessuna campagna attiva</h3>
                                <p className="text-amber-600 font-bold">I bardi sono silenziosi al momento...</p>
                            </div>
                        ) : (
                            filteredCampaigns.map(campaign => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    onRequestJoin={(c) => setSelectedCampaign(c)}
                                    onViewDetails={(c) => setSelectedCampaignDetail(c)}
                                />
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Detail Modal (Tournaments) */}
            {selectedTournament && (
                <div className="fixed inset-0 z-50 md:flex md:items-center md:justify-center md:p-4 bg-white md:bg-black/60 md:backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full h-full md:h-auto md:border-4 border-black md:shadow-neo-lg max-w-4xl md:w-full p-0 relative md:max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-6 flex justify-between items-center border-b-2 border-black sticky top-0 z-10 bg-neo-yellow">
                            <h2 className="text-2xl font-black uppercase flex items-center gap-3">
                                {selectedTournament.title}
                                {isUrgent(selectedTournament) && <span className="text-xs bg-red-600 text-white px-2 py-1 border border-black shadow-sm">Ultimi Posti!</span>}
                            </h2>
                            <button onClick={() => setSelectedTournament(null)} className="font-black hover:bg-black hover:text-white bg-white border-2 border-black px-3 py-1 shadow-neo hover:shadow-none transition-all">CHIUDI X</button>
                        </div>

                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 mb-8">
                                <div className="w-full md:w-1/3 h-64 border-4 border-black shadow-neo flex-shrink-0 relative">
                                    <img src={selectedTournament.image} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-2 text-center font-bold text-xs uppercase">
                                        {selectedTournament.gameSystem}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="bg-black text-white px-3 py-1 text-sm font-black uppercase shadow-neo-sm">{selectedTournament.type}</span>
                                        <span className="bg-white border-2 border-black px-3 py-1 text-sm font-black uppercase shadow-neo-sm">{selectedTournament.frequency}</span>
                                        <span className="bg-neo-cyan border-2 border-black px-3 py-1 text-sm font-black uppercase shadow-neo-sm flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {new Date(selectedTournament.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-4xl font-black uppercase text-neo-violet mb-4 leading-none">{selectedTournament.title}</h3>
                                    <p className="font-medium text-lg leading-relaxed border-l-4 border-neo-pink pl-6 italic text-gray-700">{selectedTournament.description}</p>
                                </div>
                            </div>

                            {/* Detailed Rules & Includes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white border-2 border-black p-6 shadow-neo hover:-translate-y-1 transition-transform">
                                    <h4 className="font-black uppercase mb-4 flex items-center gap-2 text-lg border-b-2 border-black pb-2"><Info className="w-5 h-5" /> Regolamento & Info</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">{selectedTournament.rules || "Regolamento standard del sistema di gioco. Fair play richiesto."}</p>
                                </div>
                                <div className="bg-white border-2 border-black p-6 shadow-neo hover:-translate-y-1 transition-transform">
                                    <h4 className="font-black uppercase mb-4 flex items-center gap-2 text-lg border-b-2 border-black pb-2"><Gift className="w-5 h-5" /> Loot Incluso</h4>
                                    <ul className="space-y-3">
                                        {(() => {
                                            try {
                                                const includes = selectedTournament.includes ? JSON.parse(selectedTournament.includes) : [];
                                                return Array.isArray(includes) ? includes.map((inc: string, i: number) => (
                                                    <li key={i} className="flex items-center gap-3 text-sm font-bold">
                                                        <CheckCircle className="w-4 h-4 text-neo-lime" /> {inc}
                                                    </li>
                                                )) : null;
                                            } catch (e) {
                                                return null;
                                            }
                                        })()}
                                    </ul>
                                </div>
                            </div>

                            {/* Actions */}
                            {user ? (
                                <div className="space-y-3 border-t-4 border-black pt-8">
                                    {isRegistered(selectedTournament.id) ? (
                                        <div className="flex gap-4">
                                            <div className="flex-1 bg-neo-lime border-2 border-black py-4 font-black uppercase text-center flex items-center justify-center gap-2 text-xl shadow-neo">
                                                <CheckCircle className="w-6 h-6" /> Sei Iscritto
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Sei sicuro di volerti ritirare?')) {
                                                        withdrawFromTournament(selectedTournament.id);
                                                        setSelectedTournament(null);
                                                        showToast('Ti sei ritirato dal torneo', 'info');
                                                    }
                                                }}
                                                className="bg-red-500 text-white border-2 border-black px-8 font-black uppercase hover:bg-red-600 shadow-neo hover:shadow-none hover:translate-y-1 transition-all"
                                            >
                                                Ritirati
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                registerForTournament(selectedTournament.id);
                                                setSelectedTournament(null);
                                            }}
                                            className="w-full bg-black text-white py-5 font-black uppercase border-2 border-black hover:bg-neo-pink hover:text-white transition-all shadow-neo hover:shadow-none hover:translate-y-1 text-xl flex items-center justify-center gap-3"
                                        >
                                            Iscriviti Ora <Swords className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center font-bold text-red-500 border-2 border-red-500 p-6 bg-red-50 uppercase">
                                    Effettua il login per iscriverti ai tornei
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Request Modal (Campaigns) */}
            {selectedCampaign && (
                <CampaignRequestModal
                    campaign={selectedCampaign}
                    onClose={() => setSelectedCampaign(null)}
                />
            )}

            {/* Detail Modal (Campaigns) */}
            {selectedCampaignDetail && (
                <CampaignDetailModal
                    campaign={selectedCampaignDetail}
                    onClose={() => setSelectedCampaignDetail(null)}
                    onRequestJoin={() => {
                        setSelectedCampaignDetail(null);
                        setSelectedCampaign(selectedCampaignDetail);
                    }}
                />
            )}

            {/* Product Detail Modal (Game Info) */}
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default Tournaments;