import React from 'react';
import { Dice6, Coffee, MapPin, Award, Scroll, GlassWater } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
                <div className="w-full md:w-1/2">
                    <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-none">Giochiamo <br /><span className="text-neo-pink underline">Diversamente.</span></h1>
                    <p className="text-lg font-medium mb-6 border-l-4 border-black pl-4">
                        Dice & Drink non è solo un locale. È un santuario per strateghi, avventurieri e chiunque sappia che un buon tiro di dadi può cambiare il destino.
                    </p>
                    <p className="mb-4 text-gray-700">
                        Nati nel 2024, siamo partiti da una semplice verità: giocare a D&D in un appartamento stretto e senza atmosfera non rende giustizia alle nostre storie. Volevamo un luogo dove il comfort incontra l'epicità.
                    </p>
                    <p className="mb-6 text-gray-700">
                        Abbiamo creato uno spazio con tavoli professionali in legno massello, una libreria in continua espansione con oltre 500 titoli e, soprattutto, un'offerta di drink che non è solo "di contorno", ma protagonista della serata.
                    </p>
                    <div className="flex gap-4 mt-8">
                        <div className="bg-neo-yellow border-2 border-black p-4 text-center shadow-neo transform hover:-translate-y-1 transition-transform">
                            <h3 className="text-3xl font-black">500+</h3>
                            <p className="text-xs font-bold uppercase">Giochi da Tavolo</p>
                        </div>
                        <div className="bg-neo-cyan border-2 border-black p-4 text-center shadow-neo transform hover:-translate-y-1 transition-transform">
                            <h3 className="text-3xl font-black">100%</h3>
                            <p className="text-xs font-bold uppercase">Passione</p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 relative group">
                    <div className="absolute inset-0 bg-neo-violet border-2 border-black translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
                    <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800" className="relative w-full border-2 border-black transition-transform duration-300 group-hover:-translate-y-2" alt="Interno del Cafe" />
                </div>
            </div>

            {/* Mission Section */}
            <div className="mb-24">
                <div className="bg-white text-black p-12 border-2 border-black shadow-neo relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black uppercase mb-6 text-neo-pink">La Nostra Missione</h2>
                        <p className="text-xl leading-relaxed max-w-3xl">
                            Vogliamo elevare l'esperienza del gioco sociale. Crediamo che un grande gioco meriti un grande drink e un'atmosfera che ispiri. Non siamo solo un posto dove sedersi; siamo il palcoscenico per le vostre vittorie più gloriose e le sconfitte più divertenti.
                        </p>
                    </div>
                    <Dice6 className="absolute -right-10 -bottom-10 w-64 h-64 text-gray-100 opacity-50 rotate-12" />
                </div>
            </div>

            {/* Mixologist Section */}
            <MixologistSection />

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border-2 border-black p-8 shadow-neo hover:-translate-y-2 transition-transform duration-300">
                    <Dice6 className="w-12 h-12 mb-6 text-neo-violet" />
                    <h3 className="text-2xl font-black uppercase mb-3">La Ludoteca</h3>
                    <p className="text-gray-600">Curata da veri ossessivi. Se è nella Top 100 di BGG, probabilmente ce l'abbiamo. E se non c'è, chiedicelo e faremo il possibile.</p>
                </div>
                <div className="bg-white border-2 border-black p-8 shadow-neo hover:-translate-y-2 transition-transform duration-300">
                    <Coffee className="w-12 h-12 mb-6 text-neo-pink" />
                    <h3 className="text-2xl font-black uppercase mb-3">La Taverna</h3>
                    <p className="text-gray-600">Espresso per la concentrazione, birre artigianali per il coraggio e cocktail tematici per dare spettacolo al tavolo.</p>
                </div>
                <div className="bg-white border-2 border-black p-8 shadow-neo hover:-translate-y-2 transition-transform duration-300">
                    <MapPin className="w-12 h-12 mb-6 text-neo-lime" />
                    <h3 className="text-2xl font-black uppercase mb-3">Dove Siamo</h3>
                    <p className="text-gray-600">Via dei Meeple 123. Piano terra. Cerca l'insegna al neon con il D20 che brilla nella notte.</p>
                </div>
            </div>
        </div>
    );
};

