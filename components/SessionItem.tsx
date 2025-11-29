import React, { useState } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronUp, Sword, Gem, ScrollText } from 'lucide-react';

interface SessionItemProps {
    session: any;
}

const SessionItem: React.FC<SessionItemProps> = ({ session }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white border-2 border-black shadow-neo mb-4 overflow-hidden">
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-black text-white p-2 font-black text-center min-w-[60px]">
                        <div className="text-xs uppercase">{new Date(session.date).toLocaleString('default', { month: 'short' })}</div>
                        <div className="text-xl leading-none">{new Date(session.date).getDate()}</div>
                    </div>
                    <div>
                        <h4 className="font-black uppercase text-lg">{session.title}</h4>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                            <MapPin className="w-3 h-3" /> {session.location}
                        </div>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            {isExpanded && (
                <div className="p-4 pt-0 border-t-2 border-gray-100 bg-gray-50">
                    <p className="font-medium text-gray-700 mb-4 italic">"{session.summary}"</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {session.enemies && (
                            <div className="bg-white border border-black p-3">
                                <h5 className="font-black uppercase text-xs mb-2 flex items-center gap-2 text-red-600">
                                    <Sword className="w-3 h-3" /> Nemici Sconfitti
                                </h5>
                                <p className="text-sm">{session.enemies}</p>
                            </div>
                        )}
                        {session.loot && (
                            <div className="bg-white border border-black p-3">
                                <h5 className="font-black uppercase text-xs mb-2 flex items-center gap-2 text-yellow-600">
                                    <Gem className="w-3 h-3" /> Bottino
                                </h5>
                                <p className="text-sm">{session.loot}</p>
                            </div>
                        )}
                        {session.quests && (
                            <div className="bg-white border border-black p-3">
                                <h5 className="font-black uppercase text-xs mb-2 flex items-center gap-2 text-blue-600">
                                    <ScrollText className="w-3 h-3" /> Quest
                                </h5>
                                <p className="text-sm">{session.quests}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionItem;
