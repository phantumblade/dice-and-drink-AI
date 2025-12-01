import React, { useState } from 'react';
import { X, Save, Shield, Heart, Swords, Scroll, User, Dna, GraduationCap } from 'lucide-react';
import { Character } from '@/types';
import api from '@/services/api';

interface EditCharacterModalProps {
    character: Character;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const EditCharacterModal: React.FC<EditCharacterModalProps> = ({ character, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: character.name,
        race: character.race,
        class: character.class,
        level: character.level,
        hp: character.hp,
        maxHp: character.maxHp,
        background: character.background || '',
        alignment: character.alignment || '',
        stats: typeof character.stats === 'string' ? JSON.parse(character.stats) : character.stats,
        skills: typeof character.skills === 'string' ? JSON.parse(character.skills) : character.skills
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatChange = (stat: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            stats: { ...prev.stats, [stat]: parseInt(value) || 10 }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/characters/${character.id}`, {
                ...formData,
                level: parseInt(formData.level.toString()),
                hp: parseInt(formData.hp.toString()),
                maxHp: parseInt(formData.maxHp.toString())
            });
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Failed to update character:', error);
            alert('Errore durante l\'aggiornamento del personaggio.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border-2 border-neo-violet shadow-neo-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-zinc-900 border-b border-white/10">
                    <h2 className="text-2xl font-black text-white font-display italic">
                        MODIFICA <span className="text-neo-violet">{character.name.toUpperCase()}</span>
                    </h2>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                                <User className="w-4 h-4 text-neo-cyan" /> NOME
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-neo-cyan focus:outline-none text-white font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                                <Dna className="w-4 h-4 text-neo-green" /> RAZZA
                            </label>
                            <input
                                type="text"
                                name="race"
                                value={formData.race}
                                onChange={handleChange}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-neo-green focus:outline-none text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                                <Swords className="w-4 h-4 text-neo-pink" /> CLASSE
                            </label>
                            <input
                                type="text"
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-neo-pink focus:outline-none text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                                <GraduationCap className="w-4 h-4 text-neo-yellow" /> LIVELLO
                            </label>
                            <input
                                type="number"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-neo-yellow focus:outline-none text-white"
                            />
                        </div>
                    </div>

                    {/* Vitals */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                                <Heart className="w-4 h-4 text-red-500" /> HP ATTUALI
                            </label>
                            <input
                                type="number"
                                name="hp"
                                value={formData.hp}
                                onChange={handleChange}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-red-500 focus:outline-none text-white text-center font-mono text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                                <Shield className="w-4 h-4 text-blue-500" /> HP MAX
                            </label>
                            <input
                                type="number"
                                name="maxHp"
                                value={formData.maxHp}
                                onChange={handleChange}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none text-white text-center font-mono text-lg"
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-400">CARATTERISTICHE</label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(formData.stats).map(([stat, value]) => (
                                <div key={stat} className="bg-black/30 p-2 rounded-lg border border-white/5 text-center">
                                    <div className="text-xs text-zinc-500 uppercase font-bold mb-1">{stat}</div>
                                    <input
                                        type="number"
                                        value={value as number}
                                        onChange={(e) => handleStatChange(stat, e.target.value)}
                                        className="w-full bg-transparent text-center text-white font-mono font-bold focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Background & Alignment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                                <Scroll className="w-4 h-4 text-zinc-400" /> BACKGROUND
                            </label>
                            <input
                                type="text"
                                name="background"
                                value={formData.background}
                                onChange={handleChange}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-white focus:outline-none text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-400">ALLINEAMENTO</label>
                            <select
                                name="alignment"
                                value={formData.alignment}
                                onChange={handleChange}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-lg focus:border-white focus:outline-none text-white"
                            >
                                <option value="">Seleziona...</option>
                                <option value="Lawful Good">Lawful Good</option>
                                <option value="Neutral Good">Neutral Good</option>
                                <option value="Chaotic Good">Chaotic Good</option>
                                <option value="Lawful Neutral">Lawful Neutral</option>
                                <option value="True Neutral">True Neutral</option>
                                <option value="Chaotic Neutral">Chaotic Neutral</option>
                                <option value="Lawful Evil">Lawful Evil</option>
                                <option value="Neutral Evil">Neutral Evil</option>
                                <option value="Chaotic Evil">Chaotic Evil</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 font-bold text-zinc-400 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                            ANNULLA
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-bold text-black bg-neo-violet rounded-lg hover:bg-neo-violet-light transition-all shadow-neo hover:shadow-none hover:translate-y-1"
                        >
                            {loading ? 'SALVATAGGIO...' : <><Save className="w-5 h-5" /> SALVA MODIFICHE</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCharacterModal;
