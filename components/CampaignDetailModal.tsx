import React from 'react';
import { Campaign } from '../types';
import { X, Calendar, Users, Clock, BookOpen, Shield, Swords } from 'lucide-react';

interface CampaignDetailModalProps {
    campaign: Campaign;
    onClose: () => void;
    onRequestJoin: () => void;
}

const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({ campaign, onClose, onRequestJoin }) => {
    return (
        <div className="fixed inset-0 z-50 md:flex md:items-center md:justify-center md:p-4 bg-white md:bg-black/60 md:backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-amber-50 w-full h-full md:h-auto md:border-4 border-black md:shadow-neo-lg max-w-4xl md:w-full relative md:max-h-[90vh] overflow-y-auto">
                {/* Header Image */}
                <div className="h-48 md:h-64 relative border-b-4 border-black">
                    <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <div>
                            <span className="bg-neo-cyan text-black px-2 py-1 font-black uppercase text-xs border border-black shadow-sm mb-2 inline-block">
                                {campaign.system}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-serif font-black uppercase text-white leading-none shadow-black drop-shadow-lg">
                                {campaign.title}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white text-black p-2 border-2 border-black hover:bg-black hover:text-white transition-colors shadow-neo"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Info */}
                        <div className="w-full md:w-1/3 space-y-6">
                            <div className="bg-white border-2 border-black p-4 shadow-neo">
                                <h3 className="font-bold uppercase text-xs text-gray-500 mb-3 border-b border-gray-200 pb-1">Dungeon Master</h3>
                                <div className="flex items-center gap-3">
                                    <img src={campaign.dm.avatar} alt={campaign.dm.name} className="w-12 h-12 rounded-full border-2 border-black" />
                                    <div>
                                        <p className="font-black text-lg leading-none">{campaign.dm.name}</p>
                                        <p className="text-xs text-gray-600">Game Master</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border-2 border-black p-4 shadow-neo space-y-3">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-500">Livelli</p>
                                        <p className="font-black">{campaign.levelRange}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-500">Frequenza</p>
                                        <p className="font-black">{campaign.frequency}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-500">Inizio</p>
                                        <p className="font-black">{new Date(campaign.startDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-amber-600" />
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-500">Giocatori</p>
                                        <p className="font-black">{campaign._count?.participants || 0} / {campaign.maxPlayers}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="prose prose-amber max-w-none">
                                <h3 className="font-serif font-black uppercase text-2xl text-amber-900 mb-4 flex items-center gap-2">
                                    <BookOpen className="w-6 h-6" /> La Storia
                                </h3>
                                <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap font-serif">
                                    {campaign.description}
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t-2 border-dashed border-amber-800/30">
                                <button
                                    onClick={onRequestJoin}
                                    className="w-full bg-black text-white py-4 font-black uppercase border-2 border-black hover:bg-neo-lime hover:text-black transition-all shadow-neo hover:shadow-none hover:translate-y-1 text-xl flex items-center justify-center gap-3"
                                >
                                    Unisciti all'Avventura <Swords className="w-6 h-6" />
                                </button>
                                <p className="text-center text-xs font-bold uppercase text-gray-500 mt-2">
                                    Richiede approvazione del Dungeon Master
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetailModal;
