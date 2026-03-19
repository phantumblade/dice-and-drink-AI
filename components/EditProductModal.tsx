import React, { useState, useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface EditProductModalProps {
    product: any;
    onClose: () => void;
    onUpdated: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose, onUpdated }) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: 'boardgame',
        image: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                image: product.image
            });
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/products/${product.id}`, formData);
            showToast('Prodotto aggiornato con successo!', 'success');
            onUpdated();
            onClose();
        } catch (error) {
            console.error('Error updating product:', error);
            showToast('Errore durante l\'aggiornamento del prodotto', 'error');
        }
    };

    return (
        <div className="app-modal-shell animate-in fade-in duration-200">
            <div className="app-modal-panel max-w-lg">
                <div className="app-modal-header flex justify-between items-center p-5 md:p-6 border-b-2 border-black">
                    <h2 className="text-2xl font-black uppercase flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6" /> Modifica Prodotto
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
                            Salva Modifiche
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
