import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Notification } from '../types';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const { showToast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const res = await api.get<Notification[]>('/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Show login alert for unread notifications
    useEffect(() => {
        if (user && notifications.length > 0) {
            const unread = notifications.filter(n => !n.read);
            if (unread.length > 0) {
                showToast(`Hai ${unread.length} nuove notifiche!`, 'info');
            }
        }
    }, [user, notifications.length]); // Only trigger on user login or count change

    const markAsRead = async (id: string) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            await api.post(`/notifications/${id}/read`);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            fetchNotifications(); // Revert on error
        }
    };

    const markAllAsRead = async () => {
        // Not implemented in backend yet, but we can loop or add endpoint
        // For now, just mark locally visible ones
        const unread = notifications.filter(n => !n.read);
        await Promise.all(unread.map(n => markAsRead(n.id)));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