const MixologistSection: React.FC = () => {
    const [activeCategory, setActiveCategory] = React.useState<'bartending' | 'seminars' | 'drink' | null>(null);

    const handleCardClick = (category: 'bartending' | 'seminars' | 'drink') => {
        if (activeCategory === category) {
            setActiveCategory(null); // Close if clicking same
        } else {
            setActiveCategory(category);
        }
    };

    const bartendingContent = (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-2 bg-[#FF6B00] -mx-4 px-4 -mt-4 md:-mx-8 md:px-8 md:-mt-8 pt-4">
                <div className="flex items-center gap-3 text-white">
                    <Award className="w-8 h-8" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Bartending Certs</h3>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setActiveCategory(null); }} className="text-xs font-black uppercase hover:bg-black hover:text-white px-3 py-2 border-2 border-black transition-all bg-white text-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                    Chiudi X
                </button>
            </div>
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow overscroll-contain">
                {/* Course 1 */}
                <div className="mb-6 bg-white border-2 border-black p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-black uppercase text-[#FF6B00] leading-none">International<br />Bartender Course</h4>
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">4 Weeks</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 border-b border-gray-200 pb-2">
                        <span>EBS Certified</span>
                        <span>•</span>
                        <span>Grade B (88.6%)</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-snug mb-2">
                        Corso intensivo internazionale di bartending della durata di 4 settimane, con formazione completa sulle tecniche di miscelazione, servizio, gestione del bar, conoscenza di spirits, birre e vini, sicurezza sul lavoro e normativa sull’alcol.
                    </p>
                    <div className="text-xs text-gray-600 border-t border-gray-100 pt-2">
                        <span className="font-bold">Argomenti:</span> Teamwork, Drink mixing, Free pouring, Flair, Spirits & Wine knowledge, Responsible service.
                    </div>
                </div>

                {/* Course 2 */}
                <div className="bg-white border-2 border-black p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-black uppercase text-[#FF6B00] leading-none">Mixology<br />Course</h4>
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">2 Days</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 border-b border-gray-200 pb-2">
                        <span>EBS Certified</span>
                        <span>•</span>
                        <span>Advanced</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-snug mb-2">
                        Corso avanzato di mixology di 2 giorni, focalizzato su pre-batching, infusioni, conoscenza dei prodotti, tecniche di servizio, garnish, strumenti di bar moderni e d’epoca e cocktail delle ere pre-Proibizionismo e Proibizionismo.
                    </p>
                    <div className="text-xs text-gray-600 border-t border-gray-100 pt-2">
                        <span className="font-bold">Argomenti:</span> Pre-batching, Infusions, Garnish, Vintage tools, Prohibition cocktails.
                    </div>
                </div>
            </div>
        </div>
    );

    const seminarsContent = (
        <div className="h-full flex flex-col">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center border-b-4 border-black pb-4 mb-2 bg-[#9D4EDD] -mx-4 px-4 -mt-4 md:-mx-8 md:px-8 md:-mt-8 pt-4">
                <div className="flex items-center gap-3 text-white min-w-0">
                    <Scroll className="w-8 h-8" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Seminari Tematici</h3>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setActiveCategory(null); }} className="self-start sm:self-auto text-xs font-black uppercase hover:bg-black hover:text-white px-3 py-2 border-2 border-black transition-all bg-white text-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                    Chiudi X
                </button>
            </div>
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow overscroll-contain">
                {/* Seminar 1 */}
                <div className="mb-6 bg-white border-2 border-black p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-black uppercase text-[#9D4EDD] leading-none">Negroni:<br />Da Casoni al Mondo</h4>
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">21/11/2024</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 border-b border-gray-200 pb-2">
                        <span>Attestato di partecipazione</span>
                        <span>•</span>
                        <span>Milano</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-snug mb-2">
                        Corso di approfondimento dedicato al Negroni, dalla sua nascita presso il Caffè Casoni fino alla diffusione internazionale, con focus su storia, personaggi chiave, ingredienti e varianti “twist on classic”.
                    </p>
                    <div className="text-xs text-gray-600 border-t border-gray-100 pt-2">
                        <span className="font-bold">Argomenti:</span> Vita del Conte Negroni, Storia di Fosco Scarselli, Genesi del cocktail, Twist on classic.
                    </div>
                </div>

                {/* Seminar 2 */}
                <div className="mb-6 bg-white border-2 border-black p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-black uppercase text-[#9D4EDD] leading-none">Tiki Culture:<br />Pop Polinesiano</h4>
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">21/11/2024</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 border-b border-gray-200 pb-2">
                        <span>Attestato di partecipazione</span>
                        <span>•</span>
                        <span>Milano</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-snug mb-2">
                        Seminario dedicato alla cultura Tiki e al suo immaginario “pop polinesiano”, dalle origini culturali alla Golden Age del Tiki, passando per le figure chiave come Don the Beachcomber e Trader Vic e le prime ricette classiche.
                    </p>
                    <div className="text-xs text-gray-600 border-t border-gray-100 pt-2">
                        <span className="font-bold">Argomenti:</span> Don The Beachcomber, Trader Vic, Prime ricette Tiki, Golden Age & New Era.
                    </div>
                </div>

                {/* Seminar 3 */}
                <div className="bg-white border-2 border-black p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-black uppercase text-[#9D4EDD] leading-none">Rivoluzione<br />Analcolica</h4>
                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">21/11/2024</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-500 border-b border-gray-200 pb-2">
                        <span>Attestato di partecipazione</span>
                        <span>•</span>
                        <span>Milano</span>
                    </div>
                    <p className="text-sm text-gray-800 leading-snug mb-2">
                        Percorso formativo dedicato al mondo analcolico: storia dei cocktail della temperanza, trend attuali e futuri dei mocktail, gestione dello 0 ABV, normativa europea sui prodotti analcolici e differenze tra le principali categorie “non alcoholic”.
                    </p>
                    <div className="text-xs text-gray-600 border-t border-gray-100 pt-2">
                        <span className="font-bold">Argomenti:</span> Storia cocktail temperanza, Trend Mocktail, Gestione 0 ABV, Normativa Europea.
                    </div>
                </div>
            </div>
        </div>
    );

    const drinkContent = (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-2 bg-neo-cyan -mx-4 px-4 -mt-4 md:-mx-8 md:px-8 md:-mt-8 pt-4">
                <div className="flex items-center gap-3 text-black">
                    <GlassWater className="w-8 h-8" />
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Pozione di Cura</h3>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setActiveCategory(null); }} className="text-xs font-black uppercase hover:bg-black hover:text-white px-3 py-2 border-2 border-black transition-all bg-white text-black shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                    Chiudi X
                </button>
            </div>
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow overscroll-contain flex flex-col items-center text-center">
                <div className="w-full h-48 bg-neo-cyan/20 border-2 border-black mb-4 relative overflow-hidden group">
                    {/* Placeholder for Drink Image - In a real app, this would be the product image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <GlassWater className="w-24 h-24 text-neo-cyan opacity-50" />
                    </div>
                </div>

                <h4 className="text-3xl font-black uppercase text-neo-cyan mb-2">Pozione di Cura</h4>
                <div className="flex gap-2 justify-center mb-4">
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">Cocktail</span>
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">Dolce</span>
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase">Tematico</span>
                </div>

                <p className="text-lg font-bold text-gray-800 mb-4 leading-snug">
                    "Un mix rivitalizzante di mirtillo, vodka e lime. Servito in fiaschetta sferica con ghiaccio secco."
                </p>

                <div className="text-sm text-gray-600 bg-gray-100 p-4 border-2 border-black w-full text-left">
                    <p className="mb-2"><span className="font-black">Effetto:</span> Ripristina 2d4+2 HP (o semplicemente il buonumore).</p>
                    <p><span className="font-black">Consigliato per:</span> Chi ha appena subito un critico o vuole rinfrescarsi dopo una lunga battaglia.</p>
                </div>

                <div className="mt-auto pt-4 w-full">
                    <button className="w-full bg-neo-cyan text-black font-black uppercase py-3 border-2 border-black shadow-neo hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
                        Ordina Ora - € 8.50
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row-reverse gap-12 items-start mb-24">
            <div className="w-full md:w-1/2 relative">
                <div className="min-h-[400px]">
                    <h2 className="text-5xl font-black uppercase mb-6">L'Alchimista <br /><span className="text-neo-lime">Del Gusto.</span></h2>
                    <h3 className="text-2xl font-bold mb-4">Riccardo Spadin</h3>

                    {/* Bio Text - Always visible now */}
                    <div>
                        <p className="mb-6 text-gray-700 leading-relaxed">
                            Il nostro Head Mixologist non mescola solo ingredienti; <span className="relative inline-block px-1 mx-1"><span className="absolute inset-0 bg-[#ffff00] mix-blend-multiply -skew-y-2 rounded-sm -z-10 shadow-[2px_2px_0px_rgba(255,255,0,0.5)]"></span><span className="relative font-bold">crea pozioni</span></span>.
                            Con un background che fonde l'<span className="relative inline-block px-1 mx-1"><span className="absolute inset-0 bg-[#ffff00] mix-blend-multiply -skew-y-1 rounded-sm -z-10 shadow-[2px_2px_0px_rgba(255,255,0,0.5)]"></span><span className="relative font-bold">alta mixologia internazionale</span></span>
                            e una <span className="relative inline-block px-1 mx-1"><span className="absolute inset-0 bg-[#ffff00] mix-blend-multiply skew-y-1 rounded-sm -z-10 shadow-[2px_2px_0px_rgba(255,255,0,0.5)]"></span><span className="relative font-bold">passione sfrenata per il fantasy</span></span>,
                            Riccardo ha curato una drink list che è un'<span className="relative inline-block px-1 mx-1"><span className="absolute inset-0 bg-[#ffff00] mix-blend-multiply -skew-y-2 rounded-sm -z-10 shadow-[2px_2px_0px_rgba(255,255,0,0.5)]"></span><span className="relative font-bold">avventura in sé</span></span>.
                        </p>
                        <p className="mb-8 text-gray-700 leading-relaxed">
                            Ogni cocktail è studiato per accompagnare specifiche tipologie di gioco, dai <span className="relative inline-block px-1 mx-1"><span className="absolute inset-0 bg-[#ffff00] mix-blend-multiply -skew-y-1 rounded-sm -z-10 shadow-[2px_2px_0px_rgba(255,255,0,0.5)]"></span><span className="relative font-bold">sapori affumicati</span></span>
                            per i dungeon crawler più oscuri, alle <span className="relative inline-block px-1 mx-1"><span className="absolute inset-0 bg-[#ffff00] mix-blend-multiply skew-y-1 rounded-sm -z-10 shadow-[2px_2px_0px_rgba(255,255,0,0.5)]"></span><span className="relative font-bold">note fresche e fruttate</span></span>
                            per i party game più leggeri.
                        </p>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-3 gap-2 mt-4 relative z-30">
                    {/* Card 1 - Bartending */}
                    <div
                        onClick={() => handleCardClick('bartending')}
                        className={`cursor-pointer relative bg-white border-2 md:border-4 border-black p-2 md:p-4 shadow-neo transition-all duration-200 group hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${activeCategory === 'bartending' ? 'ring-2 md:ring-4 ring-[#FF6B00] translate-x-1 translate-y-1 shadow-none' : ''}`}
                    >
                        <div className="flex flex-col items-center text-center h-full justify-between">
                            <Award className={`w-6 h-6 md:w-10 md:h-10 mb-1 md:mb-2 transition-colors ${activeCategory === 'bartending' ? 'text-[#FF6B00]' : 'text-black group-hover:text-[#FF6B00]'}`} />
                            <div>
                                <h4 className="font-black text-[10px] md:text-sm uppercase leading-tight mb-0.5 md:mb-1">Bartending<br />Pro</h4>
                                <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase hidden md:block">EBS Certified</p>
                            </div>
                        </div>
                        <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[6px] md:text-[8px] font-bold px-1.5 md:px-2 py-0.5 uppercase tracking-widest border border-[#FF6B00]">
                            Master
                        </div>
                    </div>

                    {/* Card 2 - Seminars */}
                    <div
                        onClick={() => handleCardClick('seminars')}
                        className={`cursor-pointer relative bg-white border-2 md:border-4 border-black p-2 md:p-4 shadow-neo transition-all duration-200 group hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${activeCategory === 'seminars' ? 'ring-2 md:ring-4 ring-[#9D4EDD] translate-x-1 translate-y-1 shadow-none' : ''}`}
                    >
                        <div className="flex flex-col items-center text-center h-full justify-between">
                            <Scroll className={`w-6 h-6 md:w-10 md:h-10 mb-1 md:mb-2 transition-colors ${activeCategory === 'seminars' ? 'text-[#9D4EDD]' : 'text-black group-hover:text-[#9D4EDD]'}`} />
                            <div>
                                <h4 className="font-black text-[10px] md:text-sm uppercase leading-tight mb-0.5 md:mb-1">Culture<br />& History</h4>
                                <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase hidden md:block">Seminars</p>
                            </div>
                        </div>
                        <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[6px] md:text-[8px] font-bold px-1.5 md:px-2 py-0.5 uppercase tracking-widest border border-[#9D4EDD]">
                            Expert
                        </div>
                    </div>

                    {/* Card 3 - Drink Recommendation */}
                    <div
                        onClick={() => handleCardClick('drink')}
                        className={`cursor-pointer relative bg-neo-cyan/20 border-2 md:border-4 border-black p-2 md:p-4 shadow-neo transition-all duration-200 group hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${activeCategory === 'drink' ? 'ring-2 md:ring-4 ring-neo-cyan translate-x-1 translate-y-1 shadow-none' : ''}`}
                    >
                        <div className="flex flex-col items-center text-center h-full justify-between">
                            <GlassWater className="w-6 h-6 md:w-10 md:h-10 text-black mb-1 md:mb-2" />
                            <div>
                                <h4 className="font-black text-[10px] md:text-sm uppercase leading-tight mb-0.5 md:mb-1">Pozione<br />di Cura</h4>
                                <p className="text-[8px] md:text-[10px] font-bold text-gray-500 uppercase hidden md:block">Consigliato</p>
                            </div>
                        </div>
                        <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[6px] md:text-[8px] font-bold px-1.5 md:px-2 py-0.5 uppercase tracking-widest border border-neo-cyan">
                            Try It
                        </div>
                    </div>
                </div>
            </div>

            {/* Flip Card Container */}
            <div className="w-full md:w-1/2 relative group [perspective:1000px] h-[400px] md:h-[600px]">
                <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${activeCategory ? '[transform:rotateY(180deg)]' : ''}`}>

                    {/* Front Face - Image */}
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                        <div className="absolute inset-0 bg-neo-orange border-2 border-black -translate-x-4 translate-y-4"></div>
                        <img src="/assets/Mixologo.jpeg" className="relative w-full h-full object-cover border-2 border-black" alt="Il nostro Mixologist" />
                    </div>

                    {/* Back Face - Content */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white border-2 border-black p-4 md:p-8 shadow-neo">
                        <div className="h-full flex flex-col">
                            {activeCategory === 'bartending' && bartendingContent}
                            {activeCategory === 'seminars' && seminarsContent}
                            {activeCategory === 'drink' && drinkContent}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
