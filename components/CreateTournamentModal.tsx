import React, { useState } from 'react';
import { X, Swords, Calendar, Trophy, Image, FileText, DollarSign, Users } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface CreateTournamentModalProps {
    onClose: () => void;
    onCreated: () => void;
}

const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({ onClose, onCreated }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        type: 'Standard',
        slots: 16,
        entryFee: 0,
        image: '',
        description: '',
        prizes: '',
        rules: '',
        deposit: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tournaments', formData);
            showToast('Torneo creato con successo!', 'success');
            onCreated();
            onClose();
        } catch (error) {
            console.error('Error creating tournament:', error);
            showToast('Errore durante la creazione del torneo', 'error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white border-b-4 border-black z-10 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-neo-lime p-2 border-2 border-black shadow-neo-sm">
                        <Swords className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase italic">Nuovo Torneo</h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Crea un nuovo evento competitivo</p>
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
                        onClick={handleSubmit}
                        className="px-8 py-2 bg-neo-lime border-2 border-black font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
                    >
                        <Swords className="w-4 h-4" /> Pubblica Torneo
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-8 pb-24">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 border-2 border-black shadow-neo">
                            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
                                <FileText className="w-5 h-5" /> Dettagli Principali
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Titolo Torneo</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Es. Torneo Magic: The Gathering - Modern"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-neo-lime/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Descrizione</label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="Descrivi il formato, le regole e cosa aspettarsi..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-medium focus:outline-none focus:ring-4 focus:ring-neo-lime/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 border-2 border-black shadow-neo">
                            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
                                <Trophy className="w-5 h-5" /> Premi e Regole
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Premi (JSON o Testo)</label>
                                    <textarea
                                        rows={4}
                                        placeholder='Es. {"1st": "Box Set", "2nd": "Booster Pack"}'
                                        value={formData.prizes}
                                        onChange={e => setFormData({ ...formData, prizes: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-medium focus:outline-none focus:ring-4 focus:ring-neo-lime/50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Regole Speciali</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Regole aggiuntive o limitazioni..."
                                        value={formData.rules}
                                        onChange={e => setFormData({ ...formData, rules: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-medium focus:outline-none focus:ring-4 focus:ring-neo-lime/50 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings & Media */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 border-2 border-black shadow-neo">
                            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
                                <Calendar className="w-5 h-5" /> Programmazione
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Data e Ora</label>
                                    <input
                                        required
                                        type="datetime-local"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-lime/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Tipo Torneo</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-lime/50 transition-all"
                                    >
                                        <option value="Standard">Standard</option>
                                        <option value="Competitive">Competitivo</option>
                                        <option value="Casual">Casual</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 border-2 border-black shadow-neo">
                            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 border-b-2 border-black pb-2">
                                <Users className="w-5 h-5" /> Partecipazione
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Posti Disponibili</label>
                                    <input
                                        required
                                        type="number"
                                        min="2"
                                        value={formData.slots}
                                        onChange={e => setFormData({ ...formData, slots: parseInt(e.target.value) })}
                                        className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-lime/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Costo Iscrizione (€)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={formData.entryFee}
                                            onChange={e => setFormData({ ...formData, entryFee: parseFloat(e.target.value) })}
                                            className="w-full pl-10 border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-lime/50 transition-all"
                                        />
                                    </div>
                                    <p className="text-xs font-bold text-gray-500 mt-1 text-right">
                                        {formData.entryFee === 0 ? "GRATIS" : `€ ${formData.entryFee.toFixed(2)}`}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Deposito / Mora (€)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={formData.deposit}
                                            onChange={e => setFormData({ ...formData, deposit: parseFloat(e.target.value) })}
                                            className="w-full pl-10 border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-lime/50 transition-all"
                                        />
                                    </div>
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
                                    className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-neo-lime/50 transition-all mb-3"
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

export default CreateTournamentModal;
