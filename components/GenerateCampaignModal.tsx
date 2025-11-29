import React, { useState } from 'react';
import { X, Sparkles, Scroll, Users, Calendar, Image, FileText } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface GenerateCampaignModalProps {
    onClose: () => void;
    onGenerated: () => void;
}

const GenerateCampaignModal: React.FC<GenerateCampaignModalProps> = ({ onClose, onGenerated }) => {
    const { showToast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        system: 'D&D 5e',
        type: 'SHORT_CAMPAIGN',
        levelRange: '1-5',
        prompt: '',
        frequency: 'Weekly',
        startDate: '',
        image: '',
        maxPlayers: 4,
        platform: 'In Person',
        sessionDuration: '3-4 hours',
        tags: '',
        deposit: 0
    });

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            // Simulate AI generation delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            const campaignData = {
                ...formData,
                description: `Campagna generata basata su: ${formData.prompt}. Un'avventura epica attende gli eroi in un mondo di mistero e pericolo.`,
                status: 'RECRUITING',
                dmId: 'admin-id', // In a real app, this would be the current user's ID
                tags: JSON.stringify(formData.tags.split(',').map(t => t.trim()).filter(t => t))
            };

            await api.post('/campaigns', campaignData);
            showToast('Campagna generata con successo!', 'success');
            onGenerated();
            onClose();
        } catch (error) {
            console.error('Error generating campaign:', error);
            showToast('Errore durante la generazione della campagna', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white border-b-4 border-black z-10 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 border-2 border-black shadow-neo-sm">
                        <Sparkles className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase italic">Genera Campagna AI</h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Crea una nuova avventura con l'AI</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 font-bold uppercase border-2 border-transparent hover:bg-gray-100 transition-colors"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="px-8 py-2 bg-purple-500 text-white border-2 border-black font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Sparkles className="w-4 h-4 animate-spin" /> Generando...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> Genera Avventura
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-8 pb-24">
                <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 border-2 border-black shadow-neo">
                            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
                                <Scroll className="w-5 h-5" /> Concept & Prompt
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Titolo Campagna</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Es. Le Ombre di Waterdeep"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Prompt per l'AI</label>
                                    <textarea
                                        required
                                        rows={8}
                                        placeholder="Descrivi l'ambientazione, il tono e i temi principali. Es: Un mondo steampunk dove la magia è proibita..."
                                        value={formData.prompt}
                                        onChange={e => setFormData({ ...formData, prompt: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-medium focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Tags (separati da virgola)</label>
                                    <input
                                        type="text"
                                        placeholder="Es. Roleplay, Horror, Investigativo"
                                        value={formData.tags}
                                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 border-2 border-black shadow-neo">
                            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
                                <Users className="w-5 h-5" /> Dettagli Sistema
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Sistema di Gioco</label>
                                    <select
                                        value={formData.system}
                                        onChange={e => setFormData({ ...formData, system: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    >
                                        <option value="D&D 5e">D&D 5e</option>
                                        <option value="Pathfinder 2e">Pathfinder 2e</option>
                                        <option value="Call of Cthulhu">Call of Cthulhu</option>
                                        <option value="Cyberpunk RED">Cyberpunk RED</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Livello Personaggi</label>
                                    <input
                                        type="text"
                                        placeholder="Es. 1-5"
                                        value={formData.levelRange}
                                        onChange={e => setFormData({ ...formData, levelRange: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Max Giocatori</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.maxPlayers}
                                        onChange={e => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Piattaforma</label>
                                    <select
                                        value={formData.platform}
                                        onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    >
                                        <option value="In Person">Dal Vivo</option>
                                        <option value="Roll20">Roll20</option>
                                        <option value="Foundry VTT">Foundry VTT</option>
                                        <option value="Discord">Discord</option>
                                        <option value="Fantasy Grounds">Fantasy Grounds</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings & Media */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 border-2 border-black shadow-neo">
                            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
                                <Calendar className="w-5 h-5" /> Logistica
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Data Inizio</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Frequenza</label>
                                    <select
                                        value={formData.frequency}
                                        onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    >
                                        <option value="Weekly">Settimanale</option>
                                        <option value="Bi-weekly">Bi-settimanale</option>
                                        <option value="Monthly">Mensile</option>
                                        <option value="One-time">One-shot</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Durata Sessione</label>
                                    <input
                                        type="text"
                                        placeholder="Es. 3-4 ore"
                                        value={formData.sessionDuration}
                                        onChange={e => setFormData({ ...formData, sessionDuration: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Tipo Campagna</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    >
                                        <option value="ONE_SHOT">One Shot</option>
                                        <option value="SHORT_CAMPAIGN">Campagna Breve</option>
                                        <option value="LONG_CAMPAIGN">Campagna Lunga</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Deposito / Mora (€)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.50"
                                        value={formData.deposit}
                                        onChange={e => setFormData({ ...formData, deposit: parseFloat(e.target.value) })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 border-2 border-black shadow-neo">
                            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
                                <Image className="w-5 h-5" /> Media
                            </h3>

                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">URL Copertina</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all mb-3"
                                />
                                <div className="aspect-video w-full border-2 border-black bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400 font-bold uppercase text-xs">Nessuna Immagine</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenerateCampaignModal;
