import React, { useState, useEffect } from 'react';
import {
    User as UserIcon, Book, X, Dice5, Save, Lock, Users,
    Calendar, BookOpen, Compass, Shield, Heart, Loader2,
    ChevronRight, Info, Wand2, ExternalLink, Skull, FileText,
    AlertTriangle, CheckCircle, HelpCircle, UserPlus, Send,
    MessageSquare, Plus, Crown, Sparkles, Scroll, PenTool,
    Sword, Scale
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useCampaigns } from '../contexts/CampaignContext';
import { Campaign, Character, CampaignNote } from '@/types';
import api from '../services/api';
import EditCharacterModal from '../components/features/dnd/EditCharacterModal';
import { askAiAssistant } from '../services/ai';

const DnDTracker: React.FC = () => {
    const { user } = useUser();
    const { campaigns, loading, refreshCampaigns } = useCampaigns();

    // View States
    const [viewMode, setViewMode] = useState<'my_campaigns' | 'all' | 'board'>('all');
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'party' | 'sessions' | 'chat'>('details');

    // Modals & New Objects
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createMode, setCreateMode] = useState<'dm' | 'proposal' | null>(null);
    const [editingChar, setEditingChar] = useState<Character | null>(null);

    // Form Data (Proposal/Create)
    const [newCampaignData, setNewCampaignData] = useState({
        title: '', description: '', system: 'D&D 5e',
        minPlayers: 3, maxPlayers: 5, rules: '', plot: '',
        frequency: 'Weekly', sessionDuration: '3-4 hours'
    });

    // Chat
    const [chatMessage, setChatMessage] = useState('');

    // --- Derived Data ---
    const myCampaigns = campaigns.filter(c =>
        c.participants.some(p => p.user.id === user?.id) || c.dm.id === user?.id
    );

    const proposals = campaigns.filter(c => c.isProposal);
    const activeCampaigns = campaigns.filter(c => !c.isProposal);

    const filteredCampaigns = viewMode === 'my_campaigns' ? myCampaigns
        : viewMode === 'board' ? proposals
            : activeCampaigns;

    // --- Helpers ---
    const isUserInCampaign = (campaign: Campaign) => {
        return campaign.participants.some(p => p.user.id === user?.id);
    };

    const getPlayerCharacter = (campaign: Campaign) => {
        const p = campaign.participants.find(part => part.user.id === user?.id);
        return p?.character;
    };

    // --- Handlers ---
    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/campaigns', {
                ...newCampaignData,
                isProposal: createMode === 'proposal',
                proposerId: user?.id,
                dmId: createMode === 'dm' ? user?.id : undefined
            });
            refreshCampaigns();
            setShowCreateModal(false);
            setCreateMode(null);
            alert(createMode === 'proposal' ? 'Proposta inviata!' : 'Campagna Creata!');
        } catch (err) {
            console.error(err);
            alert('Errore creazione campagna');
        }
    };

    const handleJoinRequest = async (campaignId: string, char: Character) => {
        const alreadyIn = selectedCampaign?.participants.some(p => p.user.id === user?.id);
        if (alreadyIn) return alert("Hai già un personaggio in questa campagna!");

        try {
            await api.post(`/campaigns/${campaignId}/request`, {
                userId: user?.id,
                characterId: char.id,
                message: "Vorrei unirmi!"
            });
            alert('Richiesta inviata!');
            refreshCampaigns();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Errore nella richiesta');
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatMessage.trim() || !selectedCampaign || !user) return;
        const myChar = getPlayerCharacter(selectedCampaign);
        try {
            await api.post(`/campaigns/${selectedCampaign.id}/notes`, {
                content: chatMessage,
                userId: user.id,
                characterId: myChar?.id,
                type: 'CHAT'
            });
            setChatMessage('');
            const updated = await api.get(`/campaigns/${selectedCampaign.id}`);
            setSelectedCampaign(updated.data);
        } catch (err) {
            console.error("Chat error", err);
        }
    };

    const handleBecomeDM = async (campaign: Campaign) => {
        if (!confirm('Vuoi diventare il DM di questa avventura? Sostituirai il gestore attuale.')) return;
        try {
            await api.put(`/campaigns/${campaign.id}`, {
                dmId: user?.id,
                status: 'RECRUITING',
                proposalStatus: 'DM_ASSIGNED'
            });
            refreshCampaigns();
            setSelectedCampaign(null);
            alert('Sei il nuovo DM! Ora configura le regole e la trama.');
        } catch (err) {
            alert('Impossibile diventare DM');
        }
    };

    // --- Renderers ---
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="w-12 h-12 animate-spin text-black" /></div>;

    return (
        <div className="min-h-screen bg-zinc-50 font-sans text-black pb-20">
            {/* --- HEADER --- */}
            <div className="bg-white border-b-4 border-black p-8 px-4 md:px-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            {/* Adjusted Title Size and Style */}
                            <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-4">
                                D&D <span className="text-transparent bg-clip-text bg-gradient-to-r from-neo-violet to-neo-pink decoration-4 underline decoration-black underline-offset-4">Tracker</span>
                            </h1>
                            <p className="text-xl font-bold text-zinc-600 max-w-lg">
                                Esplora dungeon, crea legami e tira d20. Il tuo compagno digitale per campagne epiche.
                            </p>
                        </div>
                        <a href="https://dnd.wizards.com/it/how-to-play" target="_blank" rel="noreferrer"
                            className="group flex items-center gap-2 px-6 py-3 bg-white border-4 border-black font-black uppercase hover:bg-neo-lime hover:-translate-y-1 hover:shadow-neo transition-all">
                            Come Giocare <ExternalLink className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        </a>
                    </div>

                    {/* Onboarding Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t-4 border-black pt-8">
                        {[
                            { step: '1', title: 'Iscriviti', text: 'Trova una campagna nella lista o proponi un nuovo tema in Bacheca.', color: 'bg-neo-pink', icon: UserPlus },
                            { step: '2', title: 'Crea PG', text: 'Crea il tuo eroe. Rispetta il limite di 1 personaggio per avventura.', color: 'bg-neo-cyan', icon: Scroll },
                            { step: '3', title: 'Gioca', text: 'Partecipa alle sessioni, chatta col party e consulta le note del DM.', color: 'bg-neo-yellow', icon: Dice5 }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 group">
                                <div className={`${item.color} p-4 border-2 border-black shadow-neo group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-8 h-8 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl uppercase mb-1">{item.step}. {item.title}</h3>
                                    <p className="font-medium text-zinc-600 leading-snug text-sm">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                    <Dice5 className="w-96 h-96" />
                </div>
            </div>

            <main className="max-w-7xl mx-auto p-4 md:p-12">
                {/* --- CONTROLS --- */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12 sticky top-4 z-40 bg-zinc-50/90 backdrop-blur-sm p-4 border-2 border-black shadow-neo-sm">
                    <div className="flex gap-2">
                        {[
                            { id: 'all', label: 'Tutte', icon: Compass },
                            { id: 'my_campaigns', label: 'Le Mie', icon: Crown },
                            { id: 'board', label: 'Bacheca', icon: FileText }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setViewMode(tab.id as any); setSelectedCampaign(null); }}
                                className={`px-4 py-2 flex items-center gap-2 font-black uppercase text-sm border-2 border-black transition-all 
                                    ${viewMode === tab.id ? 'bg-black text-white shadow-none translate-y-1' : 'bg-white hover:bg-zinc-100 hover:-translate-y-1 hover:shadow-neo'}`}
                            >
                                <tab.icon className="w-4 h-4" /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-neo-violet text-white px-6 py-2 border-2 border-black shadow-neo font-black uppercase hover:shadow-neo-hover hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Nuova Avventura
                    </button>
                </div>

                {/* --- CONTENT LIST --- */}
                {!selectedCampaign && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCampaigns.map(campaign => (
                            <div
                                key={campaign.id}
                                onClick={() => setSelectedCampaign(campaign)}
                                className={`
                                    relative flex flex-col h-full border-4 border-black transition-all duration-300 cursor-pointer group
                                    ${campaign.isProposal ? 'bg-neo-bg hover:rotate-1 shadow-none hover:shadow-neo-lg' : 'bg-white shadow-neo hover:shadow-neo-xl hover:-translate-y-2'}
                                `}
                            >
                                {/* Active/Proposal Indicator */}
                                {campaign.isProposal && (
                                    <div className="absolute -top-3 -right-3 z-20">
                                        <span className="bg-neo-yellow border-2 border-black px-3 py-1 font-black text-xs uppercase shadow-sm rotate-3 inline-block">
                                            Cercasi DM
                                        </span>
                                    </div>
                                )}

                                {/* Image Section */}
                                <div className="h-48 overflow-hidden border-b-4 border-black relative">
                                    <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className={`absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors ${campaign.status === 'RECRUITING' ? 'ring-inset ring-4 ring-neo-green/50' : ''}`} />

                                    {/* Overlay Info */}
                                    <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="flex gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-white border-2 border-black text-[10px] font-black uppercase tracking-wider">
                                                {campaign.system}
                                            </span>
                                            {!campaign.isProposal && (
                                                <span className={`px-2 py-0.5 border-2 border-black text-[10px] font-black uppercase tracking-wider text-white ${campaign.status === 'RECRUITING' ? 'bg-neo-green text-black' : 'bg-zinc-600'}`}>
                                                    {campaign.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex-1 flex flex-col relative overflow-hidden">
                                    {/* Proposal Blueprint Pattern */}
                                    {campaign.isProposal && (
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                            style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                    )}

                                    <h3 className="text-2xl font-black uppercase leading-tight mb-3 group-hover:text-neo-violet transition-colors">
                                        {campaign.title}
                                    </h3>

                                    <p className="text-zinc-600 font-medium text-sm line-clamp-3 mb-6 flex-grow">
                                        {campaign.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="mt-auto pt-4 border-t-2 border-black/10 flex justify-between items-center">
                                        {campaign.isProposal ? (
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {/* Fake avatars for interest */}
                                                    {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-zinc-300 border-2 border-white"></div>)}
                                                </div>
                                                <span className="text-xs font-bold text-zinc-500">+{campaign._count?.requests || 0} interessati</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-zinc-700">
                                                <Users className="w-4 h-4" />
                                                <span className="font-bold text-sm">{campaign.participants?.length || 0}/{campaign.maxPlayers || 4}</span>
                                            </div>
                                        )}

                                        <div className="bg-black text-white px-3 py-1 text-xs font-black uppercase flex items-center gap-1 group-hover:bg-neo-pink transition-colors">
                                            Dettagli <ChevronRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- CAMPAIGN DETAILS --- */}
                {selectedCampaign && (
                    <div className="animate-in slide-in-from-bottom duration-300">
                        <button
                            onClick={() => setSelectedCampaign(null)}
                            className="mb-6 flex items-center gap-2 font-black uppercase hover:underline"
                        >
                            <ChevronRight className="w-5 h-5 rotate-180" /> Torna alla lista
                        </button>

                        <div className="bg-white border-4 border-black shadow-neo-lg overflow-hidden">
                            {/* Hero */}
                            <div className="h-80 relative">
                                <img src={selectedCampaign.image} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="flex gap-2 mb-4">
                                                <span className="bg-neo-violet text-white px-3 py-1 font-black uppercase text-sm border-2 border-white shadow-sm transform -rotate-2">{selectedCampaign.system}</span>
                                                <span className="bg-neo-pink text-white px-3 py-1 font-black uppercase text-sm border-2 border-white shadow-sm transform rotate-1">{selectedCampaign.type}</span>
                                            </div>
                                            <h2 className="text-5xl md:text-7xl font-black text-white uppercase mb-2 drop-shadow-lg">{selectedCampaign.title}</h2>
                                        </div>
                                        {/* DM Card (floating) */}
                                        <div className="hidden md:flex items-center gap-3 bg-white p-3 border-4 border-black shadow-neo transform translate-y-12">
                                            <img src={selectedCampaign.dm.avatar || ""} className="w-12 h-12 border-2 border-black" />
                                            <div>
                                                <div className="text-[10px] uppercase font-black text-zinc-400">Dungeon Master</div>
                                                <div className="font-black text-lg leading-none">{selectedCampaign.dm.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex overflow-x-auto border-b-4 border-black bg-zinc-100 p-2 gap-2 pl-4 md:pl-8 pt-16 md:pt-4">
                                {['details', 'party', 'chat'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`px-6 py-3 font-black uppercase text-sm border-2 transition-all ${activeTab === tab
                                            ? 'bg-black text-white border-black shadow-neo translate-y-[-2px]'
                                            : 'bg-white text-black border-transparent hover:border-black hover:bg-zinc-50'}`}
                                    >
                                        {tab === 'details' ? 'Info & Regole' : tab === 'chat' ? 'Chat & Note' : 'Avventurieri'}
                                    </button>
                                ))}
                            </div>

                            <div className="p-8">
                                {/* TAB 1: INFO & RULES */}
                                {activeTab === 'details' && (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 space-y-8">
                                            {selectedCampaign.isProposal && (
                                                <div className="bg-neo-yellow/30 border-4 border-black border-dashed p-6 mb-6">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <AlertTriangle className="w-10 h-10 text-neo-yellow stroke-[3px]" />
                                                        <div>
                                                            <h3 className="text-2xl font-black uppercase">Cercasi Dungeon Master</h3>
                                                            <p className="font-medium">Questa è una proposta della community. Serve un eroe che la guidi.</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleBecomeDM(selectedCampaign)}
                                                        className="w-full bg-black text-white px-6 py-4 font-black uppercase hover:bg-zinc-800 flex justify-center items-center gap-2 text-lg shadow-neo hover:-translate-y-1 transition-all"
                                                    >
                                                        <Crown className="w-6 h-6" /> Prendi il controllo (Diventa DM)
                                                    </button>
                                                </div>
                                            )}

                                            <div>
                                                <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                                                    <BookOpen className="w-6 h-6" /> Trama
                                                </h3>
                                                <div className="prose-lg font-medium text-zinc-800 p-6 bg-zinc-50 border-l-4 border-neo-violet">
                                                    {selectedCampaign.description}
                                                    {selectedCampaign.plot && <p className="mt-4 pt-4 border-t-2 border-dashed border-zinc-300">{selectedCampaign.plot}</p>}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                                                    <Scale className="w-6 h-6" /> Regole del Tavolo
                                                </h3>
                                                <div className="bg-zinc-900 text-zinc-100 p-6 font-mono text-sm leading-relaxed border-2 border-black shadow-neo relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-2 opacity-20"><Shield className="w-24 h-24" /></div>
                                                    {selectedCampaign.rules || "Nessuna regola specifica inserita dal DM. Preparati al caos."}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-neo-cyan border-4 border-black p-6 shadow-neo">
                                                <h4 className="font-black uppercase mb-4 text-xl">Scheda Sessione</h4>
                                                <ul className="space-y-4 font-bold text-sm">
                                                    <li className="flex justify-between items-center border-b border-black/20 pb-2">
                                                        <span className="flex items-center gap-2"><Sword className="w-4 h-4" /> Livelli</span>
                                                        <span className="bg-white px-2 py-1 border border-black">{selectedCampaign.levelRange}</span>
                                                    </li>
                                                    <li className="flex justify-between items-center border-b border-black/20 pb-2">
                                                        <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Min Players</span>
                                                        <span className="bg-white px-2 py-1 border border-black">{selectedCampaign.minPlayers || 3}</span>
                                                    </li>
                                                    <li className="flex justify-between items-center border-b border-black/20 pb-2">
                                                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Frequenza</span>
                                                        <span className="bg-white px-2 py-1 border border-black">{selectedCampaign.frequency}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: PARTY */}
                                {activeTab === 'party' && (
                                    <div>
                                        {/* Same implementation as before but verify container exists */}
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-2xl font-black uppercase">Il Party ({selectedCampaign.participants.length}/{selectedCampaign.maxPlayers || 6})</h3>
                                            {!isUserInCampaign(selectedCampaign) && selectedCampaign.status === 'RECRUITING' && (
                                                <button
                                                    onClick={() => alert('Crea un personaggio dalla lista "Le Mie Campagne" o usa il tasto "+"')}
                                                    className="bg-neo-green px-6 py-2 border-2 border-black font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none"
                                                >
                                                    Unisciti
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {selectedCampaign.participants.map(p => (
                                                <div key={p.id} className="border-4 border-black bg-white group hover:-translate-y-1 transition-transform">
                                                    {/* Character Card Header */}
                                                    <div className="bg-zinc-900 text-white p-3 flex justify-between items-center">
                                                        <span className="font-black uppercase truncate">{p.character.name}</span>
                                                        <div className="flex items-center gap-1 text-xs text-neo-yellow font-bold">
                                                            LVL {p.character.level}
                                                        </div>
                                                    </div>

                                                    <div className="p-4 flex gap-4 items-center">
                                                        <div className="relative">
                                                            <img src={p.character.avatar} className="w-20 h-20 border-2 border-black object-cover" />
                                                            <div className="absolute -bottom-2 -right-2 bg-neo-pink border border-black w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                                                                HP
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{p.character.race}</div>
                                                            <div className="font-black text-lg uppercase leading-none mb-2">{p.character.class}</div>
                                                            <div className="text-xs font-medium text-zinc-500">Giocato da {p.user.name}</div>
                                                        </div>
                                                    </div>

                                                    {p.user.id === user?.id && (
                                                        <button
                                                            onClick={() => { setEditingChar(p.character); }}
                                                            className="w-full py-2 bg-zinc-100 hover:bg-black hover:text-white border-t-2 border-black font-bold uppercase text-xs transition-colors"
                                                        >
                                                            Modifica Scheda
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            {!isUserInCampaign(selectedCampaign) && (
                                                <div
                                                    onClick={() => alert("Funzionalità di unione veloce in arrivo")}
                                                    className="border-4 border-black border-dashed flex items-center justify-center bg-zinc-50 h-full min-h-[160px] cursor-pointer hover:bg-zinc-100 group"
                                                >
                                                    <div className="text-center text-zinc-400 font-black uppercase group-hover:text-black transition-colors">
                                                        <Plus className="w-8 h-8 mx-auto mb-2" />
                                                        Slot Libero
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: CHAT */}
                                {activeTab === 'chat' && (
                                    <div className="flex flex-col h-[600px] border-4 border-black bg-white shadow-neo">
                                        {/* Chat implementation remains similar but with cleaner bubbles */}
                                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50 custom-scrollbar">
                                            {selectedCampaign.notes?.filter(n => n.type === 'CHAT').length === 0 && (
                                                <div className="text-center text-zinc-400 py-10 italic">Nessun messaggio. Rompi il ghiaccio!</div>
                                            )}
                                            {selectedCampaign.notes?.filter(n => n.type === 'CHAT').map(note => (
                                                <div key={note.id} className={`flex items-end gap-2 ${note.userId === user?.id ? 'flex-row-reverse' : ''} mb-2`}>
                                                    <img
                                                        src={note.character?.avatar || note.user?.avatar || "https://via.placeholder.com/40"}
                                                        className="w-8 h-8 border border-black bg-white object-cover"
                                                    />
                                                    <div className={`max-w-[70%] p-3 border-2 border-black text-sm font-medium shadow-sm ${note.userId === user?.id ? 'bg-neo-cyan rounded-tr-none' :
                                                        note.userId === selectedCampaign.dm.id ? 'bg-neo-yellow rounded-tl-none' : 'bg-white rounded-tl-none'
                                                        }`}>
                                                        <div className="text-[10px] font-black uppercase mb-1 opacity-50">{note.character?.name || note.user?.name}</div>
                                                        {note.content}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t-4 border-black flex gap-2">
                                            <input
                                                type="text"
                                                value={chatMessage}
                                                onChange={(e) => setChatMessage(e.target.value)}
                                                placeholder={isUserInCampaign(selectedCampaign) ? "Scrivi come il tuo personaggio..." : "Chatta..."}
                                                className="flex-1 p-3 border-2 border-black focus:shadow-neo focus:outline-none font-bold"
                                            />
                                            <button
                                                type="submit"
                                                className="bg-black text-white px-4 py-2 border-2 border-black hover:bg-neo-lime hover:text-black transition-colors font-black uppercase"
                                            >
                                                Invia
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modals omitted for brevity, keeping previous logic but ensures imports are correct */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white border-4 border-black shadow-neo-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {!createMode ? (
                            <div className="p-8 text-center space-y-8">
                                <h2 className="text-4xl font-black uppercase">Scegli il tuo Destino</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button
                                        onClick={() => setCreateMode('dm')}
                                        className="p-8 border-4 border-black hover:bg-neo-violet hover:text-white transition-all group shadow-neo hover:shadow-neo-lg hover:-translate-y-1"
                                    >
                                        <Crown className="w-16 h-16 mx-auto mb-4" />
                                        <h3 className="text-2xl font-black uppercase mb-2">Sono un DM</h3>
                                        <p className="font-medium text-zinc-500 group-hover:text-white/80">Crea una campagna completa, stabilisci le regole e recluta giocatori.</p>
                                    </button>
                                    <button
                                        onClick={() => setCreateMode('proposal')}
                                        className="p-8 border-4 border-black hover:bg-neo-yellow transition-all group shadow-neo hover:shadow-neo-lg hover:-translate-y-1"
                                    >
                                        <Sparkles className="w-16 h-16 mx-auto mb-4" />
                                        <h3 className="text-2xl font-black uppercase mb-2">Ho un'idea</h3>
                                        <p className="font-medium text-zinc-500 group-hover:text-black/80">Proponi un tema o un'avventura e cerca un Dungeon Master.</p>
                                    </button>
                                </div>
                                <button onClick={() => setShowCreateModal(false)} className="underline font-bold text-zinc-500 mt-4 block mx-auto">Annulla</button>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateCampaign} className="p-8 space-y-6">
                                {/* Form content reused from previous implementation */}
                                <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                                    <h2 className="text-3xl font-black uppercase">{createMode === 'dm' ? 'Nuova Campagna' : 'Proponi Avventura'}</h2>
                                    <button type="button" onClick={() => setShowCreateModal(false)}><X className="w-8 h-8" /></button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-black uppercase text-sm mb-1">Titolo</label>
                                        <input
                                            required
                                            value={newCampaignData.title}
                                            onChange={e => setNewCampaignData({ ...newCampaignData, title: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-bold focus:shadow-neo focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-black uppercase text-sm mb-1">Descrizione / Trama</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={newCampaignData.description}
                                            onChange={e => setNewCampaignData({ ...newCampaignData, description: e.target.value })}
                                            className="w-full p-3 border-2 border-black focus:shadow-neo focus:outline-none"
                                            placeholder={createMode === 'proposal' ? "Descrivi il tema che vorresti giocare..." : "L'incipit della storia..."}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-black uppercase text-sm mb-1">Sistema</label>
                                            <select
                                                value={newCampaignData.system}
                                                onChange={e => setNewCampaignData({ ...newCampaignData, system: e.target.value })}
                                                className="w-full p-3 border-2 border-black font-bold focus:outline-none"
                                            >
                                                <option>D&D 5e</option>
                                                <option>Pathfinder 2e</option>
                                                <option>Cyberpunk Red</option>
                                                <option>Call of Cthulhu</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block font-black uppercase text-sm mb-1">Min Giocatori</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={newCampaignData.minPlayers}
                                                onChange={e => setNewCampaignData({ ...newCampaignData, minPlayers: parseInt(e.target.value) })}
                                                className="w-full p-3 border-2 border-black font-bold focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {createMode === 'dm' && (
                                        <div className="space-y-4 pt-4 border-t-2 border-dashed border-zinc-300">
                                            <div className="bg-neo-lime/20 p-4 border-2 border-black">
                                                <h4 className="font-black uppercase text-sm mb-2 flex items-center gap-2"><PenTool className="w-4 h-4" /> Sezione DM</h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block font-bold text-xs uppercase mb-1">Regole del Tavolo (Markdown)</label>
                                                        <textarea
                                                            value={newCampaignData.rules}
                                                            onChange={e => setNewCampaignData({ ...newCampaignData, rules: e.target.value })}
                                                            className="w-full p-2 border border-black text-sm bg-white"
                                                            rows={3}
                                                            placeholder="- Rispetto reciproco\n- Avvisare 24h prima..."
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block font-bold text-xs uppercase mb-1">Durata Sessione</label>
                                                            <input
                                                                value={newCampaignData.sessionDuration}
                                                                onChange={e => setNewCampaignData({ ...newCampaignData, sessionDuration: e.target.value })}
                                                                className="w-full p-2 border border-black text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block font-bold text-xs uppercase mb-1">Frequenza</label>
                                                            <select
                                                                value={newCampaignData.frequency}
                                                                onChange={e => setNewCampaignData({ ...newCampaignData, frequency: e.target.value })}
                                                                className="w-full p-2 border border-black text-sm"
                                                            >
                                                                <option>Weekly</option>
                                                                <option>Bi-weekly</option>
                                                                <option>Monthly</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-black text-white font-black uppercase text-xl hover:bg-zinc-800 transition-all flex justify-center items-center gap-2 shadow-neo hover:translate-y-1 hover:shadow-none"
                                >
                                    {createMode === 'dm' ? 'Crea Campagna' : 'Invia Proposta'} <ChevronRight className="w-6 h-6" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {editingChar && (
                <EditCharacterModal
                    character={editingChar}
                    isOpen={true}
                    onClose={() => setEditingChar(null)}
                    onUpdate={() => {
                        refreshCampaigns();
                        api.get(`/campaigns/${selectedCampaign?.id}`).then(res => setSelectedCampaign(res.data));
                    }}
                />
            )}
        </div>
    );
};

export default DnDTracker;