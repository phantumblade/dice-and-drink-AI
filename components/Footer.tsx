import React from 'react';
import { Github, Twitter, Instagram, MapPin, Clock, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t-2 border-black text-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-black italic">DICE & DRINK</h3>
            <p className="text-sm font-bold bg-neo-yellow inline-block px-1 border-2 border-black shadow-neo-sm mt-2">
              Roll Once, Drink Twice.
            </p>
            <p className="mt-4 text-sm font-medium text-gray-600">
              Il santuario per gli amanti dei giochi da tavolo, cocktail e avventure.
            </p>
          </div>

          {/* Location & Hours */}
          <div className="col-span-1 md:col-span-1 space-y-3">
            <h4 className="font-black uppercase text-neo-violet">Dove Siamo</h4>
            <div className="flex items-start gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <span>Via dei Meeple 20<br />Milano, 20100</span>
            </div>
            <div className="flex items-start gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 mt-1 flex-shrink-0" />
              <span>Lun-Dom: 16:00 - 02:00</span>
            </div>
            <div className="flex items-start gap-2 text-sm font-medium">
              <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
              <span>+39 02 1234 5678</span>
            </div>
          </div>

          {/* Links */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-black uppercase text-neo-pink mb-3">Link Rapidi</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><a href="#/catalog" className="hover:underline">Catalogo Giochi</a></li>
              <li><a href="#/tournaments" className="hover:underline">Tornei & Eventi</a></li>
              <li><a href="#/booking" className="hover:underline">Prenota Tavolo</a></li>
              <li><a href="#/dnd" className="hover:underline">D&D Tracker</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <h4 className="font-black uppercase text-neo-cyan mb-3">Community</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/phantumblade" target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black shadow-neo hover:translate-y-1 hover:shadow-none hover:bg-black hover:text-white transition-all"><Github className="w-5 h-5" /></a>
              <a href="https://x.com/andreaperini9" target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black shadow-neo hover:translate-y-1 hover:shadow-none hover:bg-neo-cyan hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="p-2 border-2 border-black shadow-neo hover:translate-y-1 hover:shadow-none hover:bg-neo-pink hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-black pt-8 mt-8 text-center text-xs font-bold uppercase tracking-widest opacity-60">
          © 2024 Dice & Drink Gaming Café. All rights reserved. Game Hard.
        </div>
      </div>
    </footer>
  );
};

export default Footer;