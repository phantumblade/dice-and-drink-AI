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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border-4 border-black shadow-neo-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">

                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-neo-lime border-b-4 border-black">
                    <h2 className="text-3xl font-black uppercase flex items-center gap-2">
                        MODIFICA <span className="bg-black text-white px-2">{character.name}</span>
                    </h2>
                    <button onClick={onClose} className="p-2 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors shadow-neo hover:shadow-none">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-black uppercase">
                                <User className="w-4 h-4" /> NOME
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-black font-bold focus:shadow-neo focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-black uppercase">
                                <Dna className="w-4 h-4" /> RAZZA
                            </label>
                            <input
                                type="text"
                                name="race"
                                value={formData.race}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-black font-bold focus:shadow-neo focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-black uppercase">
                                <Swords className="w-4 h-4" /> CLASSE
                            </label>
                            <input
                                type="text"
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-black font-bold focus:shadow-neo focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-black uppercase">
                                <GraduationCap className="w-4 h-4" /> LIVELLO
                            </label>
                            <input
                                type="number"
                                name="level"
                                value={formData.level}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-black font-bold focus:shadow-neo focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Vitals */}
                    <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 border-2 border-black border-dashed">
                        <div className="space-y-2 text-center">
                            <label className="flex items-center justify-center gap-2 text-sm font-black uppercase text-red-600">
                                <Heart className="w-4 h-4" /> HP Attuali
                            </label>
                            <input
                                type="number"
                                name="hp"
                                value={formData.hp}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-black text-center font-black text-2xl focus:shadow-neo focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2 text-center">
                            <label className="flex items-center justify-center gap-2 text-sm font-black uppercase text-blue-600">
                                <Shield className="w-4 h-4" /> HP Max
                            </label>
                            <input
                                type="number"
                                name="maxHp"
                                value={formData.maxHp}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-black text-center font-black text-2xl focus:shadow-neo focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase bg-black text-white px-2 py-1 inline-block">CARATTERISTICHE</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {Object.entries(formData.stats || {}).map(([stat, value]) => (
                                <div key={stat} className="border-2 border-black p-2 text-center hover:bg-neo-yellow transition-colors">
                                    <div className="text-[10px] font-black uppercase mb-1">{stat}</div>
                                    <input
                                        type="number"
                                        value={value as number}
                                        onChange={(e) => handleStatChange(stat, e.target.value)}
                                        className="w-full bg-transparent text-center font-black text-lg focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Background & Alignment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-black uppercase">
                                <Scroll className="w-4 h-4" /> BACKGROUND
                            </label>
                            <input
                                type="text"
                                name="background"
                                value={formData.background}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-black font-bold focus:shadow-neo focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase">ALLINEAMENTO</label>
                            <select
                                name="alignment"
                                value={formData.alignment}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-black font-bold focus:shadow-neo focus:outline-none transition-all bg-white cursor-pointer appearance-none"
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
                    <div className="flex gap-4 pt-6 border-t-4 border-black">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 font-black uppercase bg-white border-2 border-black hover:bg-gray-100 transition-colors"
                        >
                            ANNULLA
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-black uppercase text-white bg-black border-2 border-black hover:bg-neo-violet transition-all shadow-neo hover:shadow-none hover:translate-y-1"
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
