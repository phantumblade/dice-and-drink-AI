import React from 'react';
import { User, Shield, Heart, Scroll } from 'lucide-react';

interface CharacterCardProps {
    character: any;
    onClick: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
    const stats = JSON.parse(character.stats || '{}');

    const getClassColor = (className: string) => {
        const c = className.toLowerCase();
        if (c.includes('barbarian') || c.includes('fighter')) return 'border-red-500';
        if (c.includes('wizard') || c.includes('sorcerer') || c.includes('warlock')) return 'border-blue-500';
        if (c.includes('rogue') || c.includes('monk') || c.includes('ranger')) return 'border-green-500';
        if (c.includes('cleric') || c.includes('paladin')) return 'border-yellow-500';
        if (c.includes('bard') || c.includes('druid')) return 'border-purple-500';
        return 'border-black';
    };

    const borderColor = getClassColor(character.class);

    return (
        <div
            onClick={onClick}
            className={`bg-white border-2 ${borderColor} shadow-neo p-4 cursor-pointer hover:-translate-y-1 hover:shadow-none transition-all group relative overflow-hidden`}
        >
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-100 to-transparent -mr-8 -mt-8 rounded-full opacity-50 group-hover:scale-150 transition-transform`} />

            <div className="flex items-center gap-4 mb-3 relative z-10">
                <div className={`w-12 h-12 border-2 ${borderColor} rounded-full overflow-hidden bg-gray-100`}>
                    <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h4 className="font-black uppercase text-lg leading-none group-hover:text-purple-600 transition-colors">{character.name}</h4>
                    <p className="text-xs font-bold text-gray-500 uppercase">{character.race} {character.class} • Lvl {character.level}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                <div className="bg-red-50 border border-black p-1">
                    <Heart className="w-4 h-4 mx-auto text-red-500 mb-1" />
                    <span className="text-xs font-black">{character.hp}/{character.maxHp}</span>
                </div>
                <div className="bg-blue-50 border border-black p-1">
                    <Shield className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                    <span className="text-xs font-black">AC {10 + (Math.floor(((stats.dex || 10) - 10) / 2))}</span>
                </div>
                <div className="bg-yellow-50 border border-black p-1">
                    <Scroll className="w-4 h-4 mx-auto text-yellow-600 mb-1" />
                    <span className="text-xs font-black">Stats</span>
                </div>
            </div>
        </div>
    );
};

export default CharacterCard;
