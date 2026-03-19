import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Dice5, LogOut, ShieldAlert, User as UserIcon, UserPlus, Bell, Check } from 'lucide-react';
import { UserRole } from '../types';
import { useUser } from '../contexts/UserContext';
import { useNotifications } from '../contexts/NotificationContext';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, children }: { to: string; children?: React.ReactNode }) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-transparent transition-all ${isActive(to)
        ? 'bg-neo-violet text-white border-black shadow-neo -translate-y-1'
        : 'text-black hover:bg-neo-lime hover:border-black hover:shadow-neo hover:-translate-y-1'
        }`}
    >
      {children}
    </Link>
  );

  useEffect(() => {
    setIsOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOpenAuthModal = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: 'register' | 'login' }>).detail;

      setAuthMode(detail?.mode === 'login' ? 'login' : 'register');
      setIsOpen(false);
      setShowNotifications(false);
      setIsAuthOpen(true);
    };

    window.addEventListener('open-auth-modal', handleOpenAuthModal);

    return () => {
      window.removeEventListener('open-auth-modal', handleOpenAuthModal);
    };
  }, []);

  return (
    <>
      <nav className="bg-white border-b-2 border-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3 group">
              <div className="bg-neo-pink border-2 border-black p-1 shadow-neo-sm group-hover:rotate-12 transition-transform">
                <Dice5 className="h-8 w-8 text-white" />
              </div>
              <Link to="/" className="text-2xl font-black italic tracking-tighter text-black group-hover:text-neo-violet transition-colors">
                DICE & DRINK
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                <NavItem to="/catalog">Catalogo</NavItem>
                <NavItem to="/tournaments">Tornei</NavItem>
                {user && <NavItem to="/dnd">D&D Tracker</NavItem>}
                <NavItem to="/booking">Prenotazioni</NavItem>
                <NavItem to="/about">Chi Siamo</NavItem>
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-4">
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 hover:bg-neo-bg border-2 border-transparent hover:border-black transition-all"
                    >
                      <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-neo-violet animate-pulse' : 'text-gray-600'}`} />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-black">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-black shadow-neo z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-3 border-b-2 border-black bg-neo-bg flex justify-between items-center">
                          <span className="font-black uppercase text-sm">Notifiche</span>
                          {unreadCount > 0 && <span className="text-xs font-bold text-neo-violet">{unreadCount} nuove</span>}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm italic">Nessuna notifica</div>
                          ) : (
                            notifications.map(n => (
                              <div key={n.id} className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                                <div className="flex gap-3">
                                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-neo-violet' : 'bg-gray-300'}`} />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium leading-tight mb-1">{n.message}</p>
                                    <p className="text-[10px] text-gray-400 uppercase">{new Date(n.createdAt).toLocaleDateString()}</p>
                                  </div>
                                  {!n.read && (
                                    <button onClick={() => markAsRead(n.id)} className="text-gray-400 hover:text-neo-green" title="Segna come letto">
                                      <Check className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link to="/profile" className="flex items-center gap-2 text-sm font-bold border-2 border-black px-3 py-1 bg-neo-bg shadow-neo-sm hover:bg-neo-yellow transition-colors">
                    {user.role === UserRole.ADMIN && <ShieldAlert className="w-4 h-4 text-neo-pink" />}
                    <UserIcon className="w-4 h-4" />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 border-2 border-black bg-white hover:bg-neo-pink hover:text-white shadow-neo hover:shadow-neo-hover transition-all active:translate-y-1 active:shadow-none"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthOpen(true);
                  }}
                  className="group relative flex items-center justify-center p-2 border-2 border-black bg-white shadow-neo hover:shadow-neo-hover hover:translate-y-0.5 transition-all"
                  title="Accedi o Registrati"
                >
                  <UserIcon className="w-6 h-6" />
                  <div className="absolute -top-1 -right-1 bg-neo-lime border border-black rounded-full w-4 h-4 flex items-center justify-center">
                    <UserPlus className="w-3 h-3 text-black" />
                  </div>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-none border-2 border-black text-black hover:bg-neo-yellow focus:outline-none shadow-neo"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-b-2 border-black">
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 flex flex-col">
              <NavItem to="/catalog">Catalogo</NavItem>
              <NavItem to="/tournaments">Tornei</NavItem>
              {user && <NavItem to="/dnd">D&D Tracker</NavItem>}
              <NavItem to="/booking">Prenotazioni</NavItem>
              <NavItem to="/about">Chi Siamo</NavItem>
              {user && <NavItem to="/profile">Profilo</NavItem>}
              <div className="pt-4 pb-2 border-t-2 border-black mt-2">
                {user ? (
                  <button onClick={logout} className="w-full text-left px-4 py-3 font-bold bg-neo-pink border-2 border-black text-white shadow-neo">Logout</button>
                ) : (
                  <button onClick={() => { setAuthMode('register'); setIsOpen(false); setIsAuthOpen(true); }} className="w-full text-left px-4 py-3 font-bold bg-neo-cyan border-2 border-black shadow-neo flex items-center gap-2">
                    <UserPlus className="w-5 h-5" /> Accedi / Registrati
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode={authMode} />
    </>
  );
};

export default Navbar;
