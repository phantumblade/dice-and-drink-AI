import React, { useState } from 'react';
import { X, Shield, Heart, Zap, Backpack, Skull, Scroll, Edit2, Save, Circle, Square } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface CharacterSheetModalProps {
    character: any;
    onClose: () => void;
}

const CharacterSheetModal: React.FC<CharacterSheetModalProps> = ({ character, onClose }) => {
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editedCharacter, setEditedCharacter] = useState(character);

    if (!character) return null;

    const stats = JSON.parse(character.stats || '{}');
    const skills = JSON.parse(character.skills || '{}');
    const inventory = JSON.parse(character.inventory || '[]');

    // Determine resources based on class (simplified logic)
    const getResources = () => {
        const c = character.class.toLowerCase();
        if (c.includes('barbarian')) return { name: 'Ira', max: 2 + Math.floor(character.level / 4) };
        if (c.includes('monk')) return { name: 'Ki', max: character.level };
        if (c.includes('sorcerer')) return { name: 'Stregoneria', max: character.level };
        if (c.includes('paladin')) return { name: 'Imposizione', max: character.level * 5 };
        return null;
    };

    const resources = getResources();
    const isOwner = user?.id === character.userId;

    const handleSave = () => {
        // Here you would call an API to update the character
        console.log('Saving character:', editedCharacter);
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-black shadow-neo relative animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-black text-white p-6 sticky top-0 z-10 flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 border-4 border-white rounded-full overflow-hidden bg-gray-800 shadow-lg relative group">
                            <img src={editedCharacter.avatar} alt={editedCharacter.name} className="w-full h-full object-cover" />
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                                    <Edit2 className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </div>
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedCharacter.name}
                                    onChange={(e) => setEditedCharacter({ ...editedCharacter, name: e.target.value })}
                                    className="text-4xl font-black uppercase italic leading-none mb-1 bg-gray-800 text-white border-b border-white focus:outline-none w-full"
                                />
                            ) : (
                                <h2 className="text-4xl font-black uppercase italic leading-none mb-1">{editedCharacter.name}</h2>
                            )}

                            <p className="text-lg font-bold text-gray-300 uppercase tracking-wider">
                                {character.race} {character.class} • Livello {character.level}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-white text-black px-2 py-0.5 text-xs font-black uppercase">{character.alignment}</span>
                                <span className="bg-white text-black px-2 py-0.5 text-xs font-black uppercase">{character.background}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isOwner && !isEditing && (
                            <button onClick={() => setIsEditing(true)} className="text-white hover:text-gray-300 transition-colors p-2">
                                <Edit2 className="w-6 h-6" />
                            </button>
                        )}
                        {isEditing && (
                            <button onClick={handleSave} className="text-green-400 hover:text-green-300 transition-colors p-2">
                                <Save className="w-6 h-6" />
                            </button>
                        )}
                        <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors p-2">
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Col: Stats & Combat */}
                    <div className="space-y-6">
                        {/* Action Economy */}
                        <div className="bg-white border-2 border-black p-4 shadow-sm">
                            <h3 className="font-black uppercase text-sm mb-3 border-b-2 border-black pb-1">Economia Azioni</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase">Azione</span>
                                    <div className="flex gap-1">
                                        <div className="w-4 h-4 bg-green-500 border border-black shadow-sm"></div>
                                        {character.class.toLowerCase().includes('fighter') && character.level >= 2 && (
                                            <div className="w-4 h-4 bg-green-500/30 border border-black border-dashed" title="Azione Impetuosa"></div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase">Azione Bonus</span>
                                    <div className="flex gap-1">
                                        <div className="w-4 h-4 bg-orange-500 rounded-full border border-black shadow-sm"></div>
                                        {character.class.toLowerCase().includes('rogue') && (
                                            <div className="w-4 h-4 bg-orange-500/30 rounded-full border border-black border-dashed" title="Azione Scaltra"></div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase">Reazione</span>
                                    <div className="w-4 h-4 bg-blue-500 rotate-45 border border-black shadow-sm"></div>
                                </div>
                            </div>
                        </div>

                        {/* Resources */}
                        {resources && (
                            <div className="bg-gray-50 border-2 border-black p-4">
                                <h3 className="font-black uppercase text-sm mb-3 border-b-2 border-black pb-1 flex justify-between">
                                    {resources.name}
                                    <span className="text-xs bg-black text-white px-1.5 rounded">{resources.max}</span>
                                </h3>
                                <div className="flex flex-wrap gap-1">
                                    {Array.from({ length: resources.max }).map((_, i) => (
                                        <div key={i} className="w-3 h-3 bg-purple-600 border border-black rounded-sm"></div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-red-50 border-2 border-black p-3">
                                <Heart className="w-6 h-6 mx-auto text-red-500 mb-1" />
                                <div className="text-2xl font-black">{character.hp}</div>
                                <div className="text-xs font-bold uppercase text-gray-500">HP Max</div>
                            </div>
                            <div className="bg-blue-50 border-2 border-black p-3">
                                <Shield className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                                <div className="text-2xl font-black">{10 + (Math.floor(((stats.dex || 10) - 10) / 2))}</div>
                                <div className="text-xs font-bold uppercase text-gray-500">CA</div>
                            </div>
                            <div className="bg-yellow-50 border-2 border-black p-3">
                                <Zap className="w-6 h-6 mx-auto text-yellow-600 mb-1" />
                                <div className="text-2xl font-black">+{Math.floor(((stats.dex || 10) - 10) / 2)}</div>
                                <div className="text-xs font-bold uppercase text-gray-500">Init</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 border-2 border-black p-6">
                            <h3 className="font-black uppercase text-xl mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                                <Skull className="w-5 h-5" /> Caratteristiche
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(stats).map(([key, value]: [string, any]) => (
                                    <div key={key} className="flex justify-between items-center bg-white p-2 border border-black">
                                        <span className="font-black uppercase text-sm">{key}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold">{value}</span>
                                            <span className="bg-black text-white text-xs px-1 font-bold rounded">
                                                {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Center Col: Skills & Bio */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border-2 border-black p-6">
                            <h3 className="font-black uppercase text-xl mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                                <Scroll className="w-5 h-5" /> Abilità & Competenze
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(skills).map(([key, value]: [string, any]) => (
                                    <div key={key} className="bg-gray-100 border border-black px-3 py-1 flex items-center gap-2">
                                        <span className="font-bold text-sm uppercase">{key}</span>
                                        <span className="bg-purple-500 text-white text-xs px-1.5 font-black rounded-full">{value}</span>
                                    </div>
                                ))}
                                {Object.keys(skills).length === 0 && <span className="text-gray-400 italic">Nessuna abilità registrata</span>}
                            </div>
                        </div>

                        <div className="bg-white border-2 border-black p-6">
                            <h3 className="font-black uppercase text-xl mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                                <Backpack className="w-5 h-5" /> Inventario
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {inventory.map((item: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 p-2 hover:bg-gray-50 border-b border-gray-100">
                                        <div className="w-2 h-2 bg-black rounded-full" />
                                        <span className="font-medium">{item}</span>
                                    </li>
                                ))}
                                {inventory.length === 0 && <span className="text-gray-400 italic">Inventario vuoto</span>}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Campaign History Section */}
                <div className="p-8 pt-0">
                    <div className="bg-white border-2 border-black p-6 shadow-sm">
                        <h3 className="font-black uppercase text-xl mb-4 border-b-2 border-black pb-2 flex items-center gap-2">
                            <Scroll className="w-5 h-5" /> Storico Campagne
                        </h3>

                        {(!user?.campaignsJoined || user.campaignsJoined.filter((cj: any) => cj.character.id === character.id).length === 0) ? (
                            <div className="text-center py-8 text-gray-500 italic">
                                Questo personaggio non ha ancora partecipato a nessuna campagna.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.campaignsJoined
                                    .filter((cj: any) => cj.character.id === character.id)
                                    .map((cj: any) => (
                                        <div key={cj.campaign.id} className="flex items-center gap-4 p-3 border border-gray-200 bg-gray-50 hover:bg-white hover:border-black transition-all">
                                            <img src={cj.campaign.image} alt={cj.campaign.title} className="w-16 h-16 object-cover border border-black" />
                                            <div className="flex-1">
                                                <h4 className="font-black uppercase text-sm">{cj.campaign.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${cj.campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-200' :
                                                            cj.campaign.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                                'bg-gray-100 text-gray-600 border-gray-200'
                                                        }`}>
                                                        {cj.campaign.status === 'ACTIVE' ? 'In Corso' :
                                                            cj.campaign.status === 'COMPLETED' ? 'Completata' : cj.campaign.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterSheetModal;
