import React, { useEffect, useState } from 'react';
import { X, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'register' | 'login';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'register' }) => {
    const { login, register } = useUser();
    const [isRegistering, setIsRegistering] = useState(defaultMode === 'register');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        setIsRegistering(defaultMode === 'register');
        setError('');
    }, [defaultMode, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isRegistering) {
            if (!formData.name || !formData.email || !formData.password) {
                setError('Tutti i campi sono obbligatori.');
                return;
            }
            const result = await register(formData);
            if (result.success) {
                onClose();
                setFormData({ name: '', email: '', password: '' });
            } else {
                setError(result.message || 'Errore durante la registrazione.');
            }
        } else {
            if (!formData.email || !formData.password) {
                setError('Inserisci email e password.');
                return;
            }
            const result = await login(formData.email, formData.password);
            if (result.success) {
                onClose();
                setFormData({ name: '', email: '', password: '' });
            } else {
                setError(result.message || 'Login fallito.');
            }
        }
    };

    return (
        <div className="app-modal-shell z-[60] animate-in fade-in duration-200">
            <div className="app-modal-panel relative max-w-md overflow-hidden animate-in slide-in-from-bottom-6 md:zoom-in md:slide-in-from-bottom-0 duration-200">
                {/* Header */}
                <div className={`app-modal-header p-5 md:p-6 border-b-2 border-black flex justify-between items-center ${isRegistering ? 'bg-neo-lime' : 'bg-neo-cyan'}`}>
                    <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                        {isRegistering ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
                        {isRegistering ? 'Unisciti al Party' : 'Bentornato'}
                    </h2>
                    <button onClick={onClose} className="hover:bg-black hover:text-white p-1 transition-colors border-2 border-transparent hover:border-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="app-modal-body p-5 md:p-8">
                    {error && (
                        <div className="mb-4 bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 font-bold text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isRegistering && (
                            <div>
                                <label className="block text-xs font-black uppercase mb-1">Nome Avventuriero</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border-2 border-black p-3 font-bold focus:bg-neo-bg focus:shadow-neo outline-none transition-all"
                                    placeholder="Come ti chiameremo?"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-black uppercase mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full border-2 border-black p-3 font-bold focus:bg-neo-bg focus:shadow-neo outline-none transition-all"
                                placeholder="tu@esempio.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase mb-1">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full border-2 border-black p-3 font-bold focus:bg-neo-bg focus:shadow-neo outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full border-2 border-black py-4 font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all flex justify-center items-center gap-2 mt-6 ${isRegistering ? 'bg-black text-white' : 'bg-neo-violet text-white'}`}
                        >
                            {isRegistering ? 'Registrati' : 'Accedi'} <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300 text-center">
                        <p className="text-sm font-bold text-gray-500 mb-2">
                            {isRegistering ? 'Hai già un account?' : 'Nuovo giocatore?'}
                        </p>
                        <button
                            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                            className="text-black font-black uppercase hover:text-neo-pink underline decoration-2 underline-offset-2"
                        >
                            {isRegistering ? 'Accedi qui' : 'Crea un account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
