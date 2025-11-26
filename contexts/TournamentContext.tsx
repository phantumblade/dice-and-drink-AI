import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tournament } from '../types';
import api from '../services/api';

interface TournamentContextType {
    tournaments: Tournament[];
    loading: boolean;
    refreshTournaments: () => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTournaments = async () => {
        try {
            const response = await api.get('/tournaments');
            if (Array.isArray(response.data)) {
                setTournaments(response.data);
            } else {
                console.error("API returned non-array for tournaments:", response.data);
                setTournaments([]);
            }
        } catch (error) {
            console.error("Failed to fetch tournaments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    const refreshTournaments = () => {
        fetchTournaments();
    };

    return (
        <TournamentContext.Provider value={{ tournaments, loading, refreshTournaments }}>
            {children}
        </TournamentContext.Provider>
    );
};

export const useTournaments = () => {
    const context = useContext(TournamentContext);
    if (!context) throw new Error('useTournaments must be used within a TournamentProvider');
    return context;
};
