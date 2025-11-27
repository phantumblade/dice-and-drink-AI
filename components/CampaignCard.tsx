import React from 'react';
import { Campaign } from '../types';
import { Calendar, User, BookOpen, Clock, Users, Shield, Swords } from 'lucide-react';

interface CampaignCardProps {
    campaign: Campaign;
    onRequestJoin: (campaign: Campaign) => void;
    onViewDetails: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onRequestJoin, onViewDetails }) => {
    return (
        <div className="group relative border-2 border-black bg-amber-50 p-0 shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all flex flex-col md:flex-row overflow-hidden min-h-[280px]">
            {/* Image Section */}
            <div className="w-full md:w-80 h-48 md:h-auto border-b-2 md:border-b-0 md:border-r-2 border-black relative shrink-0 overflow-hidden">
                <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />

                <div className="absolute top-0 left-0 px-3 py-1 text-xs font-black uppercase border-b-2 border-r-2 border-black shadow-sm bg-amber-200 text-amber-900">
                    {campaign.type.replace('_', ' ')}
                </div>

                <div className="absolute bottom-0 right-0 bg-black text-white px-3 py-1 text-xs font-black uppercase border-t-2 border-l-2 border-white shadow-lg flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {campaign.system}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col relative">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={campaign.dm.avatar} alt={campaign.dm.name} className="w-8 h-8 rounded-full border-2 border-black" />
                        <span className="text-xs font-black uppercase text-gray-500">DM: {campaign.dm.name}</span>
                    </div>
                    <h3 className="text-3xl font-serif font-black uppercase leading-none mb-2 text-amber-900 group-hover:text-neo-violet transition-colors">
                        {campaign.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm font-bold text-gray-700">
                        <span className="flex items-center gap-1 bg-amber-100 px-2 py-1 border border-amber-900/20 rounded-sm text-amber-900">
                            <Shield className="w-4 h-4" /> Livello {campaign.levelRange}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 border border-black rounded-sm">
                            <Calendar className="w-4 h-4" /> {campaign.frequency}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 border border-black rounded-sm">
                            <Clock className="w-4 h-4" /> {new Date(campaign.startDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <p className="text-sm font-medium mb-6 line-clamp-3 italic text-amber-800 border-l-4 border-amber-300 pl-4">
                    {campaign.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                    <Users className="w-4 h-4" />
                    <span>{campaign._count?.participants || 0} Giocatori</span>
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t-2 border-dashed border-amber-200">
                    <button
                        onClick={() => onViewDetails(campaign)}
                        className="flex-1 bg-white text-black py-2 font-black uppercase border-2 border-black hover:bg-gray-100 transition-colors text-sm"
                    >
                        Dettagli
                    </button>
                    <button
                        onClick={() => onRequestJoin(campaign)}
                        className="flex-1 bg-black text-white py-2 font-black uppercase border-2 border-black hover:bg-neo-lime hover:text-black transition-all shadow-neo hover:shadow-none hover:translate-y-1 text-sm flex items-center justify-center gap-2"
                    >
                        Unisciti <Swords className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
