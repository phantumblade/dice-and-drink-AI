"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    // 1. Create Users
    const password = await bcrypt.hash('password123', 10);
    const alex = await prisma.user.upsert({
        where: { email: 'alex@example.com' },
        update: {},
        create: {
            id: 'u1',
            name: 'Alex Gamer',
            email: 'alex@example.com',
            password,
            role: 'customer',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400&h=400',
            gamesPlayed: 42,
            winRate: 68,
            favoriteGame: 'Dungeons & Dragons',
            totalSpent: 350.50,
            xp: 1250,
            badges: {
                create: [
                    { id: 'b1', name: 'Dungeon Master', icon: '👑', description: 'Ospitate 5 Sessioni D&D', dateEarned: new Date('2023-10-15') },
                    { id: 'b2', name: 'Dice Goblin', icon: '🎲', description: 'Ordinati 20+ oggetti', dateEarned: new Date('2023-11-01') },
                    { id: 'b3', name: 'Mattiniero', icon: '🌅', description: 'Prenotazione mattutina', dateEarned: new Date('2023-09-20') }
                ]
            }
        },
    });
    console.log({ alex });
    // 2. Create Products
    const products = [
        {
            id: 'g1',
            name: 'Catan',
            category: 'game',
            description: 'Raccogli risorse e costruisci insediamenti in questo classico gioco di strategia. Perfetto per rovinare amicizie di lunga data.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1610890716271-e2fe9e94a541?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategia', 'Famiglia', 'Commercio']),
            rating: 4.8,
            players: '3-4',
            duration: '60-120m'
        },
        {
            id: 'g2',
            name: 'Dungeons & Dragons 5e',
            category: 'game',
            description: 'Il gioco di ruolo più grande del mondo. Manuali (PHB, DMG, MM) e set di dadi forniti al tavolo.',
            price: 5,
            image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['RPG', 'Fantasy', 'Co-op']),
            rating: 5.0,
            players: '2-8',
            duration: '3h+'
        },
        {
            id: 'd1',
            name: 'Pozione di Cura',
            category: 'drink',
            description: 'Un mix rivitalizzante di mirtillo, vodka e lime. Servito in fiaschetta sferica con ghiaccio secco.',
            price: 8.50,
            image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Cocktail', 'Dolce', 'Tematico']),
            rating: 4.5,
            alcohol: true
        },
        {
            id: 's1',
            name: 'Nachos Supreme',
            category: 'snack',
            description: 'Montagna di chips di tortilla con formaggio fuso, jalapeños, fagioli neri e salsa piccante.',
            price: 6.00,
            image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Salato', 'Condivisione']),
            rating: 4.6
        }
    ];
    for (const p of products) {
        await prisma.product.upsert({
            where: { id: p.id },
            update: {},
            create: p,
        });
    }
    // 3. Create Tournaments
    const tournaments = [
        {
            id: 't1',
            title: 'Venerdì Night Magic',
            date: new Date('2023-11-24T18:00:00'),
            type: 'Standard',
            gameSystem: 'Magic: The Gathering',
            frequency: 'Settimanale',
            includes: JSON.stringify(['1 Booster Pack', 'Drink Piccolo']),
            rules: 'Formato Standard. Turni alla svizzera da 50 minuti.',
            slots: 32,
            filled: 28,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Il classico appuntamento del venerdì sera. Porta il tuo mazzo standard e competi per premi in bustine e carte promo.'
        },
        {
            id: 't2',
            title: 'Ombre della Valle',
            date: new Date('2023-11-25T14:00:00'),
            type: 'Campagna D&D',
            gameSystem: 'D&D 5e',
            frequency: 'One-shot (4 Ore)',
            includes: JSON.stringify(['Personaggio Pre-generato', 'Snack al Tavolo']),
            rules: 'Livello 5. Point Buy. Manuali ufficiali concessi.',
            slots: 6,
            filled: 4,
            status: 'upcoming',
            dm: 'Matt M.',
            image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Una tetra avventura horror investigativa. Il villaggio di Krezk è silenzioso... troppo silenzioso. Richiesta approvazione del Master.'
        }
    ];
    for (const t of tournaments) {
        await prisma.tournament.upsert({
            where: { id: t.id },
            update: {},
            create: t,
        });
    }
    // 4. Create Campaigns
    const campaign = await prisma.campaign.upsert({
        where: { id: 'c1' },
        update: {},
        create: {
            id: 'c1',
            tournamentId: 't2',
            title: 'Maledizione di Strahd',
            system: 'D&D 5e',
            dm: 'Dungeon Master X',
            image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Una campagna di horror gotico nelle terre di Barovia.',
            sessions: {
                create: [
                    { id: 's1', title: 'Nella Nebbia', date: new Date('2023-10-01'), summary: 'Il gruppo è entrato a Barovia ed è stato subito attaccato dai lupi.', location: 'Boschi di Svalich' },
                    { id: 's2', title: 'Casa della Morte', date: new Date('2023-10-08'), summary: 'Il gruppo ha esplorato una casa inquietante. Stabby è caduto in una trappola.', location: 'Villaggio di Barovia' }
                ]
            },
            notes: {
                create: [
                    { id: 'n1', title: 'Strahd von Zarovich', content: 'Il signore vampiro della terra. Evitare a tutti i costi.', type: 'NPC' },
                    { id: 'n2', title: 'Spada del Sole', content: 'Una lama leggendaria detta distruggere i non morti.', type: 'Loot' }
                ]
            }
        }
    });
    // Add characters to campaign
    await prisma.character.createMany({
        data: [
            { id: 'ch1', name: 'Grommash', class: 'Barbaro', level: 5, race: 'Orco', status: 'Alive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grom', campaignId: 'c1', userId: 'u1' },
            { id: 'ch2', name: 'Elara', class: 'Mago', level: 5, race: 'Elfo', status: 'Alive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elara', campaignId: 'c1' }, // No user linked for now
            { id: 'ch3', name: 'Stabby', class: 'Ladro', level: 5, race: 'Halfling', status: 'Dead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stabby', campaignId: 'c1' }
        ],
        skipDuplicates: true
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
