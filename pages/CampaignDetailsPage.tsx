import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Calendar, Users, Swords, Scroll, Plus, Settings, Share2, Crown } from 'lucide-react';
import CharacterCard from '../components/CharacterCard';
import SessionItem from '../components/SessionItem';
import CharacterSheetModal from '../components/CharacterSheetModal';
import { useToast } from '../contexts/ToastContext';

const CampaignDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'characters'>('overview');

    const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response = await api.get(`/campaigns/${id}`);
                setCampaign(response.data);
            } catch (error) {
                console.error('Error fetching campaign:', error);
                showToast('Errore nel caricamento della campagna', 'error');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCampaign();
    }, [id, navigate, showToast]);

    if (loading) return <div className="flex items-center justify-center h-screen font-black uppercase">Caricamento Avventura...</div>;
    if (!campaign) return null;

    const tags = JSON.parse(campaign.tags || '[]');

    return (
        <div className="min-h-screen bg-neo-bg font-sans pb-20">
            {/* Modal */}
            {selectedCharacter && (
                <CharacterSheetModal
                    character={selectedCharacter}
                    onClose={() => setSelectedCharacter(null)}
                />
            )}

            {/* Hero Header */}
            <div className="relative h-[400px] w-full border-b-4 border-black overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />

                <div className="absolute top-6 left-6 z-20">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-white border-2 border-black px-4 py-2 font-black uppercase hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-neo-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Torna alla Dashboard
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full z-20 p-8 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-purple-500 text-white px-3 py-1 font-black uppercase text-sm border border-black shadow-neo-sm">
                                {campaign.system}
                            </span>
                            <span className="bg-yellow-400 text-black px-3 py-1 font-black uppercase text-sm border border-black shadow-neo-sm">
                                {campaign.status}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic drop-shadow-[4px_4px_0_rgba(0,0,0,1)] mb-4">
                            {campaign.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-white font-bold uppercase tracking-wider text-sm">
                            <div className="flex items-center gap-2">
                                <Crown className="w-5 h-5 text-yellow-400" />
                                DM: {campaign.dm?.name}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                {campaign.currentPlayers} / {campaign.maxPlayers} Giocatori
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                {campaign.frequency}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white border-2 border-black p-6 shadow-neo">
                            <h3 className="font-black uppercase text-xl mb-4 border-b-2 border-black pb-2">Azioni Rapide</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-black text-white p-3 font-black uppercase hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Aggiungi Sessione
                                </button>
                                <button className="w-full bg-white border-2 border-black p-3 font-black uppercase hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <Settings className="w-4 h-4" /> Impostazioni
                                </button>
                                <button className="w-full bg-white border-2 border-black p-3 font-black uppercase hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <Share2 className="w-4 h-4" /> Condividi
                                </button>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-white border-2 border-black p-6 shadow-neo">
                            <h3 className="font-black uppercase text-xl mb-4 border-b-2 border-black pb-2">Dettagli</h3>
                            <div className="space-y-4 text-sm font-bold">
                                <div>
                                    <span className="text-gray-500 uppercase text-xs block">Piattaforma</span>
                                    {campaign.platform}
                                </div>
                                <div>
                                    <span className="text-gray-500 uppercase text-xs block">Durata Sessione</span>
                                    {campaign.sessionDuration}
                                </div>
                                <div>
                                    <span className="text-gray-500 uppercase text-xs block">Livelli</span>
                                    {campaign.levelRange}
                                </div>
                                <div>
                                    <span className="text-gray-500 uppercase text-xs block">Tags</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {tags.map((tag: string, i: number) => (
                                            <span key={i} className="bg-gray-100 border border-black px-2 py-1 text-xs uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tabs */}
                        <div className="flex border-b-4 border-black bg-white">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 py-4 font-black uppercase tracking-wider hover:bg-gray-50 transition-colors ${activeTab === 'overview' ? 'bg-black text-white hover:bg-black' : ''}`}
                            >
                                Panoramica
                            </button>
                            <button
                                onClick={() => setActiveTab('sessions')}
                                className={`flex-1 py-4 font-black uppercase tracking-wider hover:bg-gray-50 transition-colors ${activeTab === 'sessions' ? 'bg-black text-white hover:bg-black' : ''}`}
                            >
                                Sessioni ({campaign.sessions?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('characters')}
                                className={`flex-1 py-4 font-black uppercase tracking-wider hover:bg-gray-50 transition-colors ${activeTab === 'characters' ? 'bg-black text-white hover:bg-black' : ''}`}
                            >
                                Eroi ({campaign.participants?.length || 0})
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white border-2 border-black p-8 shadow-neo min-h-[400px]">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black uppercase italic flex items-center gap-3">
                                        <Scroll className="w-8 h-8" /> La Storia
                                    </h2>
                                    <p className="text-lg leading-relaxed font-medium text-gray-800 whitespace-pre-wrap">
                                        {campaign.description}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'sessions' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-3xl font-black uppercase italic flex items-center gap-3">
                                            <Swords className="w-8 h-8" /> Diario di Guerra
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        {campaign.sessions?.length > 0 ? (
                                            campaign.sessions.map((session: any) => (
                                                <SessionItem key={session.id} session={session} />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300">
                                                <p className="font-bold text-gray-400 uppercase">Nessuna sessione registrata</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'characters' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-3xl font-black uppercase italic flex items-center gap-3">
                                        <Users className="w-8 h-8" /> Compagnia dell'Anello
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {campaign.participants?.length > 0 ? (
                                            campaign.participants.map((p: any, index: number) => (
                                                <div key={p.id} className="animate-in zoom-in-50 duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                                                    <CharacterCard
                                                        character={p.character}
                                                        onClick={() => setSelectedCharacter(p.character)}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300">
                                                <p className="font-bold text-gray-400 uppercase">Nessun eroe si è ancora unito</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetailsPage;
