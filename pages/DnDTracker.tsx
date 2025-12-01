import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_CAMPAIGNS } from '../constants';
import { Campaign, Character, Session, CampaignNote } from '../types';
import { Sword, Scroll, Skull, MapPin, Feather, Plus, ChevronLeft, Bot, Sparkles, User as UserIcon, Book, X, Dice5, Save, Lock } from 'lucide-react';
import { askAiAssistant } from '../services/ai';
import EditCharacterModal from '../components/features/dnd/EditCharacterModal';

interface DnDTrackerProps {
    user: User;
}

const DnDTracker: React.FC<DnDTrackerProps> = ({ user }) => {
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [activeTab, setActiveTab] = useState<'party' | 'chronicles' | 'tome'>('party');

    // States for AI
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    // Character Creation State
    const [showCharModal, setShowCharModal] = useState(false);
    const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
        name: '',
        class: '',
        race: '',
        level: 1,
        status: 'ALIVE',
        avatar: '',
        player: ''
    });

    // Edit Character State
    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const isUserRegisteredForCampaign = (campaign: Campaign) => {
        // Logic: Check if user is in participants
        return campaign.participants.some(p => p.user.id === user.id);
    };

    const handleGenerateSummary = async (sessionTitle: string) => {
        setIsAiGenerating(true);
        const prompt = `Write a dramatic, high-fantasy summary for a D&D session titled "${sessionTitle}" where the party faced unexpected challenges. Keep it under 100 words.`;
        const summary = await askAiAssistant(prompt);
        alert(`AI Generated Summary:\n\n${summary}`);
        setIsAiGenerating(false);
    };

    const handleRandomizeAvatar = () => {
        const seed = newCharacter.name || Math.random().toString(36).substring(7);
        setNewCharacter({
            ...newCharacter,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
        });
    };

    const handleAddCharacter = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCampaign || !newCharacter.name || !newCharacter.class) return;

        const character: Character = {
            id: `ch_${Math.random().toString(36).substr(2, 9)}`,
            name: newCharacter.name,
            class: newCharacter.class,
            race: newCharacter.race || 'Human',
            level: newCharacter.level || 1,
            status: 'ALIVE',
            userId: user.id,
            stats: {},
            skills: {},
            hp: 10 + (newCharacter.level || 1) * 5,
            maxHp: 10 + (newCharacter.level || 1) * 5,
            avatar: newCharacter.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newCharacter.name}`
        };

        const newParticipant = {
            id: `cp_${Math.random().toString(36).substr(2, 9)}`,
            character: character,
            user: { id: user.id, name: user.name, avatar: user.avatar || '' },
            joinedAt: new Date().toISOString()
        };

        const updatedCampaign = {
            ...selectedCampaign,
            participants: [...selectedCampaign.participants, newParticipant]
        };
        setSelectedCampaign(updatedCampaign);
        setShowCharModal(false);
        setNewCharacter({ name: '', class: '', race: '', level: 1, status: 'ALIVE', avatar: '', player: '' });
    };

    const handleUpdateCharacter = () => {
        // Refresh campaign data logic would go here
        // For now, we update the local state if the edited character is in the current campaign
        if (selectedCampaign && editingCharacter) {
            const updatedParticipants = selectedCampaign.participants.map(p =>
                p.character.id === editingCharacter.id ? { ...p, character: { ...p.character, ...editingCharacter } } : p
            );

            // Update local state for immediate feedback
            // Note: In a real app we would PUT to /campaigns/:id/characters/:charId
            // For now we just alert and close
            setIsEditModalOpen(false);
            setEditingCharacter(null);
            alert('Personaggio aggiornato! (Ricarica per vedere i dettagli completi se necessario)');
        }
    };

    if (!selectedCampaign) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-12 border-b-4 border-black pb-6">
                    <div>
                        <h1 className="text-5xl font-black uppercase mb-2">Campaign Tracker</h1>
                        <p className="text-xl font-bold text-neo-violet">Gestisci il party, traccia il loot, scrivi la leggenda.</p>
                    </div>
                    <button className="bg-black text-white px-6 py-3 font-bold uppercase hover:bg-neo-lime hover:text-black hover:shadow-neo transition-all flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Nuova Campagna
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_CAMPAIGNS.map(campaign => {
                        const isLocked = !isUserRegisteredForCampaign(campaign);
                        return (
                            <div
                                key={campaign.id}
                                onClick={() => setSelectedCampaign(campaign)}
                                className={`group bg-white border-2 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col relative ${isLocked ? 'opacity-75' : ''}`}
                            >
                                {isLocked && (
                                    <div className="absolute top-4 right-4 z-10 bg-red-500 text-white p-2 rounded-full border-2 border-black shadow-sm" title="Non Iscritto">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                )}
                                <div className="h-48 relative overflow-hidden border-b-2 border-black">
                                    <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute bottom-0 left-0 bg-neo-yellow px-3 py-1 border-t-2 border-r-2 border-black font-black text-xs uppercase">
                                        {campaign.system}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-black uppercase mb-2">{campaign.title}</h3>
                                    <p className="text-sm font-bold text-gray-500 mb-4">DM: {campaign.dm}</p>
                                    <p className="text-gray-700 mb-6 line-clamp-2">{campaign.description}</p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-300">
                                        <div className="flex -space-x-2">
                                            {campaign.participants.slice(0, 3).map(p => (
                                                <img key={p.character.id} src={p.character.avatar} alt={p.character.name} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                                            ))}
                                            {campaign.participants.length > 3 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-white bg-black text-white flex items-center justify-center text-xs font-bold">
                                                    +{campaign.participants.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-bold text-xs uppercase bg-neo-cyan px-2 py-1 border border-black">
                                            {campaign.sessions.length} Sessioni
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    const isLocked = !isUserRegisteredForCampaign(selectedCampaign);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button
                onClick={() => setSelectedCampaign(null)}
                className="mb-6 flex items-center gap-2 font-black uppercase text-sm hover:text-neo-violet transition-colors"
            >
                <ChevronLeft className="w-4 h-4" /> Torna alle Campagne
            </button>

            {/* Campaign Header */}
            <div className="bg-white border-2 border-black shadow-neo mb-8">
                <div className="h-48 md:h-64 relative overflow-hidden border-b-2 border-black">
                    <img src={selectedCampaign.image} alt={selectedCampaign.title} className="w-full h-full object-cover object-center" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase leading-none mb-2">{selectedCampaign.title}</h1>
                            <p className="text-neo-yellow font-bold text-lg">{selectedCampaign.system} • DM: {selectedCampaign.dm.name}</p>
                        </div>
                    </div>
                    {isLocked && (
                        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                            <div className="bg-white border-4 border-black p-6 text-center shadow-neo-lg max-w-md mx-4">
                                <Lock className="w-12 h-12 mx-auto mb-4 text-red-500" />
                                <h2 className="text-2xl font-black uppercase mb-2">Accesso Limitato</h2>
                                <p className="font-medium mb-4">Devi essere iscritto e approvato dal Master per interagire con questa campagna.</p>
                                <button onClick={() => setSelectedCampaign(null)} className="underline font-bold text-sm">Torna Indietro</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex border-b-2 border-black bg-neo-bg">
                    <button
                        onClick={() => setActiveTab('party')}
                        className={`flex-1 py-4 font-black uppercase flex items-center justify-center gap-2 border-r-2 border-black transition-all ${activeTab === 'party' ? 'bg-neo-violet text-white' : 'hover:bg-neo-lime'}`}
                    >
                        <UserIcon className="w-5 h-5" /> The Party
                    </button>
                    <button
                        onClick={() => setActiveTab('chronicles')}
                        className={`flex-1 py-4 font-black uppercase flex items-center justify-center gap-2 border-r-2 border-black transition-all ${activeTab === 'chronicles' ? 'bg-neo-pink text-white' : 'hover:bg-neo-lime'}`}
                    >
                        <Scroll className="w-5 h-5" /> Chronicles
                    </button>
                    <button
                        onClick={() => setActiveTab('tome')}
                        className={`flex-1 py-4 font-black uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'tome' ? 'bg-neo-cyan text-white' : 'hover:bg-neo-lime'}`}
                    >
                        <Book className="w-5 h-5" /> The Tome
                    </button>
                </div>

                <div className={`p-8 min-h-[400px] ${isLocked ? 'blur-sm pointer-events-none select-none' : ''}`}>
                    {/* Party View */}
                    {activeTab === 'party' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedCampaign.participants.map(p => {
                                const char = p.character;
                                return (
                                    <div key={char.id} className="relative bg-white border-2 border-black p-6 shadow-neo-sm hover:translate-x-1 transition-transform">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-16 h-16 border-2 border-black overflow-hidden bg-gray-100">
                                                <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className={`px-2 py-1 text-xs font-black uppercase border-2 border-black ${char.status === 'ALIVE' ? 'bg-neo-lime' : 'bg-red-500 text-white'}`}>
                                                {char.status}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black uppercase">{char.name}</h3>
                                        <p className="text-sm font-bold text-gray-500 mb-4">Livello {char.level} {char.race} {char.class}</p>

                                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t-2 border-gray-100">
                                            <div className="text-center bg-neo-bg p-2 border border-black">
                                                <span className="block text-[10px] font-black uppercase text-gray-400">Giocato Da</span>
                                                <span className="font-bold">{p.user.name}</span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingCharacter(char);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="bg-black text-white text-xs font-bold uppercase hover:bg-neo-violet transition-colors"
                                            >
                                                Scheda
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                            <button
                                onClick={() => setShowCharModal(true)}
                                className="border-2 border-dashed border-black flex flex-col items-center justify-center p-6 hover:bg-neo-bg transition-colors min-h-[250px] opacity-50 hover:opacity-100 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="font-black uppercase">Aggiungi PG</span>
                            </button>
                        </div>
                    )}

                    {/* Chronicles View */}
                    {activeTab === 'chronicles' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black uppercase">Diario di Bordo</h2>
                                <button className="bg-neo-pink text-white px-4 py-2 border-2 border-black font-bold uppercase shadow-neo-sm hover:translate-y-1 hover:shadow-none transition-all">
                                    + Nuova Sessione
                                </button>
                            </div>

                            <div className="relative border-l-4 border-black ml-4 space-y-12">
                                {selectedCampaign.sessions.map(session => (
                                    <div key={session.id} className="relative pl-8">
                                        {/* Timeline dot */}
                                        <div className="absolute -left-[14px] top-0 w-6 h-6 bg-neo-yellow border-2 border-black rounded-full"></div>

                                        <div className="bg-white border-2 border-black p-6 shadow-neo hover:translate-x-1 transition-transform">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b-2 border-gray-100 pb-4">
                                                <div>
                                                    <span className="text-xs font-black uppercase bg-black text-white px-2 py-1 mr-2">{session.date}</span>
                                                    <h3 className="text-xl font-black uppercase inline-block mt-2 md:mt-0">{session.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold uppercase mt-2 md:mt-0">
                                                    <MapPin className="w-4 h-4" /> {session.location}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed font-medium mb-4">{session.summary}</p>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleGenerateSummary(session.title)}
                                                    disabled={isAiGenerating}
                                                    className="flex items-center gap-2 text-xs font-black uppercase text-neo-violet hover:bg-neo-bg px-2 py-1 transition-colors"
                                                >
                                                    {isAiGenerating ? <Sparkles className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                                                    Riscrivi con AI
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tome View */}
                    {activeTab === 'tome' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
                            <div className="col-span-1 border-r-2 border-black pr-8">
                                <button className="w-full bg-neo-cyan text-black border-2 border-black py-3 font-black uppercase mb-6 shadow-neo hover:translate-y-1 hover:shadow-none transition-all">
                                    + Nuova Nota
                                </button>
                                <div className="space-y-4">
                                    <div className="font-bold uppercase text-xs text-gray-500 mb-2">Categorie</div>
                                    {['Tutti', 'Lore', 'NPCs', 'Luoghi', 'Loot'].map(cat => (
                                        <div key={cat} className="flex justify-between items-center cursor-pointer hover:text-neo-violet font-bold">
                                            <span>{cat}</span>
                                            <span className="bg-gray-200 text-[10px] px-2 rounded-full border border-black">3</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedCampaign.notes.map(note => (
                                        <div key={note.id} className="bg-neo-bg border-2 border-black p-4 shadow-neo-sm rotate-1 hover:rotate-0 transition-transform cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black ${note.type === 'NPC' ? 'bg-neo-pink text-white' : 'bg-neo-lime'}`}>
                                                    {note.type}
                                                </span>
                                            </div>
                                            <h4 className="font-black uppercase text-lg mb-2">{note.title}</h4>
                                            <p className="text-sm font-medium text-gray-600 line-clamp-3">{note.content}</p>
                                        </div>
                                    ))}
                                    <div className="border-2 border-black border-dashed p-4 flex items-center justify-center bg-gray-50 opacity-60 hover:opacity-100 transition-opacity cursor-pointer h-32">
                                        <span className="font-bold uppercase text-gray-400">Pagina Vuota</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Character Creation Modal */}
            {showCharModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white border-4 border-black max-w-lg w-full p-0 shadow-neo-lg relative">
                        <div className="bg-neo-violet text-white border-b-2 border-black p-4 flex justify-between items-center">
                            <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                <Plus className="w-5 h-5" /> Nuovo Avventuriero
                            </h2>
                            <button onClick={() => setShowCharModal(false)} className="hover:bg-black hover:text-white p-1 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCharacter} className="p-6 space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-24 h-24 border-2 border-black bg-gray-100 flex-shrink-0 relative group">
                                    {newCharacter.avatar ? (
                                        <img src={newCharacter.avatar} className="w-full h-full object-cover" alt="Avatar" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <UserIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleRandomizeAvatar}
                                        className="absolute bottom-1 right-1 bg-neo-lime border-2 border-black p-1 hover:scale-110 transition-transform shadow-sm"
                                        title="Randomize Avatar"
                                    >
                                        <Dice5 className="w-3 h-3 text-black" />
                                    </button>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-1">Nome</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border-2 border-black p-2 font-bold text-sm focus:outline-none focus:bg-neo-bg focus:shadow-neo transition-all"
                                            value={newCharacter.name}
                                            onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                                            placeholder="Hero Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-1">Giocatore</label>
                                        <input
                                            type="text"
                                            className="w-full border-2 border-black p-2 font-bold text-sm focus:outline-none focus:bg-neo-bg focus:shadow-neo transition-all"
                                            value={newCharacter.player}
                                            onChange={(e) => setNewCharacter({ ...newCharacter, player: e.target.value })}
                                            placeholder="Chi lo gioca?"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase mb-1">Classe</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border-2 border-black p-2 font-bold text-sm focus:outline-none focus:bg-neo-bg focus:shadow-neo transition-all"
                                        value={newCharacter.class}
                                        onChange={(e) => setNewCharacter({ ...newCharacter, class: e.target.value })}
                                        placeholder="Es. Paladino"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase mb-1">Razza</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border-2 border-black p-2 font-bold text-sm focus:outline-none focus:bg-neo-bg focus:shadow-neo transition-all"
                                        value={newCharacter.race}
                                        onChange={(e) => setNewCharacter({ ...newCharacter, race: e.target.value })}
                                        placeholder="Es. Tiefling"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase mb-1">Livello</label>
                                <input
                                    type="number"
                                    min="1" max="20"
                                    required
                                    className="w-full border-2 border-black p-2 font-bold text-sm focus:outline-none focus:bg-neo-bg focus:shadow-neo transition-all"
                                    value={newCharacter.level}
                                    onChange={(e) => setNewCharacter({ ...newCharacter, level: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCharModal(false)}
                                    className="flex-1 bg-white text-black border-2 border-black py-3 font-bold uppercase hover:bg-gray-100 transition-colors"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-black text-white border-2 border-black py-3 font-bold uppercase shadow-neo hover:bg-neo-lime hover:text-black hover:translate-y-1 hover:shadow-none transition-all flex justify-center items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> Crea
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Edit Character Modal */}
            {editingCharacter && (
                <EditCharacterModal
                    character={editingCharacter}
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingCharacter(null);
                    }}
                    onUpdate={handleUpdateCharacter}
                />
            )}
        </div>
    );
};

export default DnDTracker;