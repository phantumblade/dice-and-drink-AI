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
  updateProfile: (data: Partial<User>) => void;
  addBooking: (booking: Booking) => void;
  registerForTournament: (tournamentId: string) => Promise<void>;
  requestJoinTournament: (tournamentId: string) => void;
  withdrawFromTournament: (tournamentId: string) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  const checkSession = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
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

  const updateProfile = (data: Partial<User>) => {
    // TODO: Implement API update
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const addBooking = (booking: Booking) => {
    // TODO: Implement API booking
    if (user) {
      setUser({ ...user, bookings: [...user.bookings, booking] });
    }
  };

  const registerForTournament = async (tournamentId: string) => {
    if (user) {
      try {
        await api.post(`/tournaments/${tournamentId}/join`, { userId: user.id });
        // Refresh user data to get updated registeredTournaments
        const response = await api.get('/users/me');
        setUser(response.data);
        showToast('Iscrizione al torneo confermata!', 'success');
      } catch (error) {
        console.error("Failed to join tournament", error);
        showToast('Impossibile iscriversi al torneo', 'error');
      }
    }
  };

  const requestJoinTournament = (tournamentId: string) => {
    // TODO: Implement API
    console.log("Request join not implemented yet");
  };

  const withdrawFromTournament = (tournamentId: string) => {
    // TODO: Implement API
    console.log("Withdraw not implemented yet");
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, updateProfile, addBooking, registerForTournament, requestJoinTournament, withdrawFromTournament, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};