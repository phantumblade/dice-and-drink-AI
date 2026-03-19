import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Coffee, Dice6, Shield, ShoppingBag, Swords, UserPlus, Beer, Gamepad2, Trophy, Star, Lightbulb, Users, Crown, Scroll, Target, Sparkles, Zap } from 'lucide-react';

const Home: React.FC = () => {
    const openRegisterModal = () => {
        window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'register' } }));
    };

    return (
        <div className="flex flex-col font-sans text-black">
            {/* Hero Section */}
            <section className="relative min-h-[700px] flex items-center border-b-2 border-black bg-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-16 py-20">

                    <div className="md:w-1/2 text-left relative">
                        <div className="inline-block bg-neo-lime border-2 border-black px-4 py-1 font-bold shadow-neo mb-6 transform -rotate-2">
                            APERTO FINO ALLE 2 DI NOTTE
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-2 leading-[0.85] tracking-tighter uppercase">
                            Roll <span className="text-neo-violet">Once</span>,<br />
                            Drink <span className="text-neo-pink">Twice</span>.
                        </h1>

                        <p className="text-lg sm:text-xl font-bold mb-8 max-w-lg mt-6 text-gray-800">
                            Il ritrovo definitivo per giochi da tavolo, campagne D&D e cocktail artigianali. Nessuna prenotazione richiesta per il caos.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/catalog"
                                className="bg-black text-white border-2 border-black px-8 py-4 font-black text-lg shadow-neo hover:bg-neo-violet hover:shadow-neo-hover hover:translate-y-1 transition-all flex items-center justify-center gap-2 group uppercase"
                            >
                                Esplora i Giochi <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/booking"
                                className="bg-white text-black border-2 border-black px-8 py-4 font-black text-lg shadow-neo hover:bg-neo-cyan hover:shadow-neo-hover hover:translate-y-1 transition-all uppercase"
                            >
                                Prenota Tavolo
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 relative">
                        <div className="absolute inset-0 bg-neo-pink translate-x-4 translate-y-4 border-2 border-black"></div>
                        <img
                            src="https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=800&auto=format&fit=crop"
                            alt="Amici che giocano a Catan"
                            className="relative w-full border-2 border-black grayscale hover:grayscale-0 transition-all duration-500 z-10"
                        />
                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 bg-neo-yellow border-2 border-black p-4 z-20 shadow-neo rotate-3">
                            <Dice6 className="w-8 h-8" />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-neo-cyan border-2 border-black p-4 z-20 shadow-neo -rotate-3">
                            <Beer className="w-8 h-8" />
                        </div>
                    </div>

                </div>
            </section>

            {/* User Journey - How It Works */}
            <section className="py-24 bg-neo-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black uppercase mb-4">Come Funziona</h2>
                        <p className="text-xl font-medium max-w-2xl mx-auto">Dal divano al dungeon in 3 semplici passi.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-black -z-10 transform -translate-y-1/2 border-t-2 border-black border-dashed opacity-30"></div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white border-2 border-black flex items-center justify-center shadow-neo mb-6 group-hover:bg-neo-yellow transition-colors relative">
                                <span className="absolute -top-3 -left-3 bg-black text-white w-8 h-8 flex items-center justify-center font-black border-2 border-white">1</span>
                                <Gamepad2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-2">Scegli il Gioco</h3>
                            <p className="max-w-xs text-sm font-medium">Sfoglia il nostro catalogo di 500+ titoli. Dai party game veloci ai cinghiali strategici.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white border-2 border-black flex items-center justify-center shadow-neo mb-6 group-hover:bg-neo-cyan transition-colors relative">
                                <span className="absolute -top-3 -left-3 bg-black text-white w-8 h-8 flex items-center justify-center font-black border-2 border-white">2</span>
                                <Coffee className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-2">Ordina Drink & Snack</h3>
                            <p className="max-w-xs text-sm font-medium">Aggiungi pozioni (cocktail) e razioni (snack) al carrello. Troverai tutto pronto al tavolo.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-white border-2 border-black flex items-center justify-center shadow-neo mb-6 group-hover:bg-neo-pink transition-colors relative">
                                <span className="absolute -top-3 -left-3 bg-black text-white w-8 h-8 flex items-center justify-center font-black border-2 border-white">3</span>
                                <Calendar className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-2">Prenota & Gioca</h3>
                            <p className="max-w-xs text-sm font-medium">Seleziona data e ora, conferma la prenotazione e presentati con la tua squadra.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tournament Explanation Section */}
            <section className="py-20 bg-white border-t-2 border-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2">
                            <div className="inline-block bg-neo-pink text-white border-2 border-black px-4 py-1 font-bold shadow-neo-sm mb-4 transform rotate-2">
                                ARENA COMPETITIVA
                            </div>
                            <h2 className="text-5xl font-black uppercase mb-6 leading-none">Sfida la Sorte,<br />Vinci la Gloria</h2>
                            <p className="text-lg font-medium mb-6">
                                I nostri tornei non sono solo per divertimento. Entra in graduatoria vincendo a Magic, Catan e Scacchi.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <Trophy className="w-6 h-6 text-neo-yellow flex-shrink-0" />
                                    <span className="font-bold">Ricompense Reali:</span> Vinci crediti bar e giochi.
                                </li>
                                <li className="flex items-start gap-3">
                                    <Shield className="w-6 h-6 text-neo-cyan flex-shrink-0" />
                                    <span className="font-bold">Badge Profilo:</span> Sblocca coccarde digitali.
                                </li>
                            </ul>

                            <Link to="/tournaments" className="inline-block bg-black text-white border-2 border-black px-8 py-4 font-black text-lg shadow-neo hover:bg-neo-violet hover:text-white transition-all uppercase">
                                Vedi Prossimi Tornei
                            </Link>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="border-4 border-black p-2 bg-neo-bg shadow-neo-lg rotate-2">
                                <img src="https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=800&auto=format&fit=crop" alt="Torneo di carte" className="w-full grayscale hover:grayscale-0 transition-all duration-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PREMIUM MEMBERSHIP SECTION - REDESIGNED */}
            <section className="py-24 bg-neo-yellow border-t-4 border-black border-b-4 relative overflow-hidden">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    <div className="text-center mb-20">
                        <span className="inline-block bg-black text-white px-4 py-1 font-black uppercase mb-6 transform -rotate-1 border-2 border-white shadow-lg">
                            Club Esclusivo
                        </span>
                        <h2 className="text-6xl md:text-8xl font-black uppercase mb-6 leading-[0.9]">
                            Unlock <br className="md:hidden" />Full Access
                        </h2>
                        <p className="text-2xl font-bold max-w-3xl mx-auto border-b-4 border-black pb-8">
                            L'account Dice & Drink non serve solo a prenotare. È il tuo passaporto per un'esperienza di gioco potenziata.
                        </p>
                    </div>

                    <div className="space-y-24">
                        {/* FEATURE 1: DUNGEON TRACKER */}
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="md:w-1/2 relative">
                                <div className="absolute inset-0 bg-black translate-x-4 translate-y-4"></div>
                                <div className="relative border-4 border-black bg-white">
                                    <img
                                        src="/home_dnd.png"
                                        alt="D&D Dashboard"
                                        className="w-full h-auto border-2 border-black"
                                    />
                                </div>
                                {/* Badge */}
                                <div className="absolute -top-6 -left-6 bg-neo-cyan border-4 border-black text-white p-3 shadow-neo transform -rotate-6">
                                    <Shield className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="text-4xl font-black uppercase mb-6 flex items-center gap-3">
                                    Dungeon Tracker <span className="text-sm bg-black text-white px-2 py-1 align-top transform -translate-y-2">v2.0</span>
                                </h3>
                                <div className="space-y-6">
                                    <div className="bg-white border-2 border-black p-6 shadow-neo-sm hover:translate-x-2 transition-transform">
                                        <h4 className="font-black uppercase text-lg mb-2 flex items-center gap-2"><Crown className="w-5 h-5 text-neo-yellow" /> Per Dungeon Master</h4>
                                        <p className="font-medium text-zinc-600">Gestisci campagne, scrivi Lore segrete, e recluta giocatori con un click. Il tuo schermo del DM ora è digitale.</p>
                                    </div>
                                    <div className="bg-white border-2 border-black p-6 shadow-neo-sm hover:translate-x-2 transition-transform">
                                        <h4 className="font-black uppercase text-lg mb-2 flex items-center gap-2"><Scroll className="w-5 h-5 text-neo-pink" /> Per Giocatori</h4>
                                        <p className="font-medium text-zinc-600">Proponi avventure in Bacheca, crea schede PG e chatta con il party. Non serve prenotare per sognare.</p>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Link to="/dnd" className="inline-flex items-center gap-2 font-black uppercase border-b-4 border-black hover:border-neo-cyan hover:text-neo-cyan transition-colors text-xl">
                                        Vai al Tracker <ArrowRight className="w-6 h-6" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* FEATURE 2: LOYALTY & EVENTS */}
                        <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                            <div className="md:w-1/2 relative">
                                <div className="absolute inset-0 bg-black translate-x-[-12px] translate-y-3"></div>
                                <div className="relative border-4 border-black bg-white p-2 -rotate-1 transition-transform group hover:rotate-0">
                                    <div className="bg-neo-pink/15 border-2 border-black p-6 min-h-[300px] flex items-center justify-center">
                                        <div className="w-full max-w-sm bg-white border-2 border-black shadow-neo-sm p-5">
                                            <div className="flex items-center justify-between gap-4 border-b-2 border-black pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-neo-yellow">
                                                        <Star className="w-7 h-7" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase text-gray-500">Profilo Avventuriero</p>
                                                        <p className="text-xl font-black uppercase">Livello 12</p>
                                                    </div>
                                                </div>
                                                <span className="border-2 border-black bg-neo-cyan px-2 py-1 text-xs font-black uppercase">VIP</span>
                                            </div>

                                            <div className="mt-4 space-y-3">
                                                <div className="flex items-center justify-between text-sm font-bold">
                                                    <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-neo-pink" /> XP Raccolti</span>
                                                    <span>2.450 / 3.000</span>
                                                </div>
                                                <div className="h-4 border-2 border-black bg-neo-bg">
                                                    <div className="h-full w-4/5 bg-neo-pink"></div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3 pt-2">
                                                    <div className="border-2 border-black bg-neo-bg p-3 text-center">
                                                        <Users className="w-5 h-5 mx-auto mb-1" />
                                                        <p className="text-[10px] font-black uppercase">Party</p>
                                                    </div>
                                                    <div className="border-2 border-black bg-neo-bg p-3 text-center">
                                                        <Sparkles className="w-5 h-5 mx-auto mb-1" />
                                                        <p className="text-[10px] font-black uppercase">Bonus</p>
                                                    </div>
                                                    <div className="border-2 border-black bg-neo-bg p-3 text-center">
                                                        <Trophy className="w-5 h-5 mx-auto mb-1" />
                                                        <p className="text-[10px] font-black uppercase">Loot</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Badge */}
                                <div className="absolute -bottom-6 -right-6 bg-neo-pink border-4 border-black text-white p-3 shadow-neo transform rotate-6">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="text-4xl font-black uppercase mb-6">
                                    Level Up <br /><span className="text-white text-stroke-black drop-shadow-md">Your Night</span>
                                </h3>
                                <p className="text-xl font-bold mb-6">
                                    Ogni birra, ogni vittoria, ogni sessione conta. Guadagna XP reali.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-4 text-lg font-bold border-b-2 border-black/10 pb-2">
                                        <Zap className="w-6 h-6 text-black fill-neo-yellow" /> Sconti su consumazioni e giochi
                                    </li>
                                    <li className="flex items-center gap-4 text-lg font-bold border-b-2 border-black/10 pb-2">
                                        <Lightbulb className="w-6 h-6 text-black fill-neo-lime" /> Accesso alla bacheca "Proponi Evento"
                                    </li>
                                    <li className="flex items-center gap-4 text-lg font-bold">
                                        <Target className="w-6 h-6 text-black fill-neo-cyan" /> Accesso anticipato alle prenotazioni stanze
                                    </li>
                                </ul>
                                <button onClick={openRegisterModal} className="bg-black text-white px-8 py-4 border-2 border-black font-black uppercase text-lg shadow-neo hover:bg-white hover:text-black hover:translate-y-1 hover:shadow-none transition-all">
                                    Crea Account Gratis
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Overview Section Boxes */}
            <section className="py-20 bg-white border-t-2 border-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Catalog Card */}
                        <Link to="/catalog" className="group bg-neo-bg border-2 border-black p-6 shadow-neo hover:-translate-y-1 transition-transform h-full flex flex-col">
                            <ShoppingBag className="w-10 h-10 mb-4 text-neo-violet" />
                            <h3 className="text-2xl font-black uppercase mb-2 group-hover:underline">Catalogo & Loot</h3>
                            <p className="text-sm mb-4 flex-grow">Pre-ordina giochi e consumazioni. Evita le code, massimizza il tempo di gioco.</p>
                            <span className="text-xs font-black uppercase text-gray-400 mt-auto flex items-center gap-1 group-hover:text-black">Esplora <ArrowRight className="w-3 h-3" /></span>
                        </Link>

                        {/* Tournaments Card */}
                        <Link to="/tournaments" className="group bg-neo-bg border-2 border-black p-6 shadow-neo hover:-translate-y-1 transition-transform h-full flex flex-col">
                            <Swords className="w-10 h-10 mb-4 text-neo-pink" />
                            <h3 className="text-2xl font-black uppercase mb-2 group-hover:underline">Arena Tornei</h3>
                            <p className="text-sm mb-4 flex-grow">Magic, Catan, Scacchi e D&D. Iscriviti per dimostrare la tua superiorità strategica.</p>
                            <span className="text-xs font-black uppercase text-gray-400 mt-auto flex items-center gap-1 group-hover:text-black">Combatti <ArrowRight className="w-3 h-3" /></span>
                        </Link>

                        {/* Booking Card */}
                        <Link to="/booking" className="group bg-neo-bg border-2 border-black p-6 shadow-neo hover:-translate-y-1 transition-transform h-full flex flex-col">
                            <UserPlus className="w-10 h-10 mb-4 text-neo-lime" />
                            <h3 className="text-2xl font-black uppercase mb-2 group-hover:underline">Prenotazioni</h3>
                            <p className="text-sm mb-4 flex-grow">Assicura il tuo tavolo per la serata. Stanze private disponibili per sessioni immersive.</p>
                            <span className="text-xs font-black uppercase text-gray-400 mt-auto flex items-center gap-1 group-hover:text-black">Prenota <ArrowRight className="w-3 h-3" /></span>
                        </Link>

                        {/* D&D Tracker Card */}
                        <Link to="/dnd" className="group bg-neo-bg border-2 border-black p-6 shadow-neo hover:-translate-y-1 transition-transform h-full flex flex-col">
                            <Shield className="w-10 h-10 mb-4 text-neo-cyan" />
                            <h3 className="text-2xl font-black uppercase mb-2 group-hover:underline">D&D Tracker</h3>
                            <p className="text-sm mb-4 flex-grow">Gestione campagne, schede personaggio e note. Tutto salvato nel cloud del Dungeon Master.</p>
                            <span className="text-xs font-black uppercase text-gray-400 mt-auto flex items-center gap-1 group-hover:text-black">Gestisci <ArrowRight className="w-3 h-3" /></span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
