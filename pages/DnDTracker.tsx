import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    ChevronRight,
    Crown,
    Dice5,
    ExternalLink,
    FileText,
    Flame,
    Loader2,
    Map,
    PenTool,
    Plus,
    Scroll,
    Shield,
    Sparkles,
    Sword,
    UserPlus,
    Users,
    Wand2,
    X
} from 'lucide-react';
import { Campaign, Character } from '@/types';
import api from '../services/api';
import { useCampaigns } from '../contexts/CampaignContext';
import { useToast } from '../contexts/ToastContext';
import { useUser } from '../contexts/UserContext';
import EditCharacterModal from '../components/features/dnd/EditCharacterModal';
import { getAvatarUrl } from '../utils/url';

type ViewMode = 'my_campaigns' | 'all' | 'board';
type CreateMode = 'dm' | 'proposal' | null;

const statusStyles: Record<string, string> = {
    RECRUITING: 'bg-neo-lime text-black',
    ACTIVE: 'bg-neo-cyan text-black',
    PAUSED: 'bg-neo-yellow text-black',
    COMPLETED: 'bg-zinc-800 text-white'
};

const campaignTypeLabel: Record<Campaign['type'], string> = {
    ONE_SHOT: 'One-Shot',
    SHORT_CAMPAIGN: 'Campagna Breve',
    LONG_CAMPAIGN: 'Campagna Lunga'
};

const viewMeta: Record<ViewMode, { title: string; description: string; accent: string; icon: React.ElementType }> = {
    all: {
        title: 'Avventure In Corso',
        description: 'Campagne attive, tavoli in recruiting e schede avventura pronte da aprire.',
        accent: 'bg-neo-cyan',
        icon: Sword
    },
    my_campaigns: {
        title: 'Le Tue Cronache',
        description: 'Le avventure in cui sei DM o giocatore, con accesso rapido al tuo personaggio.',
        accent: 'bg-neo-pink',
        icon: Crown
    },
    board: {
        title: 'Bacheca delle Quest',
        description: 'La mission board della community: concept, call per DM e nuove spedizioni da far nascere.',
        accent: 'bg-neo-yellow',
        icon: FileText
    }
};

