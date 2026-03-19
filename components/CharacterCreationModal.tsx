import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { X, Dices, Save } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface CharacterCreationModalProps {
    onClose: () => void;
    onCreated: () => void;
}

const RACES = ['Umano', 'Elfo', 'Nano', 'Halfling', 'Orco', 'Tiefling', 'Dragonborn', 'Gnomo'];
const CLASSES = ['Guerriero', 'Mago', 'Ladro', 'Chierico', 'Ranger', 'Paladino', 'Barbaro', 'Bardo', 'Druido', 'Monaco', 'Stregone', 'Warlock'];
const BACKGROUNDS = ['Accolito', 'Criminale', 'Eroe Popolare', 'Nobile', 'Saggio', 'Soldato', 'Monello'];
const ALIGNMENTS = ['Legale Buono', 'Neutrale Buono', 'Caotico Buono', 'Legale Neutrale', 'Neutrale Puro', 'Caotico Neutrale', 'Legale Malvagio', 'Neutrale Malvagio', 'Caotico Malvagio'];

const CharacterCreationModal: React.FC<CharacterCreationModalProps> = ({ onClose, onCreated }) => {
    const { user } = useUser();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        race: RACES[0],
        class: CLASSES[0],
        background: BACKGROUNDS[0],
        alignment: ALIGNMENTS[4],
        level: 1,
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
    });

    const handleStatChange = (stat: string, value: number) => {
        setFormData(prev => ({
            ...prev,
            stats: { ...prev.stats, [stat]: Math.max(1, Math.min(20, value)) }
        }));
    };

    const rollStats = () => {
        const newStats = {
            str: Math.floor(Math.random() * 13) + 6, // 6-18
            dex: Math.floor(Math.random() * 13) + 6,
            con: Math.floor(Math.random() * 13) + 6,
            int: Math.floor(Math.random() * 13) + 6,
            wis: Math.floor(Math.random() * 13) + 6,
            cha: Math.floor(Math.random() * 13) + 6,
        };
        setFormData(prev => ({ ...prev, stats: newStats }));
        showToast('Statistiche tirate con successo!', 'info');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await api.post('/characters', {
                userId: user.id,
                ...formData,
                skills: {} // Empty skills for now, can be expanded
            });
            showToast('Personaggio creato con successo!', 'success');
            onCreated();
            onClose();
        } catch (error) {
            console.error(error);
            showToast('Errore nella creazione del personaggio', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-modal-shell animate-in fade-in duration-200">
            <div className="app-modal-panel relative max-w-2xl animate-in slide-in-from-bottom-6 md:zoom-in md:slide-in-from-bottom-0 duration-200">
                <div className="app-modal-header bg-neo-pink p-4 md:p-5 border-b-2 border-black flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase text-white flex items-center gap-2">
                        <Dices className="w-6 h-6" /> Crea Nuovo Personaggio
                    </h2>
                    <button onClick={onClose} className="hover:bg-black hover:text-white p-1 rounded transition-colors border-2 border-transparent hover:border-white"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="app-modal-body p-5 md:p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-bold uppercase mb-2 text-xs">Nome Personaggio</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border-2 border-black p-3 font-bold focus:shadow-neo focus:outline-none"
                                placeholder="Es. Gandalf il Grigio"
                            />
                        </div>
                        <div>
                            <label className="block font-bold uppercase mb-2 text-xs">Razza</label>
                            <select
                                value={formData.race}
                                onChange={e => setFormData({ ...formData, race: e.target.value })}
                                className="w-full border-2 border-black p-3 font-bold focus:shadow-neo focus:outline-none bg-white"
                            >
                                {RACES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold uppercase mb-2 text-xs">Classe</label>
                            <select
                                value={formData.class}
                                onChange={e => setFormData({ ...formData, class: e.target.value })}
                                className="w-full border-2 border-black p-3 font-bold focus:shadow-neo focus:outline-none bg-white"
                            >
                                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold uppercase mb-2 text-xs">Background</label>
                            <select
                                value={formData.background}
                                onChange={e => setFormData({ ...formData, background: e.target.value })}
                                className="w-full border-2 border-black p-3 font-bold focus:shadow-neo focus:outline-none bg-white"
                            >
                                {BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold uppercase mb-2 text-xs">Allineamento</label>
                            <select
                                value={formData.alignment}
                                onChange={e => setFormData({ ...formData, alignment: e.target.value })}
                                className="w-full border-2 border-black p-3 font-bold focus:shadow-neo focus:outline-none bg-white"
                            >
                                {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold uppercase mb-2 text-xs">Livello Iniziale</label>
                            <input
                                type="number"
                                min="1" max="20"
                                value={formData.level}
                                onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) })}
                                className="w-full border-2 border-black p-3 font-bold focus:shadow-neo focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-300 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black uppercase text-lg">Caratteristiche</h3>
                            <button
                                type="button"
                                onClick={rollStats}
                                className="text-xs font-bold uppercase bg-black text-white px-3 py-1 hover:bg-neo-yellow hover:text-black transition-colors flex items-center gap-1"
                            >
                                <Dices className="w-4 h-4" /> Tira Dadi
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            {Object.entries(formData.stats).map(([stat, val]) => (
                                <div key={stat} className="text-center">
                                    <label className="block text-[10px] font-black uppercase mb-1 text-gray-500">{stat}</label>
                                    <input
                                        type="number"
                                        value={val}
                                        onChange={e => handleStatChange(stat, parseInt(e.target.value))}
                                        className="w-full border-2 border-black p-2 text-center font-bold text-lg focus:shadow-neo focus:outline-none"
                                    />
                                    <div className="text-xs font-bold mt-1 text-gray-400">
                                        {Math.floor(((val as number) - 10) / 2) > 0 ? '+' : ''}{Math.floor(((val as number) - 10) / 2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="app-modal-footer pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-neo-lime text-black py-4 font-black uppercase border-2 border-black hover:bg-neo-green transition-all shadow-neo hover:shadow-none hover:translate-y-1 text-xl flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creazione...' : <><Save className="w-6 h-6" /> Salva Personaggio</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CharacterCreationModal;
