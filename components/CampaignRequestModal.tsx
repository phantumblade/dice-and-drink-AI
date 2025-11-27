import React, { useState, useEffect } from 'react';
import { Campaign, Character } from '../types';
import { useUser } from '../contexts/UserContext';
import { useCampaigns } from '../contexts/CampaignContext';
import { X, Scroll, Shield } from 'lucide-react';
import api from '../services/api';

interface CampaignRequestModalProps {
    campaign: Campaign;
    onClose: () => void;
}

const CampaignRequestModal: React.FC<CampaignRequestModalProps> = ({ campaign, onClose }) => {
    const { user } = useUser();
    const { requestJoinCampaign } = useCampaigns();
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedChar, setSelectedChar] = useState<string>('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            api.get<Character[]>(`/characters?userId=${user.id}`).then(res => {
                setCharacters(res.data);
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChar) return;

        setLoading(true);
        try {
            await requestJoinCampaign(campaign.id, selectedChar, message);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 md:flex md:items-center md:justify-center md:p-4 bg-white md:bg-black/60 md:backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-amber-50 w-full h-full md:h-auto md:border-4 border-black md:shadow-neo-lg max-w-lg md:w-full relative overflow-y-auto md:overflow-visible">
                <div className="bg-amber-200 p-4 border-b-2 border-black flex justify-between items-center">
                    <h2 className="text-xl font-serif font-black uppercase text-amber-900 flex items-center gap-2">
                        <Scroll className="w-5 h-5" /> Richiesta di Partecipazione
                    </h2>
                    <button onClick={onClose} className="hover:bg-amber-300 p-1 rounded transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <h3 className="font-bold uppercase mb-2 text-sm">Campagna</h3>
                        <p className="text-lg font-serif font-black text-amber-900">{campaign.title}</p>
                    </div>

                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm">Seleziona Personaggio</label>
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border-2 border-black bg-white p-2">
                            {characters.length === 0 ? (
                                <p className="text-sm text-gray-500 p-2">Nessun personaggio trovato. Creane uno nel tuo profilo!</p>
                            ) : (
                                characters.map(char => (
                                    <label key={char.id} className={`flex items-center gap-3 p-2 border-2 cursor-pointer transition-all ${selectedChar === char.id ? 'border-amber-600 bg-amber-100' : 'border-transparent hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="character"
                                            value={char.id}
                                            checked={selectedChar === char.id}
                                            onChange={(e) => setSelectedChar(e.target.value)}
                                            className="hidden"
                                        />
                                        <img src={char.avatar} alt={char.name} className="w-10 h-10 rounded-full border border-black" />
                                        <div>
                                            <p className="font-bold text-sm">{char.name}</p>
                                            <p className="text-xs text-gray-500">{char.race} {char.class} (Lv.{char.level})</p>
                                        </div>
                                        {selectedChar === char.id && <Shield className="w-4 h-4 text-amber-600 ml-auto" />}
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold uppercase mb-2 text-sm">Messaggio al Master</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full border-2 border-black p-3 font-medium focus:outline-none focus:shadow-neo min-h-[100px]"
                            placeholder="Presentati e spiega perché il tuo personaggio è perfetto per questa avventura..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedChar}
                        className="w-full bg-black text-white py-3 font-black uppercase border-2 border-black hover:bg-neo-lime hover:text-black transition-all shadow-neo hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Invio in corso...' : 'Invia Richiesta'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CampaignRequestModal;
