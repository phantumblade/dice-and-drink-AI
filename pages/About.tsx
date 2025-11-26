import React from 'react';
import { Dice6, Coffee, MapPin } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
            <div className="w-full md:w-1/2">
                <h1 className="text-6xl font-black uppercase mb-6 leading-none">We Roll <br/><span className="text-neo-pink underline">Different.</span></h1>
                <p className="text-lg font-medium mb-6 border-l-4 border-black pl-4">
                    Dice & Drink isn't just a cafe. It's a sanctuary for strategists, role-players, and anyone who appreciates a good meeple.
                </p>
                <p className="mb-4">
                    Founded in 2024, we aimed to solve a simple problem: Playing D&D in a crowded apartment sucks. We provide professional tables, a library of 500+ games, and drinks that actually taste good.
                </p>
                <div className="flex gap-4 mt-8">
                    <div className="bg-neo-yellow border-2 border-black p-4 text-center shadow-neo">
                        <h3 className="text-3xl font-black">500+</h3>
                        <p className="text-xs font-bold uppercase">Games</p>
                    </div>
                    <div className="bg-neo-cyan border-2 border-black p-4 text-center shadow-neo">
                        <h3 className="text-3xl font-black">24/7</h3>
                        <p className="text-xs font-bold uppercase">Vibes</p>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-1/2 relative">
                <div className="absolute inset-0 bg-neo-violet border-2 border-black translate-x-4 translate-y-4"></div>
                <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800" className="relative w-full border-2 border-black grayscale hover:grayscale-0 transition-all" alt="Cafe Interior" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-black p-8 shadow-neo hover:-translate-y-1 transition-transform">
                <Dice6 className="w-10 h-10 mb-4 text-neo-violet" />
                <h3 className="text-xl font-black uppercase mb-2">The Library</h3>
                <p className="text-sm text-gray-600">Curated by obsessives. If it's on BGG Top 100, we probably have it. If we don't, tell us.</p>
            </div>
            <div className="bg-white border-2 border-black p-8 shadow-neo hover:-translate-y-1 transition-transform">
                <Coffee className="w-10 h-10 mb-4 text-neo-pink" />
                <h3 className="text-xl font-black uppercase mb-2">The Tavern</h3>
                <p className="text-sm text-gray-600">Espresso for focus, craft brews for courage, and thematic cocktails for flair.</p>
            </div>
            <div className="bg-white border-2 border-black p-8 shadow-neo hover:-translate-y-1 transition-transform">
                <MapPin className="w-10 h-10 mb-4 text-neo-lime" />
                <h3 className="text-xl font-black uppercase mb-2">The Location</h3>
                <p className="text-sm text-gray-600">123 Meeple Avenue. Downstairs. Look for the neon d20 sign.</p>
            </div>
        </div>
    </div>
  );
};

export default About;