const DnDTracker: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { campaigns, loading, refreshCampaigns } = useCampaigns();
    const { showToast } = useToast();

    const [viewMode, setViewMode] = useState<ViewMode>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createMode, setCreateMode] = useState<CreateMode>(null);
    const [editingChar, setEditingChar] = useState<Character | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [newCampaignData, setNewCampaignData] = useState({
        title: '',
        description: '',
        system: 'D&D 5e',
        minPlayers: 3,
        maxPlayers: 5,
        rules: '',
        plot: '',
        frequency: 'Weekly',
        sessionDuration: '3-4 hours'
    });

    const myCampaigns = campaigns.filter(campaign =>
        campaign.dm.id === user?.id || campaign.participants.some(participant => participant.user.id === user?.id)
    );
    const proposals = campaigns.filter(campaign => campaign.isProposal);
    const activeCampaigns = campaigns.filter(campaign => !campaign.isProposal);
    const recruitingCampaigns = activeCampaigns.filter(campaign => campaign.status === 'RECRUITING');
    const openSeats = activeCampaigns.reduce((sum, campaign) => {
        const occupied = campaign.participants?.length ?? campaign._count?.participants ?? 0;
        const remaining = Math.max((campaign.maxPlayers || 0) - occupied, 0);
        return sum + remaining;
    }, 0);

    const filteredCampaigns = viewMode === 'my_campaigns'
        ? myCampaigns
        : viewMode === 'board'
            ? proposals
            : activeCampaigns;

    const currentView = viewMeta[viewMode];

    const getPlayerCharacter = (campaign: Campaign) =>
        campaign.participants.find(participant => participant.user.id === user?.id)?.character;

    const openCampaign = (campaignId: string) => {
        navigate(`/campaigns/${campaignId}`);
    };

    const openCreationFlow = (mode?: CreateMode) => {
        setCreateMode(mode ?? null);
        setShowCreateModal(true);
    };

    const resetCreationForm = () => {
        setCreateMode(null);
        setShowCreateModal(false);
        setNewCampaignData({
            title: '',
            description: '',
            system: 'D&D 5e',
            minPlayers: 3,
            maxPlayers: 5,
            rules: '',
            plot: '',
            frequency: 'Weekly',
            sessionDuration: '3-4 hours'
        });
    };

    const handleCreateCampaign = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!createMode || !user) {
            showToast('Sessione non valida. Effettua di nuovo l’accesso.', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post<Campaign>('/campaigns', {
                ...newCampaignData,
                isProposal: createMode === 'proposal',
                proposerId: user.id,
                dmId: createMode === 'dm' ? user.id : undefined
            });

            await refreshCampaigns();
            resetCreationForm();
            showToast(
                createMode === 'proposal' ? 'Annuncio pubblicato in bacheca.' : 'Campagna creata correttamente.',
                'success'
            );
            openCampaign(response.data.id);
        } catch (error) {
            console.error('Failed to create campaign:', error);
            showToast('Errore durante la creazione della campagna.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditCharacter = (campaign: Campaign) => {
        const character = getPlayerCharacter(campaign);
        if (!character) {
            showToast('Non hai un personaggio associato a questa campagna.', 'info');
            return;
        }

        setEditingChar(character);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <Loader2 className="w-12 h-12 animate-spin text-black" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f1ea] text-black pb-20">
            <section className="relative overflow-hidden border-b-4 border-black bg-[#111113] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.3),_transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(6,182,212,0.25),_transparent_26%),linear-gradient(135deg,_rgba(255,255,255,0.05)_0%,_rgba(255,255,255,0)_40%)]" />
                <div className="absolute -right-12 top-8 h-56 w-56 rounded-full border-[18px] border-white/10" />
                <div className="absolute left-[-48px] bottom-[-70px] h-44 w-44 rotate-12 border-[14px] border-neo-yellow/40 bg-neo-yellow/10" />
                <div className="absolute right-[18%] bottom-10 opacity-10">
                    <Dice5 className="h-48 w-48 rotate-12" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
                    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
                        <div>
                            <div className="mb-5 inline-flex items-center gap-2 border-2 border-white/60 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] backdrop-blur-sm">
                                <Sparkles className="h-4 w-4 text-neo-yellow" />
                                Adventurer Hub
                            </div>

                            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] md:text-7xl xl:text-8xl">
                                D&amp;D <span className="bg-gradient-to-r from-neo-yellow via-neo-pink to-neo-cyan bg-clip-text text-transparent">Tracker</span>
                            </h1>

                            <p className="mt-5 max-w-3xl text-lg font-bold leading-relaxed text-zinc-200 md:text-2xl">
                                Raduna il party, trova il master e apri la prossima avventura. Questa sezione ora parla davvero il linguaggio di campagne, quest, recruiting e cronache di tavolo.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                <button
                                    onClick={() => openCreationFlow('dm')}
                                    className="inline-flex items-center justify-center gap-2 border-2 border-black bg-neo-lime px-6 py-4 font-black uppercase text-black shadow-neo hover:-translate-y-1 transition-transform"
                                >
                                    <Crown className="h-5 w-5" /> Crea una campagna
                                </button>
                                <button
                                    onClick={() => {
                                        setViewMode('board');
                                        openCreationFlow('proposal');
                                    }}
                                    className="inline-flex items-center justify-center gap-2 border-2 border-white bg-transparent px-6 py-4 font-black uppercase text-white hover:bg-white hover:text-black transition-colors"
                                >
                                    <FileText className="h-5 w-5" /> Pubblica in bacheca
                                </button>
                                <a
                                    href="https://dnd.wizards.com/it/how-to-play"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 border-2 border-white/60 bg-white/10 px-6 py-4 font-black uppercase text-white backdrop-blur-sm hover:bg-white hover:text-black transition-colors"
                                >
                                    Come Giocare <ExternalLink className="h-5 w-5" />
                                </a>
                            </div>

                            <div className="mt-10 grid gap-4 md:grid-cols-3">
                                {[
                                    {
                                        label: 'Campagne Attive',
                                        value: activeCampaigns.length,
                                        accent: 'bg-neo-cyan',
                                        icon: Sword
                                    },
                                    {
                                        label: 'Posti Liberi',
                                        value: openSeats,
                                        accent: 'bg-neo-lime',
                                        icon: Users
                                    },
                                    {
                                        label: 'Quest in Bacheca',
                                        value: proposals.length,
                                        accent: 'bg-neo-yellow',
                                        icon: Scroll
                                    }
                                ].map(item => (
                                    <div key={item.label} className="border-2 border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className={`inline-flex h-11 w-11 items-center justify-center border-2 border-black ${item.accent}`}>
                                                <item.icon className="h-5 w-5 text-black" />
                                            </span>
                                            <span className="text-4xl font-black leading-none">{item.value}</span>
                                        </div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="border-4 border-black bg-[#f4ead7] p-5 text-black shadow-neo">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-xs font-black uppercase tracking-[0.24em]">Guild Ledger</p>
                                    <Wand2 className="h-5 w-5" />
                                </div>
                                <div className="space-y-3">
                                    {[
                                        `Hai ${myCampaigns.length} avventure nel tuo registro.`,
                                        `${recruitingCampaigns.length} tavoli stanno cercando giocatori in questo momento.`,
                                        `${proposals.length} idee community stanno aspettando un DM o un party.`
                                    ].map(text => (
                                        <div key={text} className="flex items-start gap-3 border-2 border-black bg-white p-3">
                                            <span className="mt-1 h-3 w-3 shrink-0 border border-black bg-neo-pink" />
                                            <p className="text-sm font-bold leading-relaxed">{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                                {[
                                    {
                                        title: 'Scopri',
                                        text: 'Apri una scheda avventura completa con party, note e stato campagna.',
                                        icon: Map,
                                        accent: 'bg-neo-pink'
                                    },
                                    {
                                        title: 'Candidati',
                                        text: 'Usa la campagna per inviare una richiesta con personaggio e messaggio al DM.',
                                        icon: UserPlus,
                                        accent: 'bg-neo-cyan'
                                    },
                                    {
                                        title: 'Traccia',
                                        text: 'Se partecipi, puoi aggiornare il tuo personaggio e seguire la cronaca.',
                                        icon: Shield,
                                        accent: 'bg-neo-yellow'
                                    }
                                ].map(item => (
                                    <div key={item.title} className="border-2 border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                        <div className={`mb-4 inline-flex border-2 border-black p-3 ${item.accent}`}>
                                            <item.icon className="h-5 w-5 text-black" />
                                        </div>
                                        <h2 className="mb-2 text-xl font-black uppercase">{item.title}</h2>
                                        <p className="text-sm font-medium leading-relaxed text-zinc-200">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
                <div className="mb-8 border-4 border-black bg-white shadow-neo">
                    <div className="flex flex-col gap-5 border-b-2 border-black px-5 py-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'all', label: 'Avventure', icon: Sword },
                                { id: 'my_campaigns', label: 'Le Mie Cronache', icon: Crown },
                                { id: 'board', label: 'Bacheca', icon: FileText }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setViewMode(tab.id as ViewMode)}
                                    className={`inline-flex items-center gap-2 border-2 border-black px-4 py-3 font-black uppercase transition-all ${viewMode === tab.id ? 'bg-black text-white shadow-neo-sm translate-y-1' : 'bg-white hover:bg-zinc-100 hover:-translate-y-1'}`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => openCreationFlow()}
                            className="inline-flex items-center justify-center gap-2 border-2 border-black bg-neo-violet px-5 py-3 font-black uppercase text-white shadow-neo hover:-translate-y-1 transition-transform"
                        >
                            <Plus className="h-5 w-5" /> Nuova avventura
                        </button>
                    </div>

                    <div className="grid gap-4 px-5 py-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                        <div className={`inline-flex h-14 w-14 items-center justify-center border-2 border-black ${currentView.accent}`}>
                            <currentView.icon className="h-7 w-7 text-black" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase">{currentView.title}</h2>
                            <p className="mt-1 max-w-3xl font-medium text-zinc-600">{currentView.description}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-black uppercase md:text-right">
                            <span className="border border-black bg-zinc-100 px-2 py-2">{filteredCampaigns.length} card visibili</span>
                            <span className="border border-black bg-zinc-100 px-2 py-2">{recruitingCampaigns.length} in recruiting</span>
                        </div>
                    </div>
                </div>

                {viewMode === 'board' && (
                    <section className="mb-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="border-4 border-black bg-[#f6e8c8] p-6 shadow-neo relative overflow-hidden">
                            <div className="absolute right-4 top-4 rotate-6 border-2 border-black bg-neo-pink px-3 py-1 text-xs font-black uppercase text-white">
                                Mission Board
                            </div>
                            <h3 className="max-w-2xl text-3xl font-black uppercase leading-tight">
                                La Bacheca non è una lista generica: è il luogo dove la community lancia idee, cerca un DM o prova a far nascere la prossima campagna.
                            </h3>
                            <p className="mt-4 max-w-3xl font-medium leading-relaxed text-zinc-700">
                                Qui mettiamo annunci ancora “in formazione”: proposte narrative, call aperte, richieste di regia e concept che devono trasformarsi in vere schede avventura.
                            </p>

                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                {[
                                    {
                                        title: 'Cerco un DM',
                                        text: 'Hai un concept ma non vuoi o non puoi masterarlo. Pubblichi un annuncio e aspetti candidature.',
                                        accent: 'bg-neo-yellow'
                                    },
                                    {
                                        title: 'Cerco Giocatori',
                                        text: 'Sei il master e vuoi testare interesse o reclutare prima di costruire la campagna completa.',
                                        accent: 'bg-neo-lime'
                                    },
                                    {
                                        title: 'Propongo un Concept',
                                        text: 'Pitch rapido, tono, sistema e hook narrativo. La community vota l’interesse tramite richieste.',
                                        accent: 'bg-neo-cyan'
                                    }
                                ].map(item => (
                                    <div key={item.title} className="border-2 border-black bg-white p-4">
                                        <div className={`mb-3 inline-block border-2 border-black px-2 py-1 text-[10px] font-black uppercase ${item.accent}`}>
                                            Formato Bacheca
                                        </div>
                                        <h4 className="text-lg font-black uppercase">{item.title}</h4>
                                        <p className="mt-2 text-sm font-medium text-zinc-700">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <button
                                onClick={() => openCreationFlow('proposal')}
                                className="border-4 border-black bg-neo-yellow p-5 text-left shadow-neo hover:-translate-y-1 transition-transform"
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <FileText className="h-6 w-6" />
                                    <span className="text-xs font-black uppercase tracking-[0.24em]">Pubblica un annuncio</span>
                                </div>
                                <p className="text-2xl font-black uppercase">Cerco DM / Propongo Campagna</p>
                                <p className="mt-2 font-medium">Usa la bacheca per far partire un’idea ancora non strutturata come campagna completa.</p>
                            </button>

                            <button
                                onClick={() => openCreationFlow('dm')}
                                className="border-4 border-black bg-neo-lime p-5 text-left shadow-neo hover:-translate-y-1 transition-transform"
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <Crown className="h-6 w-6" />
                                    <span className="text-xs font-black uppercase tracking-[0.24em]">Apri un tavolo vero</span>
                                </div>
                                <p className="text-2xl font-black uppercase">Crea la scheda campagna</p>
                                <p className="mt-2 font-medium">Se sei già pronto a masterare, salta la bacheca e pubblica direttamente una campagna completa.</p>
                            </button>
                        </div>
                    </section>
                )}

                {filteredCampaigns.length === 0 ? (
                    <div className="border-4 border-black bg-white p-10 text-center shadow-neo">
                        <h2 className="text-3xl font-black uppercase mb-3">Qui il tavolo è ancora vuoto</h2>
                        <p className="mx-auto max-w-2xl font-medium text-zinc-600">
                            Cambia filtro oppure pubblica una nuova avventura. La bacheca è pensata per far nascere idee, non per lasciarle ferme.
                        </p>
                    </div>
                ) : (
                    <div className={`grid gap-6 md:gap-8 ${viewMode === 'board' ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
                        {filteredCampaigns.map((campaign, index) => {
                            const playerCharacter = getPlayerCharacter(campaign);
                            const isDm = campaign.dm.id === user?.id;
                            const isJoined = Boolean(playerCharacter);
                            const participantCount = campaign.participants?.length ?? campaign._count?.participants ?? 0;
                            const openSlots = Math.max((campaign.maxPlayers || 0) - participantCount, 0);

                            if (viewMode === 'board') {
                                return (
                                    <article
                                        key={campaign.id}
                                        className={`relative flex h-full flex-col border-4 border-black bg-[#fff7df] p-5 shadow-neo transition-transform hover:-translate-y-2 ${index % 2 === 0 ? 'md:rotate-[-1deg]' : 'md:rotate-[1deg]'}`}
                                    >
                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                            <span className="border-2 border-black bg-neo-yellow px-2 py-1 text-[10px] font-black uppercase">Cercasi DM</span>
                                            <span className="border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase">{campaign.system}</span>
                                            <span className="border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase">{campaignTypeLabel[campaign.type]}</span>
                                        </div>

                                        <h3 className="text-3xl font-black uppercase leading-none">{campaign.title}</h3>
                                        <p className="mt-4 flex-1 text-sm font-medium leading-relaxed text-zinc-700">{campaign.description}</p>

                                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-bold">
                                            <div className="border-2 border-black bg-white p-3">
                                                <div className="text-[10px] uppercase text-zinc-500 mb-1">Interessati</div>
                                                <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {campaign._count?.requests || 0}</div>
                                            </div>
                                            <div className="border-2 border-black bg-white p-3">
                                                <div className="text-[10px] uppercase text-zinc-500 mb-1">Frequenza</div>
                                                <div>{campaign.frequency}</div>
                                            </div>
                                        </div>

                                        <div className="mt-5 border-2 border-dashed border-black bg-black/5 p-3">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Pitch Community</div>
                                            <p className="mt-1 text-sm font-bold">
                                                Concept proposto da {campaign.proposer?.name || 'community'} per far nascere una nuova spedizione.
                                            </p>
                                        </div>

                                        <div className="mt-5 flex flex-col gap-3">
                                            <button
                                                onClick={() => openCampaign(campaign.id)}
                                                className="flex items-center justify-center gap-2 border-2 border-black bg-black px-4 py-3 font-black uppercase text-white hover:bg-neo-pink transition-colors"
                                            >
                                                Apri Annuncio <ChevronRight className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => openCreationFlow('proposal')}
                                                className="flex items-center justify-center gap-2 border-2 border-black bg-white px-4 py-3 font-black uppercase hover:bg-neo-yellow transition-colors"
                                            >
                                                <Sparkles className="h-4 w-4" /> Pubblica qualcosa di simile
                                            </button>
                                        </div>
                                    </article>
                                );
                            }

                            return (
                                <article
                                    key={campaign.id}
                                    className="group relative flex h-full flex-col overflow-hidden border-4 border-black bg-white shadow-neo transition-transform duration-300 hover:-translate-y-2 hover:shadow-neo-xl"
                                >
                                    <div className="relative h-56 overflow-hidden border-b-4 border-black">
                                        <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase">
                                            {campaignTypeLabel[campaign.type]}
                                        </div>
                                        <div className={`absolute right-4 top-4 border-2 border-black px-3 py-1 text-[10px] font-black uppercase ${statusStyles[campaign.status] || 'bg-white text-black'}`}>
                                            {campaign.status}
                                        </div>
                                        <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                                            <span className="border-2 border-black bg-neo-pink px-2 py-1 text-[10px] font-black uppercase text-white">{campaign.system}</span>
                                            <span className="border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase">{campaign.levelRange}</span>
                                            <span className="border-2 border-black bg-white px-2 py-1 text-[10px] font-black uppercase">{campaign.frequency}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-1 flex-col gap-5 p-6">
                                        <div>
                                            <div className="mb-2 inline-flex items-center gap-2 border border-black bg-zinc-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                                <Flame className="h-3 w-3" /> {campaign.status === 'RECRUITING' ? 'Tavolo Aperto' : 'Campagna In Corso'}
                                            </div>
                                            <h3 className="text-3xl font-black uppercase leading-tight">{campaign.title}</h3>
                                            <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-600 line-clamp-4">{campaign.description}</p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="border-2 border-black bg-[#f5f1ea] p-3">
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Party</div>
                                                <div className="mt-1 flex items-center gap-2 text-sm font-black">
                                                    <Users className="h-4 w-4" /> {participantCount}/{campaign.maxPlayers || 4}
                                                </div>
                                                <div className="mt-1 text-xs font-medium text-zinc-600">{openSlots} slot disponibili</div>
                                            </div>
                                            <div className="border-2 border-black bg-[#f5f1ea] p-3">
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Ritmo</div>
                                                <div className="mt-1 text-sm font-black">{campaign.sessionDuration || '3-4 hours'}</div>
                                                <div className="mt-1 text-xs font-medium text-zinc-600">{campaign.platform || 'In Person'}</div>
                                            </div>
                                        </div>

                                        <div className="border-2 border-black bg-white p-3 flex items-center gap-3">
                                            <img
                                                src={getAvatarUrl(campaign.dm.avatar) || '/default-avatar.svg'}
                                                alt={campaign.dm.name}
                                                className="h-12 w-12 border-2 border-black object-cover bg-zinc-100"
                                            />
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Dungeon Master</div>
                                                <div className="truncate text-lg font-black">{campaign.dm.name}</div>
                                            </div>
                                        </div>

                                        {(isDm || isJoined) && (
                                            <div className="border-2 border-black bg-neo-cyan/15 p-3">
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">La tua posizione</div>
                                                <div className="font-black">
                                                    {isDm ? 'Sei il Dungeon Master di questo tavolo.' : `${playerCharacter?.name} · ${playerCharacter?.class} Lv.${playerCharacter?.level}`}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                                            <button
                                                onClick={() => openCampaign(campaign.id)}
                                                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-black bg-black px-4 py-3 font-black uppercase text-white hover:bg-neo-pink transition-colors"
                                            >
                                                Apri scheda avventura <ChevronRight className="h-4 w-4" />
                                            </button>
                                            {isJoined && (
                                                <button
                                                    onClick={() => handleEditCharacter(campaign)}
                                                    className="inline-flex items-center justify-center gap-2 border-2 border-black bg-neo-cyan px-4 py-3 font-black uppercase hover:bg-neo-lime transition-colors"
                                                >
                                                    <PenTool className="h-4 w-4" /> Modifica PG
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </main>

            {showCreateModal && (
                <div className="app-modal-shell bg-black/80 animate-in fade-in">
                    <div className="app-modal-panel max-w-2xl">
                        {!createMode ? (
                            <div className="p-8 text-center space-y-8">
                                <h2 className="text-4xl font-black uppercase">Scegli il tuo ruolo nella gilda</h2>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <button
                                        onClick={() => setCreateMode('dm')}
                                        className="border-4 border-black p-8 shadow-neo transition-all hover:-translate-y-1 hover:bg-neo-violet hover:text-white"
                                    >
                                        <Crown className="mx-auto mb-4 h-16 w-16" />
                                        <h3 className="text-2xl font-black uppercase">Sono un DM</h3>
                                        <p className="mt-2 font-medium text-zinc-500 hover:text-inherit">
                                            Apro un tavolo completo con regole, tono e recruiting strutturato.
                                        </p>
                                    </button>
                                    <button
                                        onClick={() => setCreateMode('proposal')}
                                        className="border-4 border-black p-8 shadow-neo transition-all hover:-translate-y-1 hover:bg-neo-yellow"
                                    >
                                        <Sparkles className="mx-auto mb-4 h-16 w-16" />
                                        <h3 className="text-2xl font-black uppercase">Ho un concept</h3>
                                        <p className="mt-2 font-medium text-zinc-500">
                                            Pubblico in bacheca un’idea che deve ancora trovare DM, party o forma definitiva.
                                        </p>
                                    </button>
                                </div>
                                <button
                                    onClick={resetCreationForm}
                                    className="mx-auto block font-bold text-zinc-500 underline"
                                >
                                    Annulla
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateCampaign} className="app-modal-body space-y-6 p-5 md:p-8">
                                <div className="app-modal-header mb-6 flex items-center justify-between border-b-4 border-black pb-4 bg-white">
                                    <h2 className="text-3xl font-black uppercase">
                                        {createMode === 'dm' ? 'Nuova Campagna' : 'Nuovo Annuncio in Bacheca'}
                                    </h2>
                                    <button type="button" onClick={resetCreationForm}>
                                        <X className="h-8 w-8" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-black uppercase">Titolo</label>
                                        <input
                                            required
                                            value={newCampaignData.title}
                                            onChange={event => setNewCampaignData({ ...newCampaignData, title: event.target.value })}
                                            className="w-full border-2 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-black uppercase">Descrizione / Hook Narrativo</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={newCampaignData.description}
                                            onChange={event => setNewCampaignData({ ...newCampaignData, description: event.target.value })}
                                            className="w-full border-2 border-black p-3 focus:outline-none focus:shadow-neo"
                                            placeholder={createMode === 'proposal' ? 'Pitch rapido dell’idea, tono e cosa cerchi dalla community...' : 'Concept della campagna, premessa narrativa e target del tavolo...'}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-black uppercase">Sistema</label>
                                            <select
                                                value={newCampaignData.system}
                                                onChange={event => setNewCampaignData({ ...newCampaignData, system: event.target.value })}
                                                className="w-full border-2 border-black p-3 font-bold focus:outline-none"
                                            >
                                                <option>D&amp;D 5e</option>
                                                <option>Pathfinder 2e</option>
                                                <option>Cyberpunk Red</option>
                                                <option>Call of Cthulhu</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-black uppercase">Frequenza</label>
                                            <select
                                                value={newCampaignData.frequency}
                                                onChange={event => setNewCampaignData({ ...newCampaignData, frequency: event.target.value })}
                                                className="w-full border-2 border-black p-3 font-bold focus:outline-none"
                                            >
                                                <option>Weekly</option>
                                                <option>Bi-weekly</option>
                                                <option>Monthly</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-black uppercase">Min Giocatori</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={newCampaignData.minPlayers}
                                                onChange={event => setNewCampaignData({ ...newCampaignData, minPlayers: parseInt(event.target.value, 10) || 1 })}
                                                className="w-full border-2 border-black p-3 font-bold focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-black uppercase">Max Giocatori</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={newCampaignData.maxPlayers}
                                                onChange={event => setNewCampaignData({ ...newCampaignData, maxPlayers: parseInt(event.target.value, 10) || 1 })}
                                                className="w-full border-2 border-black p-3 font-bold focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {createMode === 'dm' && (
                                        <div className="space-y-4 border-t-2 border-dashed border-zinc-300 pt-4">
                                            <div className="border-2 border-black bg-neo-lime/20 p-4">
                                                <h4 className="mb-3 flex items-center gap-2 text-sm font-black uppercase">
                                                    <PenTool className="h-4 w-4" /> Strumenti del Dungeon Master
                                                </h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="mb-1 block text-xs font-bold uppercase">Regole del Tavolo</label>
                                                        <textarea
                                                            value={newCampaignData.rules}
                                                            onChange={event => setNewCampaignData({ ...newCampaignData, rules: event.target.value })}
                                                            className="w-full border border-black bg-white p-2 text-sm"
                                                            rows={3}
                                                            placeholder="- Rispetto reciproco&#10;- Sessione zero obbligatoria"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-bold uppercase">Durata Sessione</label>
                                                        <input
                                                            value={newCampaignData.sessionDuration}
                                                            onChange={event => setNewCampaignData({ ...newCampaignData, sessionDuration: event.target.value })}
                                                            className="w-full border border-black p-2 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-bold uppercase">Plot</label>
                                                        <textarea
                                                            value={newCampaignData.plot}
                                                            onChange={event => setNewCampaignData({ ...newCampaignData, plot: event.target.value })}
                                                            className="w-full border border-black bg-white p-2 text-sm"
                                                            rows={3}
                                                            placeholder="Hook narrativo, minacce principali, tono, ritmo della campagna."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="app-modal-footer">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex w-full items-center justify-center gap-2 border-2 border-black bg-black py-4 text-xl font-black uppercase text-white shadow-neo transition-all hover:translate-y-1 hover:bg-zinc-800 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                    >
                                        {submitting ? 'Salvataggio...' : (
                                            <>
                                                {createMode === 'dm' ? 'Crea Campagna' : 'Pubblica Annuncio'}
                                                <ChevronRight className="h-6 w-6" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {editingChar && (
                <EditCharacterModal
                    character={editingChar}
                    isOpen
                    onClose={() => setEditingChar(null)}
                    onUpdate={() => {
                        refreshCampaigns();
                    }}
                />
            )}
        </div>
    );
};

export default DnDTracker;
