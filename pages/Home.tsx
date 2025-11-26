import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Coffee, Dice6, Shield, ShoppingBag, Swords, UserPlus, Beer, Gamepad2, Trophy, Star, Lightbulb, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
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
            
            <h1 className="text-7xl md:text-8xl font-black mb-2 leading-[0.85] tracking-tighter uppercase">
              Roll <span className="text-neo-violet">Once</span>,<br/>
              Drink <span className="text-neo-pink">Twice</span>.
            </h1>
            
            <p className="text-xl font-bold mb-8 max-w-lg mt-6 text-gray-800">
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
                      <h2 className="text-5xl font-black uppercase mb-6 leading-none">Sfida la Sorte,<br/>Vinci la Gloria</h2>
                      <p className="text-lg font-medium mb-6">
                          I nostri tornei non sono solo per divertimento. Sono un'arena dove si forgiano leggende. Partecipando ai nostri eventi (Magic, Catan, Scacchi, e D&D One-Shots) non solo metti alla prova le tue abilità, ma entri in una graduatoria esclusiva.
                      </p>
                      
                      <ul className="space-y-4 mb-8">
                          <li className="flex items-start gap-3">
                              <Trophy className="w-6 h-6 text-neo-yellow flex-shrink-0" />
                              <span className="font-bold">Ricompense Reali:</span> Vinci crediti bar, giochi in scatola e merchandise esclusivo.
                          </li>
                          <li className="flex items-start gap-3">
                              <Shield className="w-6 h-6 text-neo-cyan flex-shrink-0" />
                              <span className="font-bold">Badge Profilo:</span> Ogni vittoria sblocca coccarde digitali visibili a tutta la community.
                          </li>
                          <li className="flex items-start gap-3">
                              <Swords className="w-6 h-6 text-neo-lime flex-shrink-0" />
                              <span className="font-bold">Ranking Stagionale:</span> I migliori giocatori dell'anno vengono immortalati sulla nostra "Wall of Fame".
                          </li>
                      </ul>

                      <Link to="/tournaments" className="inline-block bg-black text-white border-2 border-black px-8 py-4 font-black text-lg shadow-neo hover:bg-neo-violet hover:text-white transition-all uppercase">
                          Vedi Prossimi Tornei
                      </Link>
                  </div>
                  <div className="md:w-1/2 relative">
                      <div className="border-4 border-black p-2 bg-neo-bg shadow-neo-lg rotate-2">
                          <img src="https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?q=80&w=800&auto=format&fit=crop" alt="Torneo di carte" className="w-full grayscale hover:grayscale-0 transition-all duration-500"/>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Membership Benefits */}
      <section className="py-20 bg-neo-yellow border-t-2 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-5xl font-black uppercase mb-4">Perché Creare un Account?</h2>
              <p className="text-xl font-medium max-w-2xl mx-auto mb-12">Loggarsi non serve solo a prenotare. Sblocca il vero potenziale del Dice & Drink.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 border-2 border-black shadow-neo hover:-translate-y-2 transition-transform">
                      <div className="w-16 h-16 bg-neo-violet border-2 border-black flex items-center justify-center mx-auto mb-6">
                          <Lightbulb className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-black uppercase mb-4">Proponi Eventi</h3>
                      <p className="font-medium">Hai un'idea per un torneo assurdo? O vuoi masterare una campagna specifica? I membri possono proporre eventi direttamente allo staff.</p>
                  </div>

                  <div className="bg-white p-8 border-2 border-black shadow-neo hover:-translate-y-2 transition-transform">
                      <div className="w-16 h-16 bg-neo-pink border-2 border-black flex items-center justify-center mx-auto mb-6">
                          <Star className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-black uppercase mb-4">Loyalty Rewards</h3>
                      <p className="font-medium">Ogni ordine al bar e ogni partita giocata ti fa guadagnare XP. Sali di livello per ottenere drink omaggio e sconti sui giochi.</p>
                  </div>

                  <div className="bg-white p-8 border-2 border-black shadow-neo hover:-translate-y-2 transition-transform">
                      <div className="w-16 h-16 bg-neo-lime border-2 border-black flex items-center justify-center mx-auto mb-6">
                          <Users className="w-8 h-8 text-black" />
                      </div>
                      <h3 className="text-2xl font-black uppercase mb-4">D&D Party Finder</h3>
                      <p className="font-medium">Accedi al nostro Tracker esclusivo. Trova party con posti liberi, gestisci la scheda del personaggio e leggi i riassunti delle sessioni.</p>
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
                    <span className="text-xs font-black uppercase text-gray-400 mt-auto flex items-center gap-1 group-hover:text-black">Esplora <ArrowRight className="w-3 h-3"/></span>
                </Link>

                {/* Tournaments Card */}
                <Link to="/tournaments" className="group bg-neo-bg border-2 border-black p-6 shadow-neo hover:-translate-y-1 transition-transform h-full flex flex-col">
                    <Swords className="w-10 h-10 mb-4 text-neo-pink" />
                    <h3 className="text-2xl font-black uppercase mb-2 group-hover:underline">Arena Tornei</h3>
                    <p className="text-sm mb-4 flex-grow">Magic, Catan, Scacchi e D&D. Iscriviti per dimostrare la tua superiorità strategica.</p>
                    <span className="text-xs font-black uppercase text-gray-400 mt-auto flex items-center gap-1 group-hover:text-black">Combatti <ArrowRight className="w-3 h-3"/></span>
                </Link>

                {/* Booking Card */}
                <Link to="/booking" className="group bg-neo-bg border-2 border-black p-6 shadow-neo hover:-translate-y-1 transition-transform h-full flex flex-col">
                    <UserPlus className="w-10 h-10 mb-4 text-neo-lime" />
                    <h3 className="text-2xl font-black uppercase mb-2 group-hover:underline">Prenotazioni</h3>
                    <p className="text-sm mb-4 flex-grow">Assicura il tuo tavolo per la serata. Stanze private disponibili per sessioni immersive.</p>
                    <span className="text-xs font-black uppercase text-gray-400 mt-auto flex items-center gap-1 group-hover:text-black">Prenota <ArrowRight className="w-3 h-3"/></span>
                </Link>

                {/* D&D Tracker Card */}
                <Link to="/dnd" className="group bg-neo-bg border-2 border-black p-6 shadow-neo hover:-translate-y-1 transition-transform h-full flex flex-col">
                    <Shield className="w-10 h-10 mb-4 text-neo-cyan" />
                    <h3 className="text-2xl font-black uppercase mb-2 group-hover:underline">D&D Tracker</h3>
                    <p className="text-sm mb-4 flex-grow">Gestione campagne, schede personaggio e note. Tutto salvato nel cloud del Dungeon Master.</p>
                    <span className="text-xs font-black uppercase text-gray-400 mt-auto flex items-center gap-1 group-hover:text-black">Gestisci <ArrowRight className="w-3 h-3"/></span>
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;