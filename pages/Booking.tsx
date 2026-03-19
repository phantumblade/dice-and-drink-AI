import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Hourglass, Check } from 'lucide-react';
import { Booking as BookingType } from '../types';

const Booking: React.FC = () => {
    const { items, total, clearCart } = useCart();
    const { addBooking, user } = useUser();
    const navigate = useNavigate();
    const [showSummary, setShowSummary] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        participants: 1,
        duration: 2
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleConfirm = async () => {
        if (!user) {
            window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'register' } }));
            return;
        }

        const newBooking: BookingType = {
            id: Math.random().toString(36).substr(2, 9), // ID will be overwritten by backend
            date: formData.date,
            time: formData.time,
            participants: Number(formData.participants),
            duration: Number(formData.duration),
            items: [...items],
            totalPrice: total,
            status: 'confirmed'
        };

        try {
            await addBooking(newBooking);
            setConfirmed(true);

            setTimeout(() => {
                clearCart();
                navigate('/profile');
            }, 2000);
        } catch (error) {
            // Error handled in context
        }
    };

    if (confirmed) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neo-bg">
                <div className="text-center animate-bounce">
                    <div className="bg-neo-lime border-2 border-black w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-neo">
                        <Check className="w-12 h-12 text-black" />
                    </div>
                    <h1 className="text-4xl font-black uppercase">Prenotazione Confermata!</h1>
                    <p className="text-xl mt-2 font-medium">Preparati per l'avventura.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-5xl font-black uppercase mb-2">Prenotazione Tavolo</h1>
                <p className="text-lg bg-neo-yellow inline-block px-2 border-2 border-black font-bold">
                    Assicura il tuo posto nel dungeon.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Form */}
                <div className="bg-white border-2 border-black p-8 shadow-neo-lg h-fit">
                    <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                        <Calendar className="w-6 h-6" /> Dettagli Missione
                    </h3>

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowSummary(true); }}>
                        <div>
                            <label className="block font-bold uppercase text-sm mb-2">Data <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="w-full border-2 border-black p-3 font-medium focus:bg-neo-bg outline-none focus:shadow-neo transition-all"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold uppercase text-sm mb-2">Ora <span className="text-red-500">*</span></label>
                                <input
                                    type="time"
                                    name="time"
                                    required
                                    className="w-full border-2 border-black p-3 font-medium focus:bg-neo-bg outline-none focus:shadow-neo transition-all"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block font-bold uppercase text-sm mb-2">Partecipanti <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Users className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name="participants"
                                        min="1" max="12"
                                        required
                                        value={formData.participants}
                                        className="w-full border-2 border-black p-3 font-medium focus:bg-neo-bg outline-none focus:shadow-neo transition-all"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold uppercase text-sm mb-2">Durata Est. (Ore)</label>
                            <div className="relative">
                                <Hourglass className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="duration"
                                    min="1" max="6"
                                    value={formData.duration}
                                    className="w-full border-2 border-black p-3 font-medium focus:bg-neo-bg outline-none focus:shadow-neo transition-all"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white border-2 border-black py-4 font-black uppercase text-lg shadow-neo hover:bg-neo-violet hover:translate-y-1 hover:shadow-none transition-all mt-8"
                        >
                            Rivedi & Conferma
                        </button>
                    </form>
                </div>

                {/* Cart Preview */}
                <div>
                    <h3 className="text-2xl font-black uppercase mb-6">Il Tuo Pre-Ordine</h3>
                    {items.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-400 p-8 text-center text-gray-500 font-bold">
                            Nessun oggetto aggiunto. <br /> Puoi ordinare anche al tavolo.
                        </div>
                    ) : (
                        <div className="bg-neo-bg border-2 border-black p-6 shadow-neo space-y-4">
                            {items.map(item => (
                                <div key={item.cartId} className="flex justify-between items-center bg-white p-3 border-2 border-black">
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-neo-pink">x{item.quantity}</span>
                                        <span className="font-bold uppercase">{item.name}</span>
                                    </div>
                                    <span className="font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t-2 border-black pt-4 flex justify-between items-center text-xl font-black">
                                <span>TOTALE</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Modal */}
            {showSummary && (
                <div className="app-modal-shell">
                    <div className="app-modal-panel max-w-md relative">
                        <div className="app-modal-header border-b-2 border-black bg-white px-5 py-4 md:px-8 md:py-5">
                            <h2 className="text-2xl md:text-3xl font-black uppercase text-center">Riepilogo</h2>
                        </div>

                        <div className="app-modal-body px-5 py-5 md:px-8 md:py-6">
                        <div className="space-y-4 mb-8 bg-neo-bg p-4 border-2 border-black">
                            <div className="flex justify-between border-b-2 border-gray-200 pb-2">
                                <span className="font-bold text-gray-600 uppercase">Data</span>
                                <span className="font-black">{formData.date}</span>
                            </div>
                            <div className="flex justify-between border-b-2 border-gray-200 pb-2">
                                <span className="font-bold text-gray-600 uppercase">Ora</span>
                                <span className="font-black">{formData.time}</span>
                            </div>
                            <div className="flex justify-between border-b-2 border-gray-200 pb-2">
                                <span className="font-bold text-gray-600 uppercase">Gruppo</span>
                                <span className="font-black">{formData.participants} Avventurieri</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold text-gray-600 uppercase">Oggetti</span>
                                <span className="font-black">{items.length} Pre-ordinati</span>
                            </div>
                        </div>

                        <div className="app-modal-footer flex flex-col-reverse sm:flex-row gap-4">
                            <button
                                onClick={() => setShowSummary(false)}
                                className="flex-1 bg-white border-2 border-black py-3 font-bold uppercase hover:bg-gray-100"
                            >
                                Modifica
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 bg-neo-lime border-2 border-black py-3 font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all"
                            >
                                Conferma
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
