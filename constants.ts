import { Product, ProductCategory, Tournament, TournamentType, User, UserRole, Campaign } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Gamer',
  email: 'alex@example.com',
  role: UserRole.CUSTOMER, 
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400&h=400',
  stats: {
    gamesPlayed: 42,
    winRate: 68,
    favoriteGame: 'Dungeons & Dragons',
    totalSpent: 350.50,
    xp: 1250
  },
  badges: [
    { id: 'b1', name: 'Dungeon Master', icon: '👑', description: 'Ospitate 5 Sessioni D&D', dateEarned: '2023-10-15' },
    { id: 'b2', name: 'Dice Goblin', icon: '🎲', description: 'Ordinati 20+ oggetti', dateEarned: '2023-11-01' },
    { id: 'b3', name: 'Mattiniero', icon: '🌅', description: 'Prenotazione mattutina', dateEarned: '2023-09-20' }
  ],
  bookings: [],
  registeredTournaments: [],
  pendingRequests: []
};

// Helper to ensure consistent aspect ratio images
const getUrl = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=600&h=600`;

export const PRODUCTS: Product[] = [
  // --- GAMES ---
  {
    id: 'g1',
    name: 'Catan',
    category: ProductCategory.GAME,
    description: 'Raccogli risorse e costruisci insediamenti in questo classico gioco di strategia. Perfetto per rovinare amicizie di lunga data.',
    price: 0, 
    image: getUrl('1610890716271-e2fe9e94a541'),
    tags: ['Strategia', 'Famiglia', 'Commercio'],
    rating: 4.8,
    players: '3-4',
    duration: '60-120m'
  },
  {
    id: 'g2',
    name: 'Dungeons & Dragons 5e',
    category: ProductCategory.GAME,
    description: 'Il gioco di ruolo più grande del mondo. Manuali (PHB, DMG, MM) e set di dadi forniti al tavolo.',
    price: 5,
    image: getUrl('1611652022419-a9419f74343d'),
    tags: ['RPG', 'Fantasy', 'Co-op'],
    rating: 5.0,
    players: '2-8',
    duration: '3h+'
  },
  {
    id: 'g3',
    name: 'Wingspan',
    category: ProductCategory.GAME,
    description: 'Un gioco competitivo, basato sulle carte e sulla costruzione di motori per attirare uccelli nella tua riserva.',
    price: 0,
    image: getUrl('1632527386740-56306cd58547'),
    tags: ['Strategia', 'Uccelli', 'Rilassante'],
    rating: 4.7,
    players: '1-5',
    duration: '40-70m'
  },
  {
    id: 'g4',
    name: 'Dixit',
    category: ProductCategory.GAME,
    description: 'Un gioco di narrazione e fantasia. Usa carte illustrate oniriche per ingannare i tuoi avversari.',
    price: 0,
    image: getUrl('1609823528743-4e89e358b14f'), // generic cards
    tags: ['Party', 'Creatività', 'Famiglia'],
    rating: 4.5,
    players: '3-6',
    duration: '30m'
  },
  {
    id: 'g5',
    name: 'Ticket to Ride: Europa',
    category: ProductCategory.GAME,
    description: 'Costruisci linee ferroviarie attraverso l\'Europa vittoriana. Facile da imparare, difficile da smettere.',
    price: 0,
    image: getUrl('1605518216938-7f31b709d043'), // generic board game
    tags: ['Strategia', 'Treni', 'Famiglia'],
    rating: 4.6,
    players: '2-5',
    duration: '30-60m'
  },
  {
    id: 'g6',
    name: 'Exploding Kittens',
    category: ProductCategory.GAME,
    description: 'Una versione strategica della roulette russa, ma con gattini, esplosioni e raggi laser.',
    price: 0,
    image: getUrl('1591143491036-3974c2d36402'), // generic cat/fun
    tags: ['Party', 'Carte', 'Caos'],
    rating: 4.3,
    players: '2-5',
    duration: '15m'
  },
  {
    id: 'g7',
    name: 'Scythe',
    category: ProductCategory.GAME,
    description: 'Strategia dieselpunk ambientata nell\'Europa dell\'Est degli anni \'20. Mech giganti e agricoltura.',
    price: 5,
    image: getUrl('1564052670-4b8a25c138b3'), // generic mech/industrial
    tags: ['Esperto', 'Strategia', 'Area Control'],
    rating: 4.9,
    players: '1-5',
    duration: '115m'
  },
  
  // --- DRINKS ---
  {
    id: 'd1',
    name: 'Pozione di Cura',
    category: ProductCategory.DRINK,
    description: 'Un mix rivitalizzante di mirtillo, vodka e lime. Servito in fiaschetta sferica con ghiaccio secco.',
    price: 8.50,
    image: getUrl('1514362545857-3bc16c4c7d1b'),
    tags: ['Cocktail', 'Dolce', 'Tematico'],
    rating: 4.5,
    alcohol: true
  },
  {
    id: 'd2',
    name: 'Espresso Doppio',
    category: ProductCategory.DRINK,
    description: 'Miscela arabica scura, perfetta per campagne notturne o per svegliarsi dopo una sconfitta.',
    price: 2.50,
    image: getUrl('1514432324607-a09d9b4aefdd'),
    tags: ['Caffè', 'Caldo'],
    rating: 4.2,
    alcohol: false
  },
  {
    id: 'd3',
    name: 'Mana Potion',
    category: ProductCategory.DRINK,
    description: 'Blue Curacao, limonata e gin. Ripristina gli slot incantesimo (e il morale).',
    price: 8.00,
    image: getUrl('1546173159-315724a31696'),
    tags: ['Cocktail', 'Frizzante', 'Tematico'],
    rating: 4.6,
    alcohol: true
  },
  {
    id: 'd4',
    name: 'Birra Artigianale IPA',
    category: ProductCategory.DRINK,
    description: 'IPA locale "Dragon\'s Breath". Note agrumate e finale amaro come una sconfitta al 20 naturale.',
    price: 6.50,
    image: getUrl('1575037644865-f5aa406385a9'),
    tags: ['Birra', 'Amaro', 'Locale'],
    rating: 4.7,
    alcohol: true
  },
  {
    id: 'd5',
    name: 'Tè Verde Elfico',
    category: ProductCategory.DRINK,
    description: 'Tè matcha cerimoniale con un tocco di miele e gelsomino. Rilassante e zen.',
    price: 4.00,
    image: getUrl('1627435601361-ec25f5b1d0e5'),
    tags: ['Tè', 'Caldo', 'Bio'],
    rating: 4.4,
    alcohol: false
  },

  // --- SNACKS ---
  {
    id: 's1',
    name: 'Nachos Supreme',
    category: ProductCategory.SNACK,
    description: 'Montagna di chips di tortilla con formaggio fuso, jalapeños, fagioli neri e salsa piccante.',
    price: 6.00,
    image: getUrl('1513456852971-30c0b8199d4d'),
    tags: ['Salato', 'Condivisione'],
    rating: 4.6
  },
  {
    id: 's2',
    name: 'Ciotola di Loot (Popcorn)',
    category: ProductCategory.SNACK,
    description: 'Popcorn caramellati e salati mescolati. Attenzione alle dita unte sulle carte!',
    price: 3.50,
    image: getUrl('1578849278619-e73505e9610f'),
    tags: ['Dolce/Salato', 'Leggero'],
    rating: 4.1
  },
  {
    id: 's3',
    name: 'Tavern Burger',
    category: ProductCategory.SNACK,
    description: 'Mini burger di manzo con cheddar e cipolla caramellata. Facile da mangiare con una mano.',
    price: 9.00,
    image: getUrl('1568901346375-23c9450c58cd'),
    tags: ['Pasto', 'Carne'],
    rating: 4.8
  },
  {
    id: 's4',
    name: 'Pretzel Gigante',
    category: ProductCategory.SNACK,
    description: 'Un enorme pretzel morbido e caldo, servito con senape al miele.',
    price: 4.50,
    image: getUrl('1585238342024-78d387f4a707'), // bread/pretzel
    tags: ['Salato', 'Tedesco'],
    rating: 4.3
  }
];

export const TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    title: 'Venerdì Night Magic',
    date: '2023-11-24T18:00:00',
    type: TournamentType.STANDARD,
    gameSystem: 'Magic: The Gathering',
    frequency: 'Settimanale',
    includes: ['1 Booster Pack', 'Drink Piccolo'],
    rules: 'Formato Standard. Turni alla svizzera da 50 minuti.',
    slots: 32,
    filled: 28,
    status: 'upcoming',
    image: getUrl('1593508512255-86ab42a8e620'),
    description: 'Il classico appuntamento del venerdì sera. Porta il tuo mazzo standard e competi per premi in bustine e carte promo.',
    participantsList: [
        { name: 'Jace B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jace' },
        { name: 'Liliana V.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lili' },
        { name: 'Chandra N.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chandra' },
        { name: 'Garruk', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Garruk' }
    ]
  },
  {
    id: 't2',
    title: 'Ombre della Valle',
    date: '2023-11-25T14:00:00',
    type: TournamentType.DND,
    gameSystem: 'D&D 5e',
    frequency: 'One-shot (4 Ore)',
    includes: ['Personaggio Pre-generato', 'Snack al Tavolo'],
    rules: 'Livello 5. Point Buy. Manuali ufficiali concessi.',
    slots: 6,
    filled: 4,
    status: 'upcoming',
    dm: 'Matt M.',
    image: getUrl('1519074069444-1ba4fff66d16'),
    description: 'Una tetra avventura horror investigativa. Il villaggio di Krezk è silenzioso... troppo silenzioso. Richiesta approvazione del Master.',
    participantsList: [
        { name: 'Laura', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura' },
        { name: 'Travis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Travis' },
        { name: 'Sam', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
        { name: 'Liam', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam' }
    ]
  },
  {
    id: 't3',
    title: 'Campionato Catan',
    date: '2023-11-10T10:00:00',
    type: TournamentType.STANDARD,
    gameSystem: 'Catan',
    frequency: 'Evento Unico',
    includes: ['Pranzo', 'Trofeo'],
    slots: 16,
    filled: 16,
    status: 'completed',
    image: getUrl('1605518216938-7f31b709d043'),
    description: 'Qualificazione regionale per il campionato nazionale. Scontri diretti a 4 giocatori.',
    participantsList: []
  },
  {
    id: 't4',
    title: 'Speed Chess Blitz',
    date: '2023-12-01T19:00:00',
    type: TournamentType.BLITZ,
    gameSystem: 'Scacchi',
    frequency: 'Mensile',
    includes: ['Drink'],
    rules: '5+0 Blitz. Doppia Eliminazione.',
    slots: 20,
    filled: 12,
    status: 'upcoming',
    image: getUrl('1529699218752-1d0e03809201'),
    description: 'Torneo lampo per chi pensa veloce. Orologio da 5 minuti, nessun incremento. Toccato-mosso.',
    participantsList: [
        { name: 'Magnus', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Magnus' },
        { name: 'Hikaru', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hikaru' }
    ]
  }
];

export const MOCK_REVENUE_DATA = [
  { name: 'Lun', value: 400 },
  { name: 'Mar', value: 300 },
  { name: 'Mer', value: 600 },
  { name: 'Gio', value: 800 },
  { name: 'Ven', value: 1500 },
  { name: 'Sab', value: 2000 },
  { name: 'Dom', value: 1200 },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    tournamentId: 't2', // Linked to the tournament logic
    title: 'Maledizione di Strahd',
    system: 'D&D 5e',
    dm: 'Dungeon Master X',
    image: getUrl('1519074069444-1ba4fff66d16'),
    description: 'Una campagna di horror gotico nelle terre di Barovia.',
    party: [
      { id: 'ch1', name: 'Grommash', class: 'Barbaro', level: 5, race: 'Orco', status: 'Alive', player: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grom' },
      { id: 'ch2', name: 'Elara', class: 'Mago', level: 5, race: 'Elfo', status: 'Alive', player: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elara' },
      { id: 'ch3', name: 'Stabby', class: 'Ladro', level: 5, race: 'Halfling', status: 'Dead', player: 'Mike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stabby' }
    ],
    sessions: [
      { id: 's1', title: 'Nella Nebbia', date: '2023-10-01', summary: 'Il gruppo è entrato a Barovia ed è stato subito attaccato dai lupi.', location: 'Boschi di Svalich' },
      { id: 's2', title: 'Casa della Morte', date: '2023-10-08', summary: 'Il gruppo ha esplorato una casa inquietante. Stabby è caduto in una trappola.', location: 'Villaggio di Barovia' }
    ],
    notes: [
      { id: 'n1', title: 'Strahd von Zarovich', content: 'Il signore vampiro della terra. Evitare a tutti i costi.', type: 'NPC' },
      { id: 'n2', title: 'Spada del Sole', content: 'Una lama leggendaria detta distruggere i non morti.', type: 'Loot' }
    ]
  },
  {
    id: 'c2',
    title: 'Cyberpunk Red: Pioggia al Neon',
    system: 'Cyberpunk Red',
    dm: 'Netrunner V',
    image: getUrl('1533109721025-d1ae7ee7c1e1'),
    description: 'Alta tecnologia, bassa vita. Sopravvivere a Night City un ingaggio alla volta.',
    party: [
      { id: 'ch4', name: 'Zero', class: 'Netrunner', level: 3, race: 'Umano', status: 'Alive', player: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zero' },
      { id: 'ch5', name: 'Tank', class: 'Solo', level: 3, race: 'Cyborg', status: 'Alive', player: 'Dave', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tank' }
    ],
    sessions: [
      { id: 's3', title: 'Il Furto Dati', date: '2023-11-15', summary: 'Infiltrati nella torre Arasaka. Le cose si sono fatte rumorose.', location: 'Torre Arasaka' }
    ],
    notes: [
      { id: 'n3', title: 'Fixer: Wakako', content: 'Offre lavori ben pagati ma pericolosi.', type: 'NPC' }
    ]
  }
];