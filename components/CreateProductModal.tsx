import React, { useState } from 'react';
import { X, ShoppingBag, Tag, DollarSign, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface CreateProductModalProps {
    onClose: () => void;
    onCreated: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ onClose, onCreated }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: 'boardgame',
        image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&q=80&w=800',
        available: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/products', formData);
            showToast('Prodotto aggiunto al catalogo!', 'success');
            onCreated();
            onClose();
        } catch (error) {
            console.error('Error creating product:', error);
            showToast('Errore durante la creazione del prodotto', 'error');
        }
    };

    return (
        <div className="app-modal-shell animate-in fade-in duration-200">
            <div className="app-modal-panel max-w-lg">
                <div className="app-modal-header flex justify-between items-center p-5 md:p-6 border-b-2 border-black">
                    <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6" /> Nuovo Prodotto
                    </h2>
                    <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="app-modal-body p-5 md:p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Nome Prodotto</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:ring-2 focus:ring-neo-cyan"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Categoria</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:ring-2 focus:ring-neo-cyan"
                            >
                                <option value="boardgame">Gioco da Tavolo</option>
                                <option value="cardgame">Gioco di Carte</option>
                                <option value="rpg">Gioco di Ruolo</option>
                                <option value="drink">Drink</option>
                                <option value="snack">Snack</option>
                                <option value="merch">Merchandise</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase mb-1">Prezzo (€)</label>
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.5"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:ring-2 focus:ring-neo-cyan"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Descrizione</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border-2 border-black p-2 font-medium focus:outline-none focus:ring-2 focus:ring-neo-cyan"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">URL Immagine</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                className="w-full border-2 border-black p-2 font-bold focus:outline-none focus:ring-2 focus:ring-neo-cyan"
                            />
                            <div className="w-10 h-10 border-2 border-black overflow-hidden bg-gray-100 shrink-0">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="available"
                            checked={formData.available}
                            onChange={e => setFormData({ ...formData, available: e.target.checked })}
                            className="w-5 h-5 border-2 border-black rounded focus:ring-neo-cyan"
                        />
                        <label htmlFor="available" className="font-bold uppercase cursor-pointer select-none">Disponibile subito</label>
                    </div>

                    <div className="app-modal-footer pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 font-bold uppercase border-2 border-transparent hover:bg-gray-100 transition-colors"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-neo-cyan border-2 border-black font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            Aggiungi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProductModal;
