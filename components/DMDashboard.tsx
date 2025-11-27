import React, { useState, useEffect } from 'react';
import { Campaign, CampaignRequest } from '../types';
import { useUser } from '../contexts/UserContext';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Scroll, Users, Check, X, Clock, Shield } from 'lucide-react';

const DMDashboard: React.FC = () => {
    const { user } = useUser();
    const { showToast } = useToast();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyCampaigns = async () => {
        if (!user) return;
        try {
            // We might need a specific endpoint for "my campaigns" or filter the main list
            // For now, let's assume we can filter the main list or use a specific query
            // Ideally: GET /campaigns?dmId=...
            const res = await api.get<Campaign[]>(`/campaigns`); // This returns all active campaigns. 
            // We should filter client side for now if backend doesn't support filtering by DM
            const myCampaigns = res.data.filter(c => c.dm.id === user.id);
            setCampaigns(myCampaigns);
        } catch (error) {
            console.error(error);
            showToast('Errore nel caricamento delle campagne', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyCampaigns();
    }, [user]);

    const handleRequestAction = async (campaignId: string, requestId: string, action: 'accept' | 'reject') => {
        try {
            // We need an endpoint to handle requests: POST /campaigns/:id/requests/:requestId/:action
            // Or PUT /campaigns/:id/requests/:requestId { status: 'ACCEPTED' }
            // Let's assume the backend has this logic or we need to add it.
            // Wait, I haven't implemented the request handling endpoint in the backend yet!
            // I only implemented POST /campaigns/:id/request (to create request).
            // I need to add logic to accept/reject requests.

            // Placeholder for now:
            console.log(`Action ${action} on request ${requestId} for campaign ${campaignId}`);
            showToast('Funzionalità in arrivo (Backend update required)', 'info');

            // Optimistic update for UI demo
            // fetchMyCampaigns();
        } catch (error) {
            console.error(error);
            showToast('Errore nell\'aggiornamento della richiesta', 'error');
        }
    };

    if (loading) return <div className="p-8 text-center">Caricamento Dashboard DM...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black uppercase text-amber-900 flex items-center gap-2">
                    <Shield className="w-6 h-6" /> Pannello Dungeon Master
                </h2>
                <button className="bg-black text-white px-4 py-2 font-bold uppercase border-2 border-black hover:bg-neo-lime hover:text-black transition-all shadow-neo hover:shadow-none">
                    Nuova Campagna
                </button>
            </div>

            {campaigns.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg">
                    <Scroll className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-black uppercase text-gray-500 mb-2">Nessuna campagna attiva</h3>
                    <p className="text-gray-600 font-medium">Non stai masterando nessuna avventura al momento.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="bg-white border-2 border-black shadow-neo rounded-sm overflow-hidden">
                            <div className="bg-amber-100 p-4 border-b-2 border-black flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black uppercase text-amber-900">{campaign.title}</h3>
                                    <p className="text-xs font-bold text-amber-700 uppercase">{campaign.system} • Livello {campaign.levelRange}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-white px-2 py-1 border border-black text-xs font-bold uppercase flex items-center gap-1">
                                        <Users className="w-3 h-3" /> {campaign._count?.participants || 0} Giocatori
                                    </span>
                                    <span className="bg-white px-2 py-1 border border-black text-xs font-bold uppercase flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {campaign._count?.requests || 0} Richieste
                                    </span>
                                </div>
                            </div>

                            {/* Requests Section */}
                            <div className="p-4">
                                <h4 className="font-bold uppercase text-sm mb-3 text-gray-500">Richieste in Attesa</h4>
                                {campaign.requests && campaign.requests.length > 0 ? (
                                    <div className="space-y-3">
                                        {campaign.requests.filter(r => r.status === 'PENDING').map(req => (
                                            <div key={req.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 border border-gray-200 p-3 rounded gap-3">
                                                <div className="flex items-center gap-3">
                                                    <img src={req.character?.avatar || req.user.avatar} className="w-10 h-10 rounded-full border border-black" alt="" />
                                                    <div>
                                                        <p className="font-bold text-sm">{req.character?.name} <span className="text-gray-500 font-normal">({req.user.name})</span></p>
                                                        <p className="text-xs text-gray-600 italic">"{req.message}"</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 w-full md:w-auto">
                                                    <button
                                                        onClick={() => handleRequestAction(campaign.id, req.id, 'accept')}
                                                        className="flex-1 md:flex-none bg-neo-lime text-black px-3 py-1 border border-black font-bold uppercase text-xs hover:bg-green-400 flex items-center justify-center gap-1"
                                                    >
                                                        <Check className="w-3 h-3" /> Accetta
                                                    </button>
                                                    <button
                                                        onClick={() => handleRequestAction(campaign.id, req.id, 'reject')}
                                                        className="flex-1 md:flex-none bg-red-500 text-white px-3 py-1 border border-black font-bold uppercase text-xs hover:bg-red-600 flex items-center justify-center gap-1"
                                                    >
                                                        <X className="w-3 h-3" /> Rifiuta
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {campaign.requests.filter(r => r.status === 'PENDING').length === 0 && (
                                            <p className="text-sm text-gray-400 italic">Nessuna richiesta in attesa.</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">Nessuna richiesta ricevuta.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DMDashboard;
