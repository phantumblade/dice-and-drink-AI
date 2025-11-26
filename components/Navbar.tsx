import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Dice5, LogOut, ShieldAlert, User as UserIcon, UserPlus } from 'lucide-react';
import { UserRole } from '../types';
import { useUser } from '../contexts/UserContext';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, children }: { to: string; children?: React.ReactNode }) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-transparent transition-all ${
        isActive(to)
          ? 'bg-neo-violet text-white border-black shadow-neo -translate-y-1'
          : 'text-black hover:bg-neo-lime hover:border-black hover:shadow-neo hover:-translate-y-1'
      }`}
    >
      {children}
    </Link>
  );

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
              {user && (user.role === UserRole.ADMIN || user.role === UserRole.STAFF) && (
                <NavItem to="/dashboard">Admin</NavItem>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
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
                onClick={() => setIsAuthOpen(true)}
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
            {user && (user.role === UserRole.ADMIN || user.role === UserRole.STAFF) && (
                <NavItem to="/dashboard">Dashboard</NavItem>
            )}
             <div className="pt-4 pb-2 border-t-2 border-black mt-2">
                {user ? (
                   <button onClick={logout} className="w-full text-left px-4 py-3 font-bold bg-neo-pink border-2 border-black text-white shadow-neo">Logout</button>
                ) : (
                    <button onClick={() => { setIsOpen(false); setIsAuthOpen(true); }} className="w-full text-left px-4 py-3 font-bold bg-neo-cyan border-2 border-black shadow-neo flex items-center gap-2">
                        <UserPlus className="w-5 h-5" /> Accedi / Registrati
                    </button>
                )}
             </div>
          </div>
        </div>
      )}
    </nav>

    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;