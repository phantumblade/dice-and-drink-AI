import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Booking } from '../types';
import api from '../services/api';
import { useToast } from './ToastContext';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  addBooking: (booking: Booking) => Promise<void>;
  registerForTournament: (tournamentId: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  requestJoinTournament: (tournamentId: string) => void;
  withdrawFromTournament: (tournamentId: string) => Promise<boolean>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const refreshUser = async () => {
    const response = await api.get('/users/me');
    setUser(response.data);
  };

  const checkSession = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await refreshUser();
      } catch (error) {
        console.error("Session check failed", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      showToast(`Bentornato, ${user.name}!`, 'success');
      return { success: true };
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login fallito";
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post('/auth/register', data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      showToast(`Benvenuto nel party, ${user.name}!`, 'success');
      return { success: true };
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registrazione fallita";
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    showToast('Logout effettuato con successo', 'info');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return false;

    try {
      const response = await api.patch('/users/me', data);
      setUser(response.data);
      showToast('Profilo aggiornato con successo', 'success');
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || "Impossibile aggiornare il profilo";
      showToast(msg, 'error');
      return false;
    }
  };

  const addBooking = async (booking: Booking) => {
    if (user) {
      try {
        const response = await api.post('/bookings', booking);
        const newBooking = response.data;
        // Refresh user to get full data including relations if needed, or just append
        setUser(prev => prev ? { ...prev, bookings: [newBooking, ...prev.bookings] } : null);
        showToast('Prenotazione confermata!', 'success');
      } catch (error) {
        console.error('Failed to add booking', error);
        showToast('Errore durante la prenotazione', 'error');
        throw error; // Re-throw so the caller knows it failed
      }
    }
  };

  const registerForTournament = async (tournamentId: string): Promise<boolean> => {
    if (user) {
      try {
        await api.post(`/tournaments/${tournamentId}/join`, { userId: user.id });
        await refreshUser();
        return true;
      } catch (error) {
        console.error("Failed to join tournament", error);
        showToast('Impossibile iscriversi al torneo', 'error');
        return false;
      }
    }
    return false;
  };

  const requestJoinTournament = (tournamentId: string) => {
    // TODO: Implement API
    console.log("Request join not implemented yet");
  };

  const withdrawFromTournament = async (tournamentId: string) => {
    if (!user) return false;

    try {
      await api.post(`/tournaments/${tournamentId}/withdraw`);
      await refreshUser();
      showToast('Ti sei ritirato dal torneo', 'info');
      return true;
    } catch (error) {
      console.error("Failed to withdraw from tournament", error);
      showToast('Impossibile ritirarsi dal torneo', 'error');
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, updateProfile, addBooking, registerForTournament, refreshUser, requestJoinTournament, withdrawFromTournament, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
