import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    AlertTriangle,
    ArrowLeft,
    BookOpen,
    Calendar,
    Check,
    CheckCircle,
    Clock,
    Crown,
    Dice6,
    Hourglass,
    MapPin,
    MessageSquare,
    Scroll,
    Share2,
    Shield,
    Sparkles,
    Swords,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import api from '../services/api';
import { Campaign, CampaignNote, CampaignRequest, Character } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useUser } from '../contexts/UserContext';
import CharacterCard from '../components/CharacterCard';
import CharacterSheetModal from '../components/CharacterSheetModal';
import SessionItem from '../components/SessionItem';
import { getAvatarUrl } from '../utils/url';

type CampaignDetails = Campaign & {
    currentPlayers?: number;
    deposit?: number;
    platform?: string;
    sessionDuration?: string;
    tags?: string;
    notes?: CampaignNote[];
    requests?: CampaignRequest[];
};

type CampaignTab = 'overview' | 'sessions' | 'party' | 'requests';

const STATUS_META: Record<string, { label: string; badgeClass: string; panelClass: string }> = {
    RECRUITING: {
        label: 'In reclutamento',
        badgeClass: 'bg-neo-lime text-black',
        panelClass: 'bg-neo-lime/20',
    },
    ACTIVE: {
        label: 'Attiva',
        badgeClass: 'bg-neo-cyan text-black',
        panelClass: 'bg-neo-cyan/20',
    },
    PAUSED: {
        label: 'In pausa',
        badgeClass: 'bg-neo-yellow text-black',
        panelClass: 'bg-neo-yellow/20',
    },
    COMPLETED: {
        label: 'Conclusa',
        badgeClass: 'bg-black text-white',
        panelClass: 'bg-zinc-200',
    },
};

const TYPE_LABELS: Record<string, string> = {
    ONE_SHOT: 'One-Shot',
    SHORT_CAMPAIGN: 'Campagna Breve',
    LONG_CAMPAIGN: 'Campagna Lunga',
};

const REQUEST_STATUS_LABELS: Record<string, string> = {
    PENDING: 'In attesa',
    APPROVED: 'Approvata',
    REJECTED: 'Rifiutata',
};

const formatLongDate = (value?: string) => {
    if (!value) return 'Da definire';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Da definire';

    return date.toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const formatShortDate = (value?: string) => {
    if (!value) return 'Data non disponibile';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Data non disponibile';

    return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const parseTags = (raw?: string) => {
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0) : [];
    } catch {
        return [];
    }
};

const CampaignDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user } = useUser();

    const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<CampaignTab>('overview');
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [availableCharacters, setAvailableCharacters] = useState<Character[]>([]);
    const [selectedCharacterId, setSelectedCharacterId] = useState('');
    const [requestMessage, setRequestMessage] = useState('');
    const [isLoadingCharacters, setIsLoadingCharacters] = useState(false);
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
    const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

    const fetchCampaign = async () => {
        if (!id) return;

        try {
            const response = await api.get<CampaignDetails>(`/campaigns/${id}`);
            setCampaign(response.data);
        } catch (error) {
            console.error('Error fetching campaign:', error);
            showToast('Errore nel caricamento della campagna', 'error');
            navigate('/tournaments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaign();
    }, [id]);

    const loadCharacters = async () => {
        if (!user) return;

        setIsLoadingCharacters(true);

        try {
            const response = await api.get<Character[]>(`/characters?userId=${user.id}`);
            setAvailableCharacters(response.data);
        } catch (error) {
            console.error('Error fetching characters:', error);
            showToast('Impossibile caricare i tuoi personaggi', 'error');
        } finally {
            setIsLoadingCharacters(false);
        }
    };

    const tags = useMemo(() => parseTags(campaign?.tags), [campaign?.tags]);
    const participants = campaign?.participants || [];
    const requests = campaign?.requests || [];
    const pendingRequests = requests.filter((request) => request.status === 'PENDING');
    const loreNotes = (campaign?.notes || []).filter((note) => note.type !== 'CHAT').slice(0, 3);
    const participantCount = participants.length;
    const maxPlayers = campaign?.maxPlayers || 0;
    const availableSlots = Math.max(maxPlayers - participantCount, 0);
    const isDm = user?.id === campaign?.dm?.id;
    const isPartyMember = participants.some((participant) => participant.user.id === user?.id);
    const pendingUserRequest = requests.find((request) => request.user.id === user?.id && request.status === 'PENDING');
    const statusMeta = STATUS_META[campaign?.status || ''] || {
        label: campaign?.status || 'Stato sconosciuto',
        badgeClass: 'bg-white text-black',
        panelClass: 'bg-white',
    };
    const canSubmitRequest = Boolean(
        campaign &&
        user &&
        campaign.status === 'RECRUITING' &&
        !isDm &&
        !isPartyMember &&
        !pendingUserRequest &&
        availableSlots > 0
    );

    const tabs: { id: CampaignTab; label: string; count?: number }[] = [
        { id: 'overview', label: 'Panoramica' },
        { id: 'sessions', label: 'Sessioni', count: campaign?.sessions?.length || 0 },
        { id: 'party', label: 'Party', count: participantCount },
    ];

    if (isDm) {
        tabs.push({ id: 'requests', label: 'Richieste', count: pendingRequests.length });
    }

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate('/tournaments');
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('Link della campagna copiato', 'success');
        } catch (error) {
            console.error('Failed to copy link:', error);
            showToast('Impossibile copiare il link', 'error');
        }
    };

    const openAuthModal = () => {
        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }));
    };

    const handleOpenRequestModal = async () => {
        if (!user) {
            openAuthModal();
            return;
        }

        setIsRequestModalOpen(true);
        setSelectedCharacterId('');
        setRequestMessage('');

        if (availableCharacters.length === 0) {
            await loadCharacters();
        }
    };

    const handleSubmitRequest = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!campaign || !user || !selectedCharacterId) return;

        setIsSubmittingRequest(true);

        try {
            await api.post(`/campaigns/${campaign.id}/request`, {
                userId: user.id,
                characterId: selectedCharacterId,
                message: requestMessage.trim(),
            });

            showToast('Richiesta inviata con successo', 'success');
            setIsRequestModalOpen(false);
            await fetchCampaign();
        } catch (error: any) {
            console.error('Failed to submit request:', error);
            showToast(error.response?.data?.error || 'Impossibile inviare la richiesta', 'error');
        } finally {
            setIsSubmittingRequest(false);
        }
    };

    const handleRequestAction = async (requestId: string, action: 'approve' | 'reject') => {
        setActiveRequestId(requestId);

        try {
            await api.post(`/campaigns/requests/${requestId}/${action}`);
            showToast(
                action === 'approve' ? 'Richiesta approvata' : 'Richiesta rifiutata',
                action === 'approve' ? 'success' : 'info'
            );
            await fetchCampaign();
        } catch (error) {
            console.error(`Failed to ${action} request:`, error);
            showToast('Errore nell aggiornamento della richiesta', 'error');
        } finally {
            setActiveRequestId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neo-bg px-4">
                <div className="border-2 border-black bg-white px-6 py-4 font-black uppercase shadow-neo">
                    Caricamento campagna...
                </div>
            </div>
        );
    }

    if (!campaign) return null;

    return (
        <div className="min-h-screen bg-neo-bg pb-24">
            {selectedCharacter && (
                <CharacterSheetModal
                    character={selectedCharacter}
                    onClose={() => setSelectedCharacter(null)}
                />
            )}

            {isRequestModalOpen && (
                <div className="app-modal-shell bg-black/70">
                    <div className="app-modal-panel max-w-2xl">
                        <div className="app-modal-header flex items-center justify-between border-b-2 border-black bg-neo-yellow px-5 py-4">
                            <div>
                                <p className="text-xs font-black uppercase text-black/70">Candidatura alla campagna</p>
                                <h2 className="text-2xl font-black uppercase">{campaign.title}</h2>
                            </div>
                            <button
                                onClick={() => setIsRequestModalOpen(false)}
                                className="border-2 border-black bg-white p-2 transition-colors hover:bg-black hover:text-white"
                                aria-label="Chiudi"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitRequest} className="app-modal-body space-y-6 p-5 md:p-6">
                            <div className="rounded-sm border-2 border-black bg-neo-bg p-4">
                                <p className="text-sm font-bold text-gray-700">
                                    Scegli il personaggio con cui vuoi entrare nel party e lascia un messaggio breve al Dungeon Master.
                                </p>
                            </div>

                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="text-sm font-black uppercase">Personaggio</label>
                                    {availableCharacters.length === 0 && !isLoadingCharacters && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsRequestModalOpen(false);
                                                navigate('/profile');
                                            }}
                                            className="text-xs font-black uppercase underline underline-offset-2"
                                        >
                                            Vai al profilo
                                        </button>
                                    )}
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    {isLoadingCharacters && (
                                        <div className="col-span-full border-2 border-dashed border-black bg-white p-6 text-center font-bold uppercase text-gray-500">
                                            Caricamento personaggi...
                                        </div>
                                    )}

                                    {!isLoadingCharacters && availableCharacters.length === 0 && (
                                        <div className="col-span-full border-2 border-dashed border-black bg-white p-6 text-center">
                                            <p className="font-bold text-gray-600">Non hai ancora personaggi disponibili.</p>
                                            <p className="mt-2 text-sm text-gray-500">Crea una scheda dal profilo per candidarti a una campagna.</p>
                                        </div>
                                    )}

                                    {availableCharacters.map((character) => (
                                        <button
                                            key={character.id}
                                            type="button"
                                            onClick={() => setSelectedCharacterId(character.id)}
                                            className={`border-2 p-4 text-left shadow-neo-sm transition-all ${
                                                selectedCharacterId === character.id
                                                    ? 'border-black bg-neo-cyan -translate-y-1'
                                                    : 'border-black bg-white hover:bg-neo-bg'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getAvatarUrl(character.avatar) || '/default-avatar.svg'}
                                                    alt={character.name}
                                                    className="h-14 w-14 border-2 border-black bg-white object-cover"
                                                />
                                                <div>
                                                    <p className="font-black uppercase">{character.name}</p>
                                                    <p className="text-xs font-bold uppercase text-gray-600">
                                                        {character.race} {character.class} • Livello {character.level}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-black uppercase">Messaggio al DM</label>
                                <textarea
                                    value={requestMessage}
                                    onChange={(event) => setRequestMessage(event.target.value)}
                                    className="min-h-[120px] w-full border-2 border-black p-4 font-medium outline-none transition-all focus:bg-neo-bg focus:shadow-neo"
                                    placeholder="Racconta in poche righe che tipo di personaggio porterai al tavolo e che tono di gioco cerchi."
                                />
                            </div>

                            <div className="app-modal-footer flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setIsRequestModalOpen(false)}
                                    className="flex-1 border-2 border-black bg-white px-4 py-3 font-black uppercase transition-colors hover:bg-gray-100"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingRequest || !selectedCharacterId}
                                    className="flex-1 border-2 border-black bg-black px-4 py-3 font-black uppercase text-white shadow-neo transition-all hover:bg-neo-pink hover:shadow-neo-hover disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmittingRequest ? 'Invio in corso...' : 'Invia richiesta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <section className="relative overflow-hidden border-b-4 border-black bg-black text-white">
                <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.35),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.82))]" />

                <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            onClick={handleBack}
                            className="inline-flex items-center gap-2 self-start border-2 border-black bg-white px-4 py-2 font-black uppercase text-black shadow-neo-sm transition-all hover:-translate-y-0.5 hover:bg-neo-yellow"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Torna indietro
                        </button>

                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 self-start border-2 border-white/70 bg-transparent px-4 py-2 font-black uppercase text-white transition-colors hover:bg-white hover:text-black"
                        >
                            <Share2 className="h-4 w-4" />
                            Condividi campagna
                        </button>
                    </div>

                    <div className="max-w-4xl">
                        <div className="mb-4 flex flex-wrap gap-3">
                            <span className="border-2 border-black bg-white px-3 py-1 text-sm font-black uppercase text-black shadow-neo-sm">
                                {campaign.system}
                            </span>
                            <span className={`border-2 border-black px-3 py-1 text-sm font-black uppercase shadow-neo-sm ${statusMeta.badgeClass}`}>
                                {statusMeta.label}
                            </span>
                            <span className="border-2 border-black bg-neo-pink px-3 py-1 text-sm font-black uppercase text-white shadow-neo-sm">
                                {TYPE_LABELS[campaign.type] || campaign.type}
                            </span>
                        </div>

                        <h1 className="max-w-5xl text-4xl font-black uppercase italic tracking-tight text-white md:text-6xl">
                            {campaign.title}
                        </h1>

                        <p className="mt-5 max-w-3xl text-base font-medium text-white/90 md:text-lg">
                            {campaign.description}
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-4">
                            <div className="border-2 border-black bg-white p-4 text-black shadow-neo">
                                <p className="text-xs font-black uppercase text-gray-500">Dungeon Master</p>
                                <div className="mt-2 flex items-center gap-3">
                                    <img
                                        src={getAvatarUrl(campaign.dm?.avatar) || '/default-avatar.svg'}
                                        alt={campaign.dm?.name}
                                        className="h-12 w-12 border-2 border-black bg-neo-bg object-cover"
                                    />
                                    <div>
                                        <p className="font-black uppercase">{campaign.dm?.name || 'Da assegnare'}</p>
                                        <p className="text-xs font-bold uppercase text-gray-500">Guida della campagna</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-2 border-black bg-neo-yellow p-4 text-black shadow-neo">
                                <p className="text-xs font-black uppercase text-black/60">Party</p>
                                <div className="mt-3 flex items-end justify-between">
                                    <div className="text-3xl font-black">{participantCount}/{maxPlayers}</div>
                                    <Users className="h-7 w-7" />
                                </div>
                                <p className="mt-2 text-xs font-bold uppercase">{availableSlots} posti liberi</p>
                            </div>

                            <div className="border-2 border-black bg-neo-cyan p-4 text-black shadow-neo">
                                <p className="text-xs font-black uppercase text-black/60">Inizio</p>
                                <div className="mt-3 flex items-end justify-between">
                                    <div className="text-lg font-black uppercase">{formatShortDate(campaign.startDate)}</div>
                                    <Calendar className="h-7 w-7" />
                                </div>
                                <p className="mt-2 text-xs font-bold uppercase">{campaign.frequency}</p>
                            </div>

                            <div className="border-2 border-black bg-neo-pink p-4 text-white shadow-neo">
                                <p className="text-xs font-black uppercase text-white/70">Sessione tipo</p>
                                <div className="mt-3 flex items-end justify-between">
                                    <div className="text-lg font-black uppercase">{campaign.sessionDuration || '3-4 ore'}</div>
                                    <Dice6 className="h-7 w-7" />
                                </div>
                                <p className="mt-2 text-xs font-bold uppercase">{campaign.platform || 'In presenza'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8">
                <aside className="space-y-6">
                    <div className="border-2 border-black bg-white p-6 shadow-neo">
                        <h2 className="flex items-center gap-2 border-b-2 border-black pb-3 text-lg font-black uppercase">
                            <Shield className="h-5 w-5" />
                            Stato Campagna
                        </h2>

                        <div className={`mt-5 border-2 border-black p-4 ${statusMeta.panelClass}`}>
                            {isDm ? (
                                <>
                                    <p className="text-xs font-black uppercase text-gray-600">Vista Dungeon Master</p>
                                    <p className="mt-2 text-lg font-black uppercase">
                                        {pendingRequests.length > 0
                                            ? `${pendingRequests.length} richieste da gestire`
                                            : 'Party sotto controllo'}
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('requests')}
                                        className="mt-4 inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 font-black uppercase shadow-neo-sm transition-all hover:-translate-y-0.5 hover:bg-neo-yellow"
                                    >
                                        <Check className="h-4 w-4" />
                                        Gestisci richieste
                                    </button>
                                </>
                            ) : isPartyMember ? (
                                <>
                                    <p className="text-xs font-black uppercase text-gray-600">Sei gia nel party</p>
                                    <p className="mt-2 text-lg font-black uppercase">Posto confermato al tavolo</p>
                                    <p className="mt-2 text-sm font-medium text-gray-700">
                                        La tua candidatura e stata accettata. Controlla sessioni e composizione del gruppo qui sotto.
                                    </p>
                                </>
                            ) : pendingUserRequest ? (
                                <>
                                    <p className="text-xs font-black uppercase text-gray-600">Richiesta inviata</p>
                                    <p className="mt-2 text-lg font-black uppercase">In attesa del DM</p>
                                    <p className="mt-2 text-sm font-medium text-gray-700">
                                        Il master deve ancora valutare la tua candidatura.
                                    </p>
                                </>
                            ) : canSubmitRequest ? (
                                <>
                                    <p className="text-xs font-black uppercase text-gray-600">Campagna aperta</p>
                                    <p className="mt-2 text-lg font-black uppercase">Puoi candidarti ora</p>
                                    <p className="mt-2 text-sm font-medium text-gray-700">
                                        Ci sono ancora {availableSlots} posti disponibili e il gruppo e in fase di reclutamento.
                                    </p>
                                    <button
                                        onClick={handleOpenRequestModal}
                                        className="mt-4 inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-black px-4 py-3 font-black uppercase text-white shadow-neo transition-all hover:bg-neo-pink hover:shadow-neo-hover"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Richiedi ingresso
                                    </button>
                                </>
                            ) : !user ? (
                                <>
                                    <p className="text-xs font-black uppercase text-gray-600">Accesso richiesto</p>
                                    <p className="mt-2 text-lg font-black uppercase">Accedi per candidarti</p>
                                    <p className="mt-2 text-sm font-medium text-gray-700">
                                        Devi autenticarti per inviare una richiesta con uno dei tuoi personaggi.
                                    </p>
                                    <button
                                        onClick={openAuthModal}
                                        className="mt-4 inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-black px-4 py-3 font-black uppercase text-white shadow-neo transition-all hover:bg-neo-pink hover:shadow-neo-hover"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Accedi
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs font-black uppercase text-gray-600">Reclutamento chiuso</p>
                                    <p className="mt-2 text-lg font-black uppercase">Non candidabile ora</p>
                                    <p className="mt-2 text-sm font-medium text-gray-700">
                                        La campagna non e in fase di reclutamento oppure non ha piu slot liberi.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="border-2 border-black bg-white p-6 shadow-neo">
                        <h2 className="flex items-center gap-2 border-b-2 border-black pb-3 text-lg font-black uppercase">
                            <Sparkles className="h-5 w-5" />
                            Scheda Avventura
                        </h2>

                        <div className="mt-5 space-y-4 text-sm font-bold">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-neo-violet" />
                                <div>
                                    <p className="text-xs uppercase text-gray-500">Partenza</p>
                                    <p>{formatLongDate(campaign.startDate)}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-neo-pink" />
                                <div>
                                    <p className="text-xs uppercase text-gray-500">Cadenza</p>
                                    <p>{campaign.frequency}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-neo-cyan" />
                                <div>
                                    <p className="text-xs uppercase text-gray-500">Piattaforma</p>
                                    <p>{campaign.platform || 'In presenza'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Hourglass className="mt-0.5 h-4 w-4 flex-shrink-0 text-neo-yellow" />
                                <div>
                                    <p className="text-xs uppercase text-gray-500">Durata sessione</p>
                                    <p>{campaign.sessionDuration || '3-4 ore'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Swords className="mt-0.5 h-4 w-4 flex-shrink-0 text-neo-violet" />
                                <div>
                                    <p className="text-xs uppercase text-gray-500">Range livelli</p>
                                    <p>{campaign.levelRange}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-neo-pink" />
                                <div>
                                    <p className="text-xs uppercase text-gray-500">Party ideale</p>
                                    <p>{campaign.minPlayers || 1} - {campaign.maxPlayers || 4} giocatori</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-2 border-black bg-white p-6 shadow-neo">
                        <h2 className="flex items-center gap-2 border-b-2 border-black pb-3 text-lg font-black uppercase">
                            <Crown className="h-5 w-5" />
                            Regia del Tavolo
                        </h2>

                        <div className="mt-5 flex items-center gap-4">
                            <img
                                src={getAvatarUrl(campaign.dm?.avatar) || '/default-avatar.svg'}
                                alt={campaign.dm?.name}
                                className="h-16 w-16 border-2 border-black bg-neo-bg object-cover shadow-neo-sm"
                            />
                            <div>
                                <p className="font-black uppercase">{campaign.dm?.name || 'Dungeon Master'}</p>
                                <p className="text-xs font-bold uppercase text-gray-500">{campaign.system}</p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-sm border-2 border-dashed border-black p-4 text-sm font-medium text-gray-700">
                            {campaign.proposer && campaign.proposer.id !== campaign.dm?.id ? (
                                <p>
                                    Campagna proposta da <span className="font-black uppercase">{campaign.proposer.name}</span> e attualmente gestita dal DM.
                                </p>
                            ) : (
                                <p>
                                    Questa campagna e presentata come tavolo attivo con guida del master gia assegnata.
                                </p>
                            )}
                        </div>
                    </div>
                </aside>

                <section className="space-y-6">
                    <div className="flex flex-wrap gap-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`border-2 px-5 py-3 font-black uppercase transition-all ${
                                    activeTab === tab.id
                                        ? 'border-black bg-black text-white shadow-neo'
                                        : 'border-black bg-white text-black shadow-neo-sm hover:-translate-y-0.5 hover:bg-neo-bg'
                                }`}
                            >
                                {tab.label}
                                {typeof tab.count === 'number' ? ` (${tab.count})` : ''}
                            </button>
                        ))}
                    </div>

                    <div className="border-2 border-black bg-white p-6 shadow-neo lg:p-8">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="flex items-center gap-3 text-2xl font-black uppercase">
                                                <BookOpen className="h-6 w-6 text-neo-violet" />
                                                Visione della Campagna
                                            </h2>
                                            <p className="mt-4 whitespace-pre-wrap text-base font-medium leading-relaxed text-gray-800">
                                                {campaign.description}
                                            </p>
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="border-2 border-black bg-neo-bg p-5">
                                                <h3 className="text-sm font-black uppercase text-gray-600">Trama / Hook</h3>
                                                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-700">
                                                    {campaign.plot || 'Il master non ha ancora pubblicato una sinossi estesa della trama. La campagna viene presentata attraverso il pitch principale e gli elementi di setting gia confermati.'}
                                                </p>
                                            </div>

                                            <div className="border-2 border-black bg-neo-bg p-5">
                                                <h3 className="text-sm font-black uppercase text-gray-600">Regole di Tavolo</h3>
                                                <p className="mt-3 text-sm font-medium leading-relaxed text-gray-700">
                                                    {campaign.rules || 'Nessuna house rule caricata per ora. Il tavolo segue il regolamento del sistema indicato, salvo accordi condivisi tra master e giocatori.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="border-2 border-black bg-neo-yellow p-5">
                                            <h3 className="flex items-center gap-2 text-sm font-black uppercase">
                                                <Users className="h-4 w-4" />
                                                Assetto del Party
                                            </h3>
                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="border-2 border-black bg-white p-3 text-center">
                                                    <p className="text-xs font-black uppercase text-gray-500">Occupati</p>
                                                    <p className="mt-2 text-2xl font-black">{participantCount}</p>
                                                </div>
                                                <div className="border-2 border-black bg-white p-3 text-center">
                                                    <p className="text-xs font-black uppercase text-gray-500">Liberi</p>
                                                    <p className="mt-2 text-2xl font-black">{availableSlots}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-2 border-black bg-neo-pink p-5 text-white">
                                            <h3 className="flex items-center gap-2 text-sm font-black uppercase">
                                                <Sparkles className="h-4 w-4" />
                                                Tono di Gioco
                                            </h3>
                                            <p className="mt-4 text-sm font-medium leading-relaxed text-white/90">
                                                {tags.length > 0
                                                    ? 'Tag e parole chiave aiutano a capire atmosfera, ritmo e focus della campagna.'
                                                    : 'Il master non ha ancora definito tag di atmosfera; usa trama e regole per farti un’idea del tavolo.'}
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {tags.length > 0 ? (
                                                    tags.map((tag) => (
                                                        <span key={tag} className="border-2 border-black bg-white px-2 py-1 text-xs font-black uppercase text-black">
                                                            {tag}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="border-2 border-black bg-white px-2 py-1 text-xs font-black uppercase text-black">
                                                        Nessun tag
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t-2 border-dashed border-black pt-8">
                                    <h2 className="flex items-center gap-3 text-2xl font-black uppercase">
                                        <Scroll className="h-6 w-6 text-neo-pink" />
                                        Note del Mondo
                                    </h2>

                                    {loreNotes.length === 0 ? (
                                        <div className="mt-5 border-2 border-dashed border-black bg-neo-bg p-8 text-center">
                                            <p className="font-black uppercase text-gray-500">Nessuna nota narrativa pubblicata</p>
                                            <p className="mt-2 text-sm font-medium text-gray-600">
                                                Quando il master carichera lore, NPC, location o loot, compariranno qui.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="mt-5 grid gap-4 lg:grid-cols-3">
                                            {loreNotes.map((note) => (
                                                <article key={note.id} className="border-2 border-black bg-neo-bg p-5 shadow-neo-sm">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span className="border-2 border-black bg-white px-2 py-1 text-xs font-black uppercase">
                                                            {note.type}
                                                        </span>
                                                        <span className="text-[11px] font-bold uppercase text-gray-500">
                                                            {formatShortDate(note.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="mt-4 text-sm font-medium leading-relaxed text-gray-700">
                                                        {note.content}
                                                    </p>
                                                </article>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'sessions' && (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-3 border-b-2 border-black pb-5 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <h2 className="flex items-center gap-3 text-2xl font-black uppercase">
                                            <Swords className="h-6 w-6 text-neo-pink" />
                                            Registro Sessioni
                                        </h2>
                                        <p className="mt-2 text-sm font-medium text-gray-600">
                                            Cronologia delle sessioni giocate, utile per tenere allineati party, trama e stato dell’avventura.
                                        </p>
                                    </div>
                                    <div className="border-2 border-black bg-neo-yellow px-4 py-2 text-sm font-black uppercase shadow-neo-sm">
                                        {campaign.sessions?.length || 0} sessioni archiviate
                                    </div>
                                </div>

                                {campaign.sessions && campaign.sessions.length > 0 ? (
                                    <div className="space-y-4">
                                        {campaign.sessions.map((session) => (
                                            <SessionItem key={session.id} session={session} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-black bg-neo-bg p-10 text-center">
                                        <p className="font-black uppercase text-gray-500">Diario ancora vuoto</p>
                                        <p className="mt-2 text-sm font-medium text-gray-600">
                                            Le sessioni compariranno qui non appena il tavolo iniziera a giocare o il DM carichera il primo resoconto.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'party' && (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-3 border-b-2 border-black pb-5 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <h2 className="flex items-center gap-3 text-2xl font-black uppercase">
                                            <Users className="h-6 w-6 text-neo-cyan" />
                                            Compagnia Attuale
                                        </h2>
                                        <p className="mt-2 text-sm font-medium text-gray-600">
                                            Il party mostra chi e gia dentro la campagna, con accesso rapido alle schede personaggio.
                                        </p>
                                    </div>
                                    <div className="border-2 border-black bg-neo-cyan px-4 py-2 text-sm font-black uppercase shadow-neo-sm">
                                        {participantCount}/{maxPlayers} al tavolo
                                    </div>
                                </div>

                                {participantCount > 0 ? (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {participants.map((participant) => (
                                            <div key={participant.id} className="space-y-3">
                                                <div className="flex items-center justify-between rounded-sm border-2 border-black bg-neo-bg px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={getAvatarUrl(participant.user.avatar) || '/default-avatar.svg'}
                                                            alt={participant.user.name}
                                                            className="h-12 w-12 border-2 border-black bg-white object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-black uppercase">{participant.user.name}</p>
                                                            <p className="text-xs font-bold uppercase text-gray-500">
                                                                Entrato il {formatShortDate(participant.joinedAt)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {participant.user.id === campaign.dm?.id && (
                                                        <span className="border-2 border-black bg-neo-yellow px-2 py-1 text-xs font-black uppercase">
                                                            DM
                                                        </span>
                                                    )}
                                                </div>

                                                <CharacterCard
                                                    character={participant.character}
                                                    onClick={() => setSelectedCharacter(participant.character)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-black bg-neo-bg p-10 text-center">
                                        <p className="font-black uppercase text-gray-500">Nessun personaggio nel party</p>
                                        <p className="mt-2 text-sm font-medium text-gray-600">
                                            Appena il master approvera le prime richieste, qui compariranno i personaggi del gruppo.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'requests' && isDm && (
                            <div className="space-y-6">
                                <div className="flex flex-col gap-3 border-b-2 border-black pb-5 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <h2 className="flex items-center gap-3 text-2xl font-black uppercase">
                                            <MessageSquare className="h-6 w-6 text-neo-violet" />
                                            Richieste di Ingresso
                                        </h2>
                                        <p className="mt-2 text-sm font-medium text-gray-600">
                                            Qui il Dungeon Master valuta candidati, personaggi proposti e messaggi di presentazione.
                                        </p>
                                    </div>
                                    <div className="border-2 border-black bg-neo-pink px-4 py-2 text-sm font-black uppercase text-white shadow-neo-sm">
                                        {pendingRequests.length} pendenti
                                    </div>
                                </div>

                                {pendingRequests.length === 0 ? (
                                    <div className="border-2 border-dashed border-black bg-neo-bg p-10 text-center">
                                        <p className="font-black uppercase text-gray-500">Nessuna richiesta da esaminare</p>
                                        <p className="mt-2 text-sm font-medium text-gray-600">
                                            Quando arriveranno nuove candidature, compariranno in questa sezione con azioni di approvazione e rifiuto.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingRequests.map((request) => (
                                            <article key={request.id} className="border-2 border-black bg-neo-bg p-5 shadow-neo-sm">
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <img
                                                            src={getAvatarUrl(request.user.avatar) || '/default-avatar.svg'}
                                                            alt={request.user.name}
                                                            className="h-14 w-14 border-2 border-black bg-white object-cover"
                                                        />
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="font-black uppercase">{request.user.name}</p>
                                                                <span className="border-2 border-black bg-white px-2 py-1 text-[11px] font-black uppercase">
                                                                    {REQUEST_STATUS_LABELS[request.status] || request.status}
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-sm font-bold uppercase text-gray-600">
                                                                {request.character.name} • {request.character.race} {request.character.class} • Livello {request.character.level}
                                                            </p>
                                                            <p className="mt-1 text-xs font-bold uppercase text-gray-500">
                                                                Inviata il {formatShortDate(request.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-3 lg:min-w-[240px]">
                                                        <button
                                                            onClick={() => handleRequestAction(request.id, 'approve')}
                                                            disabled={activeRequestId === request.id}
                                                            className="flex-1 border-2 border-black bg-black px-4 py-3 font-black uppercase text-white shadow-neo-sm transition-all hover:bg-neo-lime hover:text-black disabled:opacity-50"
                                                        >
                                                            Approva
                                                        </button>
                                                        <button
                                                            onClick={() => handleRequestAction(request.id, 'reject')}
                                                            disabled={activeRequestId === request.id}
                                                            className="flex-1 border-2 border-black bg-white px-4 py-3 font-black uppercase shadow-neo-sm transition-all hover:bg-red-500 hover:text-white disabled:opacity-50"
                                                        >
                                                            Rifiuta
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-4 border-2 border-black bg-white p-4">
                                                    <p className="text-xs font-black uppercase text-gray-500">Messaggio al DM</p>
                                                    <p className="mt-2 text-sm font-medium leading-relaxed text-gray-700">
                                                        {request.message?.trim() || 'Nessun messaggio allegato alla candidatura.'}
                                                    </p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CampaignDetailsPage;
