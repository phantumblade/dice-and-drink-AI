import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { Campaign, CampaignRequest } from '../types';
import { useToast } from './ToastContext';

interface CampaignContextType {
    campaigns: Campaign[];
    loading: boolean;
    refreshCampaigns: () => Promise<void>;
    requestJoinCampaign: (campaignId: string, characterId: string, message: string) => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchCampaigns = async () => {
        try {
            const response = await api.get<Campaign[]>('/campaigns');
            setCampaigns(response.data);
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
            showToast('Errore nel caricamento delle campagne', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const requestJoinCampaign = async (campaignId: string, characterId: string, message: string) => {
        try {
            await api.post(`/campaigns/${campaignId}/request`, { characterId, message, userId: 'current-user-id-placeholder' }); // User ID should be handled by backend auth or passed from UserContext
            showToast('Richiesta inviata con successo!', 'success');
            fetchCampaigns();
        } catch (error: any) {
            showToast(error.response?.data?.error || 'Errore nell\'invio della richiesta', 'error');
            throw error;
        }
    };

    return (
        <CampaignContext.Provider value={{ campaigns, loading, refreshCampaigns: fetchCampaigns, requestJoinCampaign }}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaigns = () => {
    const context = useContext(CampaignContext);
    if (context === undefined) {
        throw new Error('useCampaigns must be used within a CampaignProvider');
    }
    return context;
};
