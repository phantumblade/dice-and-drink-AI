import React from 'react';
import { Character } from '../types';
import { Shield, Heart, Zap, Skull } from 'lucide-react';

interface CharacterCardProps {
    character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
    const stats = typeof character.stats === 'string' ? JSON.parse(character.stats) : character.stats;

    return (
        <div className="bg-white border-2 border-black p-4 shadow-neo hover:-translate-y-1 transition-transform relative overflow-hidden group">
            {character.status === 'DEAD' && (
                <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-4 py-2 font-black uppercase border-2 border-white transform -rotate-12 flex items-center gap-2">
                        <Skull className="w-6 h-6" /> Deceduto
                    </div>
                </div>
            )}

            <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 border-2 border-black shrink-0 bg-gray-200">
                    <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-black uppercase text-lg leading-none mb-1">{character.name}</h3>
                    <p className="text-sm font-bold text-gray-600">{character.race} {character.class}</p>
                    <p className="text-xs text-gray-500 uppercase">Livello {character.level} • {character.background}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-black px-2 py-0.5 bg-neo-pink text-white border border-black shadow-sm">
                            HP {character.hp}/{character.maxHp}
                        </span>
                        <span className="text-xs font-black px-2 py-0.5 bg-neo-cyan text-black border border-black shadow-sm">
                            AC {10 + Math.floor(((stats?.dex || 10) - 10) / 2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-6 gap-1 text-center border-t-2 border-black pt-2">
                {Object.entries(stats || {}).map(([key, val]: [string, any]) => (
                    <div key={key} className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase text-gray-400">{key.slice(0, 3)}</span>
                        <span className="font-bold text-sm">{val}</span>
                        <span className="text-[10px] text-gray-500 font-bold">
                            {Math.floor((val - 10) / 2) > 0 ? '+' : ''}{Math.floor((val - 10) / 2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CharacterCard;
