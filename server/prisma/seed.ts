import prisma from '../src/prisma';
import * as bcrypt from 'bcrypt';

async function main() {
    // 0. CLEANUP (Optional: remove if you want to keep old data)
    console.log('🧹 Cleaning up database...');
    // Delete in order of dependencies (child first)
    await prisma.campaignNote.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.campaignParticipant.deleteMany({});
    await prisma.campaignRequest.deleteMany({});
    await prisma.campaign.deleteMany({});
    // await prisma.character.deleteMany({}); // Keep characters if possible
    // await prisma.tournament.deleteMany({});

    // 1. Create Users
    const password = await bcrypt.hash('password123', 10);

    // Create Admin/DM
    const dmVal = await prisma.user.upsert({
        where: { email: 'valentina@example.com' },
        update: {
            password: password,
            role: 'staff'
        },
        create: {
            id: 'u_dm1',
            name: 'Valentina R.',
            email: 'valentina@example.com',
            password,
            role: 'staff',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400&h=400',
            gamesPlayed: 150,
            winRate: 85,
            favoriteGame: 'Dungeons & Dragons',
            totalSpent: 0,
            xp: 5000,
            badges: {
                create: [
                    { name: 'Master Storyteller', icon: '📜', description: 'DM Leggendario', dateEarned: new Date('2023-01-15') }
                ]
            }
        },
    });

    // Create Super Admin
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            password: password,
            role: 'admin'
        },
        create: {
            id: 'u_admin',
            name: 'Super Admin',
            email: 'admin@example.com',
            password,
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
            gamesPlayed: 0,
            winRate: 0,
            favoriteGame: 'System',
            totalSpent: 0,
            xp: 99999
        }
    });

    // Create Player
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
            favoriteGame: 'Magic: The Gathering',
            totalSpent: 350.50,
            xp: 1250,
            badges: {
                create: [
                    { name: 'Dice Goblin', icon: '🎲', description: 'Ordinati 20+ oggetti', dateEarned: new Date('2023-11-01') }
                ]
            }
        },
    });

    console.log('✅ Created users');

    // 2. Create Characters for Alex
    const char1 = await prisma.character.create({
        data: {
            userId: alex.id,
            name: 'Grommash',
            race: 'Orc',
            class: 'Barbarian',
            level: 5,
            status: 'ALIVE',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grom',
            stats: JSON.stringify({ str: 18, dex: 14, con: 16, int: 8, wis: 10, cha: 12 }),
            skills: JSON.stringify(['Athletics', 'Intimidation']),
            hp: 65,
            maxHp: 65,
            inventory: JSON.stringify(['Greataxe', 'Potion of Healing']),
            background: 'Outlander',
            alignment: 'Chaotic Good'
        }
    });

    console.log('✅ Created characters');

    // 3. Create Products (Games, Drinks, Snacks)
    const products = [
        // --- GAMES (20 items) ---
        {
            id: 'g_mtg',
            name: 'Magic: The Gathering',
            category: 'game',
            description: 'Il gioco di carte collezionabili originale. Strategia, fortuna e lore infinito.',
            price: 5,
            image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['TCG', 'Strategy', 'Fantasy']),
            players: '2',
            duration: '45m',
            rating: 4.8
        },
        {
            id: 'g_catan',
            name: 'Catan',
            category: 'game',
            description: 'Raccogli risorse, costruisci strade e insediamenti. Attento al ladro!',
            price: 0,
            image: 'https://images.unsplash.com/photo-1610890716271-e2fe9e94a541?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategy', 'Family', 'Trading']),
            players: '3-4',
            duration: '60-90m',
            rating: 4.5
        },
        {
            id: 'g_dnd',
            name: 'Dungeons & Dragons 5e',
            category: 'game',
            description: 'Il GDR più famoso del mondo. Crea il tuo eroe e vivi avventure epiche.',
            price: 5,
            image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['RPG', 'Fantasy', 'Co-op']),
            players: '2-8',
            duration: '3h+',
            rating: 4.9
        },
        {
            id: 'g_chess',
            name: 'Scacchi',
            category: 'game',
            description: 'Il gioco di strategia per eccellenza. Facile da imparare, impossibile da padroneggiare.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1529699218752-1d0e03809201?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategy', 'Classic', 'Abstract']),
            players: '2',
            duration: '30m+',
            rating: 4.7
        },
        {
            id: 'g_ttr',
            name: 'Ticket to Ride',
            category: 'game',
            description: 'Costruisci la tua rete ferroviaria attraverso il continente.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Family', 'Strategy', 'Trains']),
            players: '2-5',
            duration: '30-60m',
            rating: 4.6
        },
        {
            id: 'g_carcassonne',
            name: 'Carcassonne',
            category: 'game',
            description: 'Piazza tessere e costruisci la campagna francese medievale.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Family', 'Tile Placement']),
            players: '2-5',
            duration: '35m',
            rating: 4.4
        },
        {
            id: 'g_dixit',
            name: 'Dixit',
            category: 'game',
            description: 'Un gioco di narrazione e immaginazione con carte oniriche.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Party', 'Creativity']),
            players: '3-6',
            duration: '30m',
            rating: 4.5
        },
        {
            id: 'g_splendor',
            name: 'Splendor',
            category: 'game',
            description: 'Diventa un ricco mercante del Rinascimento collezionando gemme.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategy', 'Engine Building']),
            players: '2-4',
            duration: '30m',
            rating: 4.6
        },
        {
            id: 'g_7wonders',
            name: '7 Wonders',
            category: 'game',
            description: 'Guida una delle sette grandi città del mondo antico.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategy', 'Drafting']),
            players: '2-7',
            duration: '30m',
            rating: 4.7
        },
        {
            id: 'g_pandemic',
            name: 'Pandemic',
            category: 'game',
            description: 'Collaborate per salvare il mondo da quattro malattie mortali.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1584036561566-b93a50208c3c?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Co-op', 'Strategy']),
            players: '2-4',
            duration: '45m',
            rating: 4.6
        },
        {
            id: 'g_azul',
            name: 'Azul',
            category: 'game',
            description: 'Decora le pareti del Palazzo Reale di Evora con azulejos.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Abstract', 'Strategy']),
            players: '2-4',
            duration: '30-45m',
            rating: 4.7
        },
        {
            id: 'g_wingspan',
            name: 'Wingspan',
            category: 'game',
            description: 'Attira i migliori uccelli nella tua riserva naturale.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd1?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategy', 'Engine Building', 'Nature']),
            players: '1-5',
            duration: '40-70m',
            rating: 4.8
        },
        {
            id: 'g_scythe',
            name: 'Scythe',
            category: 'game',
            description: 'Guerra e agricoltura in un 1920 alternativo con mech dieselpunk.',
            price: 5,
            image: 'https://images.unsplash.com/photo-1614853316476-de00d14cb1fc?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategy', 'Area Control', 'Complex']),
            players: '1-5',
            duration: '90-115m',
            rating: 4.9
        },
        {
            id: 'g_gloomhaven',
            name: 'Gloomhaven',
            category: 'game',
            description: 'Combattimento tattico in un mondo fantasy oscuro e persistente.',
            price: 10,
            image: 'https://images.unsplash.com/photo-1642436846278-29219323717d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['RPG', 'Co-op', 'Campaign']),
            players: '1-4',
            duration: '60-120m',
            rating: 5.0
        },
        {
            id: 'g_root',
            name: 'Root',
            category: 'game',
            description: 'Guerra asimmetrica nei boschi tra gatti, uccelli e topi.',
            price: 5,
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategy', 'War', 'Cute']),
            players: '2-4',
            duration: '60-90m',
            rating: 4.7
        },
        {
            id: 'g_tmars',
            name: 'Terraforming Mars',
            category: 'game',
            description: 'Rendi Marte abitabile gestendo una corporazione futuristica.',
            price: 5,
            image: 'https://images.unsplash.com/photo-1614728853913-3e32043697a9?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategy', 'Sci-Fi', 'Complex']),
            players: '1-5',
            duration: '120m',
            rating: 4.8
        },
        {
            id: 'g_brass',
            name: 'Brass: Birmingham',
            category: 'game',
            description: 'Rivoluzione industriale nelle Midlands inglesi. Strategia economica pura.',
            price: 5,
            image: 'https://images.unsplash.com/photo-1565514020176-db792f4b6d9d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Economic', 'Strategy', 'Complex']),
            players: '2-4',
            duration: '60-120m',
            rating: 4.9
        },
        {
            id: 'g_arknova',
            name: 'Ark Nova',
            category: 'game',
            description: 'Progetta e gestisci uno zoo moderno e scientificamente avanzato.',
            price: 5,
            image: 'https://images.unsplash.com/photo-1596727147705-54a9d0c2067d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategy', 'Animals', 'Complex']),
            players: '1-4',
            duration: '90-150m',
            rating: 4.8
        },
        {
            id: 'g_monopoly',
            name: 'Monopoly',
            category: 'game',
            description: 'Il classico gioco di contrattazione immobiliare.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1611371805429-861991483e8e?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Classic', 'Family']),
            players: '2-8',
            duration: '60-180m',
            rating: 3.5
        },
        {
            id: 'g_risk',
            name: 'RisiKo!',
            category: 'game',
            description: 'Il gioco di strategia che distrugge le amicizie dal 1957.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategy', 'War', 'Classic']),
            players: '3-6',
            duration: '120m+',
            rating: 4.0
        },

        // --- DRINKS (15 items) ---
        {
            id: 'd_potion',
            name: 'Pozione di Cura',
            category: 'drink',
            description: 'Cocktail rosso rivitalizzante (Vodka, Mirtillo, Lime).',
            price: 8.50,
            image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Cocktail', 'Alcoholic', 'Signature']),
            alcohol: true,
            rating: 4.9
        },
        {
            id: 'd_mana',
            name: 'Pozione di Mana',
            category: 'drink',
            description: 'Cocktail blu energetico (Gin, Blue Curaçao, Tonica).',
            price: 8.50,
            image: 'https://images.unsplash.com/photo-1536935338788-843bb6d778c5?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Cocktail', 'Alcoholic', 'Signature']),
            alcohol: true,
            rating: 4.8
        },
        {
            id: 'd_beer_ipa',
            name: 'Birra Artigianale IPA',
            category: 'drink',
            description: 'Luppolata e intensa, note agrumate.',
            price: 6.00,
            image: 'https://images.unsplash.com/photo-1575037644865-f5aa406385a9?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Beer', 'Alcoholic']),
            alcohol: true,
            rating: 4.5
        },
        {
            id: 'd_beer_lager',
            name: 'Birra Lager Bionda',
            category: 'drink',
            description: 'Fresca e dissetante, un classico.',
            price: 5.00,
            image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Beer', 'Alcoholic']),
            alcohol: true,
            rating: 4.2
        },
        {
            id: 'd_beer_stout',
            name: 'Birra Stout Scura',
            category: 'drink',
            description: 'Corposa con note di caffè e cioccolato.',
            price: 6.50,
            image: 'https://images.unsplash.com/photo-1559526323-cb2f2fe2591b?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Beer', 'Alcoholic']),
            alcohol: true,
            rating: 4.6
        },
        {
            id: 'd_cola',
            name: 'Cola',
            category: 'drink',
            description: 'La classica bibita gassata.',
            price: 3.00,
            image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Soft Drink', 'Cold']),
            alcohol: false,
            rating: 4.0
        },
        {
            id: 'd_fanta',
            name: 'Aranciata',
            category: 'drink',
            description: 'Bibita frizzante all\'arancia.',
            price: 3.00,
            image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Soft Drink', 'Cold']),
            alcohol: false,
            rating: 4.0
        },
        {
            id: 'd_sprite',
            name: 'Gassosa',
            category: 'drink',
            description: 'Bibita frizzante limone e lime.',
            price: 3.00,
            image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Soft Drink', 'Cold']),
            alcohol: false,
            rating: 4.0
        },
        {
            id: 'd_water',
            name: 'Acqua Minerale',
            category: 'drink',
            description: 'Naturale o Frizzante.',
            price: 1.50,
            image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Water', 'Cold']),
            alcohol: false,
            rating: 5.0
        },
        {
            id: 'd_coffee',
            name: 'Espresso Doppio',
            category: 'drink',
            description: 'Per le sessioni notturne.',
            price: 2.50,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Coffee', 'Hot']),
            alcohol: false,
            rating: 4.7
        },
        {
            id: 'd_tea',
            name: 'Tè Caldo',
            category: 'drink',
            description: 'Selezione di tè pregiati.',
            price: 3.00,
            image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Tea', 'Hot']),
            alcohol: false,
            rating: 4.3
        },
        {
            id: 'd_redbull',
            name: 'Energy Drink',
            category: 'drink',
            description: 'Ti mette le ali quando stai perdendo.',
            price: 4.00,
            image: 'https://images.unsplash.com/photo-1626125345510-4703ee923858?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Energy', 'Cold']),
            alcohol: false,
            rating: 4.1
        },
        {
            id: 'd_mojito',
            name: 'Mojito',
            category: 'drink',
            description: 'Rum, menta, lime, zucchero e soda.',
            price: 8.00,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Cocktail', 'Alcoholic']),
            alcohol: true,
            rating: 4.8
        },
        {
            id: 'd_spritz',
            name: 'Aperol Spritz',
            category: 'drink',
            description: 'L\'aperitivo italiano per eccellenza.',
            price: 6.00,
            image: 'https://images.unsplash.com/photo-1560512823-8db03e1b0949?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Cocktail', 'Alcoholic']),
            alcohol: true,
            rating: 4.7
        },
        {
            id: 'd_negroni',
            name: 'Negroni',
            category: 'drink',
            description: 'Gin, Vermouth Rosso, Campari. Forte e deciso.',
            price: 9.00,
            image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Cocktail', 'Alcoholic']),
            alcohol: true,
            rating: 4.9
        },

        // --- SNACKS (15 items) ---
        {
            id: 's_nachos',
            name: 'Nachos Supreme',
            category: 'snack',
            description: 'Con formaggio fuso, jalapeños, guacamole e panna acida.',
            price: 6.50,
            image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Salty', 'Sharing', 'Mexican']),
            rating: 4.8
        },
        {
            id: 's_burger',
            name: 'Tavern Burger',
            category: 'snack',
            description: 'Mini burger succosi con patatine.',
            price: 9.00,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Meal', 'Meat']),
            rating: 4.5
        },
        {
            id: 's_chips',
            name: 'Patatine Fritte',
            category: 'snack',
            description: 'Croccanti e dorate, servite con salse.',
            price: 4.00,
            image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd75ec?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Salty', 'Sharing']),
            rating: 4.3
        },
        {
            id: 's_popcorn',
            name: 'Popcorn',
            category: 'snack',
            description: 'Cestino gigante di popcorn al burro.',
            price: 3.50,
            image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Salty', 'Sharing']),
            rating: 4.1
        },
        {
            id: 's_pretzels',
            name: 'Pretzel Bavarese',
            category: 'snack',
            description: 'Morbido pretzel salato, perfetto con la birra.',
            price: 3.00,
            image: 'https://images.unsplash.com/photo-1599321955726-9080d944c712?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Salty', 'Bakery']),
            rating: 4.4
        },
        {
            id: 's_candy',
            name: 'Mix Caramelle',
            category: 'snack',
            description: 'Ciotola di caramelle gommose assortite.',
            price: 3.00,
            image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Sweet', 'Sharing']),
            rating: 4.2
        },
        {
            id: 's_chocolate',
            name: 'Barretta Cioccolato',
            category: 'snack',
            description: 'Cioccolato fondente artigianale.',
            price: 2.50,
            image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Sweet']),
            rating: 4.6
        },
        {
            id: 's_toast',
            name: 'Toast Classico',
            category: 'snack',
            description: 'Prosciutto cotto e formaggio filante.',
            price: 4.50,
            image: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Meal', 'Salty']),
            rating: 4.0
        },
        {
            id: 's_club',
            name: 'Club Sandwich',
            category: 'snack',
            description: 'Triplo strato con pollo, bacon, lattuga e pomodoro.',
            price: 10.00,
            image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Meal', 'Meat']),
            rating: 4.7
        },
        {
            id: 's_pizza',
            name: 'Trancio Pizza',
            category: 'snack',
            description: 'Margherita o Salame piccante.',
            price: 3.50,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Meal', 'Salty']),
            rating: 4.5
        },
        {
            id: 's_hotdog',
            name: 'Hot Dog',
            category: 'snack',
            description: 'Wurstel, ketchup, maionese e cipolla fritta.',
            price: 5.00,
            image: 'https://images.unsplash.com/photo-1612392062631-94dd85fa2dd0?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Meal', 'Meat']),
            rating: 4.3
        },
        {
            id: 's_onion',
            name: 'Anelli di Cipolla',
            category: 'snack',
            description: 'Fritti in pastella di birra.',
            price: 4.50,
            image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Salty', 'Fried']),
            rating: 4.4
        },
        {
            id: 's_wings',
            name: 'Chicken Wings',
            category: 'snack',
            description: 'Ali di pollo piccanti con salsa BBQ.',
            price: 7.00,
            image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Meal', 'Meat', 'Spicy']),
            rating: 4.8
        },
        {
            id: 's_brownie',
            name: 'Brownie',
            category: 'snack',
            description: 'Dolce al cioccolato con noci.',
            price: 3.50,
            image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Sweet', 'Dessert']),
            rating: 4.7
        },
        {
            id: 's_muffin',
            name: 'Muffin Mirtilli',
            category: 'snack',
            description: 'Soffice muffin ai mirtilli.',
            price: 3.00,
            image: 'https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Sweet', 'Bakery']),
            rating: 4.3
        }
    ];

    console.log(`Starting to seed ${products.length} products...`);
    for (const p of products) {
        try {
            await prisma.product.upsert({
                where: { id: p.id },
                update: {},
                create: p
            });
            // console.log(`Seeded product: ${p.id}`);
        } catch (error) {
            console.error(`Error seeding product ${p.id}:`, error);
        }
    }

    console.log('✅ Created products');

    // 4. Create Tournaments
    const tournaments = [
        {
            id: 't1',
            title: 'Venerdì Night Magic',
            date: new Date('2025-12-06T18:00:00'),
            type: 'Standard',
            gameId: 'g_mtg',
            gameSystem: 'Magic: The Gathering',
            entryFee: 15.00,
            prizes: JSON.stringify({ first: 'Box Set', second: '10 Boosters', third: '5 Boosters' }),
            slots: 32,
            filled: 28,
            status: 'ongoing',
            image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Il classico appuntamento del venerdì sera. Porta il tuo mazzo standard.',
            rules: 'Formato Standard. Turni alla svizzera da 50 minuti.',
            includes: JSON.stringify(['Drink', 'Promo Card'])
        },
        {
            id: 't2',
            title: 'Modern Masters',
            date: new Date('2025-12-14T15:00:00'),
            type: 'Competitive',
            gameId: 'g_mtg',
            gameSystem: 'Magic: The Gathering',
            entryFee: 25.00,
            prizes: JSON.stringify({ first: 'Cash Prize 100€', top8: 'Promo Cards' }),
            slots: 24,
            filled: 12,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Torneo mensile Modern con premi importanti.',
            rules: 'Formato Modern. Decklist obbligatoria.',
            includes: JSON.stringify(['Lunch', 'Exclusive Playmat'])
        },
        {
            id: 't3',
            title: 'Catan Championship',
            date: new Date('2025-11-10T10:00:00'), // Past date
            type: 'Standard',
            gameId: 'g_catan',
            gameSystem: 'Catan',
            entryFee: 10.00,
            prizes: JSON.stringify({ first: 'Trophy + Game Expansion' }),
            slots: 16,
            filled: 16,
            status: 'completed',
            image: 'https://images.unsplash.com/photo-1610890716271-e2fe9e94a541?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Chi sarà il signore di Catan?',
            rules: 'Regole base + Espansione Marinai.',
            includes: JSON.stringify(['Snack'])
        },
        {
            id: 't4',
            title: 'Scacchi Blitz Night',
            date: new Date('2025-12-20T20:00:00'),
            type: 'Blitz',
            gameId: 'g_chess',
            gameSystem: 'Scacchi',
            entryFee: 5.00,
            prizes: JSON.stringify({ first: 'Drink Card 50€' }),
            slots: 20,
            filled: 8,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1529699218752-1d0e03809201?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Torneo lampo 5+0. Adrenalina pura.',
            rules: '5 minuti a testa, nessun incremento.',
            includes: JSON.stringify(['Free Drink'])
        },
        {
            id: 't5',
            title: 'D&D One-Shot: La Tomba',
            date: new Date('2025-12-08T16:00:00'),
            type: 'D&D One-Shot',
            gameId: 'g_dnd',
            gameSystem: 'D&D 5e',
            entryFee: 10.00,
            prizes: JSON.stringify({ first: 'Gloria Eterna' }),
            slots: 6,
            filled: 5,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Avventura singola per livelli 3-5. Personaggi pregenerati disponibili.',
            rules: '5e Ruleset. Roleplay heavy.',
            includes: JSON.stringify(['Character Sheet', 'Dice Set Loan'])
        },
        {
            id: 't6',
            title: 'Ticket to Ride: Europe',
            date: new Date('2025-12-15T19:00:00'),
            type: 'Standard',
            gameId: 'g_ttr',
            gameSystem: 'Ticket to Ride',
            entryFee: 8.00,
            prizes: JSON.stringify({ first: 'Ticket to Ride: Japan Expansion' }),
            slots: 10,
            filled: 4,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Costruisci la rete ferroviaria più lunga d\'Europa.',
            rules: 'Mappa Europa. Regole standard.',
            includes: JSON.stringify(['Snack'])
        },
        {
            id: 't7',
            title: 'Carcassonne Open',
            date: new Date('2025-12-22T15:00:00'),
            type: 'Standard',
            gameId: 'g_carcassonne',
            gameSystem: 'Carcassonne',
            entryFee: 5.00,
            prizes: JSON.stringify({ first: 'Carcassonne 20th Anniversary' }),
            slots: 16,
            filled: 10,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Costruisci città, strade e monasteri.',
            rules: 'Gioco base + Fiume.',
            includes: JSON.stringify(['Drink'])
        },
        {
            id: 't8',
            title: 'Splendor Duel',
            date: new Date('2025-12-10T21:00:00'),
            type: 'Duel',
            gameId: 'g_splendor',
            gameSystem: 'Splendor',
            entryFee: 5.00,
            prizes: JSON.stringify({ first: 'Splendor Marvel' }),
            slots: 8,
            filled: 6,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Torneo 1vs1 per i migliori mercanti.',
            rules: 'Eliminazione diretta.',
            includes: JSON.stringify(['Drink'])
        },
        {
            id: 't9',
            title: 'Wingspan Birdwatching',
            date: new Date('2026-01-05T14:00:00'),
            type: 'Relaxed',
            gameId: 'g_wingspan',
            gameSystem: 'Wingspan',
            entryFee: 12.00,
            prizes: JSON.stringify({ first: 'Wingspan Oceania Expansion' }),
            slots: 10,
            filled: 2,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd1?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Un pomeriggio tranquillo tra uccelli e uova.',
            rules: 'Gioco base + Europa.',
            includes: JSON.stringify(['Tea & Biscuits'])
        },
        {
            id: 't10',
            title: 'Terraforming Mars Marathon',
            date: new Date('2026-01-12T10:00:00'),
            type: 'Marathon',
            gameId: 'g_tmars',
            gameSystem: 'Terraforming Mars',
            entryFee: 15.00,
            prizes: JSON.stringify({ first: '3D Printed Tiles Set' }),
            slots: 10,
            filled: 9,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1614728853913-3e32043697a9?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Una giornata intera dedicata alla conquista di Marte.',
            rules: 'Drafting iniziale. Tutte le espansioni ammesse.',
            includes: JSON.stringify(['Lunch', 'Unlimited Coffee'])
        },
        {
            id: 't11',
            title: '7 Wonders Draft',
            date: new Date('2025-12-18T20:30:00'),
            type: 'Draft',
            gameId: 'g_7wonders',
            gameSystem: '7 Wonders',
            entryFee: 5.00,
            prizes: JSON.stringify({ first: '7 Wonders Duel' }),
            slots: 14,
            filled: 7,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Costruisci la tua civiltà in 3 ere.',
            rules: 'Gioco base.',
            includes: JSON.stringify(['Drink'])
        },
        {
            id: 't12',
            title: 'Azul Masterpiece',
            date: new Date('2025-12-28T16:00:00'),
            type: 'Standard',
            gameId: 'g_azul',
            gameSystem: 'Azul',
            entryFee: 8.00,
            prizes: JSON.stringify({ first: 'Azul Summer Pavilion' }),
            slots: 12,
            filled: 11,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Crea il mosaico più bello.',
            rules: 'Variante avanzata (lato grigio).',
            includes: JSON.stringify(['Snack'])
        },
        {
            id: 't13',
            title: 'Root: Woodland War',
            date: new Date('2026-01-20T19:00:00'),
            type: 'Competitive',
            gameId: 'g_root',
            gameSystem: 'Root',
            entryFee: 10.00,
            prizes: JSON.stringify({ first: 'Root Plushie' }),
            slots: 8,
            filled: 3,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Chi dominerà la foresta?',
            rules: 'Draft fazioni.',
            includes: JSON.stringify(['Drink'])
        },
        {
            id: 't14',
            title: 'RisiKo! Nazionale',
            date: new Date('2025-12-30T14:00:00'),
            type: 'Tournament',
            gameId: 'g_risk',
            gameSystem: 'RisiKo!',
            entryFee: 5.00,
            prizes: JSON.stringify({ first: 'RisiKo! Prestige' }),
            slots: 24,
            filled: 20,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'L\'ultimo torneo dell\'anno.',
            rules: 'Regolamento da torneo (RTU).',
            includes: JSON.stringify(['Snack'])
        },
        {
            id: 't15',
            title: 'Magic: Commander Night',
            date: new Date('2025-12-12T19:00:00'),
            type: 'Casual',
            gameId: 'g_mtg',
            gameSystem: 'Magic: The Gathering',
            entryFee: 5.00,
            prizes: JSON.stringify({ random: 'Promo Packs' }),
            slots: 40,
            filled: 35,
            status: 'ongoing',
            image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Serata Commander multiplayer.',
            rules: 'Rule 0 discussion encouraged.',
            includes: JSON.stringify(['Drink'])
        }
    ];

    for (const t of tournaments) {
        await prisma.tournament.upsert({
            where: { id: t.id },
            update: t, // Update fields if it exists
            create: t,
        });
    }

    console.log('✅ Created tournaments');

    // 5. Create Campaigns
    const campaigns = [
        {
            title: 'L\'Ombra del Re Stregone',
            type: 'LONG_CAMPAIGN',
            system: 'D&D 5e',
            dmId: dmVal.id,
            startDate: new Date('2025-09-15'),
            frequency: 'Venerdì (21:00)',
            status: 'ACTIVE',
            image: '/images/D&Dcard.png',
            description: 'Un\'antica minaccia si risveglia nel nord. Le nebbie si addensano e i morti camminano. Il Re Stregone di Angmar è tornato, e cerca l\'anello del potere perduto da secoli nella Valle dei Re. Il gruppo dovrà unire le forze per impedire l\'apocalisse.',
            levelRange: '5-12',
            rules: '**Regole della Casa:**\n- Critici fanno danno massimo + dado.\n- Pozioni si bevono come azione bonus.\n- Niente Evil alignment senza approvazione.\n- Rispetto assoluto al tavolo.',
            plot: 'Il Re Stregone è in realtà il padre del Paladino, corrotto da un patto oscuro. Il talismano che cercano è diviso in 3 frammenti.',
            minPlayers: 4,
            maxPlayers: 6,
            sessions: [
                { title: 'Sessione 0: La Locanda', date: new Date('2025-09-15'), summary: 'Creazione schede e background. Primo incontro alla locanda del Puledro Impennato.', location: 'Brea' },
                { title: 'S1: L\'Agguato dei Goblin', date: new Date('2025-09-22'), summary: 'Il gruppo ha sconfitto l\'avanguardia goblin e trovato la mappa antica.', location: 'Foresta Vecchia' },
                { title: 'S2: Il Tempio Dimenticato', date: new Date('2025-09-29'), summary: 'Scoperta la prima runa di potere. Il Chierico è quasi morto per una trappola.', location: 'Rovine di Arnor' },
                { title: 'S3: Tradimento!', date: new Date('2025-10-06'), summary: 'L\'NPC guida si è rivelato un cultista. Combattimento epico sul ponte di pietra.', location: 'Ponte dei Sospiri' },
                { title: 'S4: Riposo Lungo', date: new Date('2025-10-13'), summary: 'Shopping session in città. Nuove armi per il Barbaro.', location: 'Gran Burrone' }
            ],
            notes: [
                { title: 'Profezia', content: 'Quando le tre lune si allineano, il cancello si aprirà.', type: 'Lore', userId: dmVal.id },
                { title: 'Drophar il Mercante', content: 'Nano avido ma onesto. Vende pozioni a metà prezzo se gli portate funghi rari.', type: 'NPC', userId: dmVal.id },
                { title: 'Spada delle Anime', content: '+2 Longsword, richiede attunement. Parla nella testa di chi la usa.', type: 'Loot', userId: dmVal.id },
                { content: 'Ragazzi per venerdì chi porta le patatine?', type: 'CHAT', userId: dmVal.id, createdAt: new Date('2025-10-14T10:00:00').toISOString() },
                { content: 'Io porto birra e pretzel!', type: 'CHAT', userId: 'u1', createdAt: new Date('2025-10-14T10:05:00').toISOString() },
                { content: 'Il master ha detto che livelliamo?', type: 'CHAT', userId: 'u1', createdAt: new Date('2025-10-14T10:30:00').toISOString() },
                { content: 'Se sopravvivete al boss di fine dungeon... forse.', type: 'CHAT', userId: dmVal.id, createdAt: new Date('2025-10-14T10:35:00').toISOString() },
            ]
        },
        {
            title: 'Cyberpunk: Neon Rain',
            type: 'SHORT_CAMPAIGN',
            system: 'Cyberpunk Red',
            dmId: dmVal.id,
            startDate: new Date('2026-01-15'),
            frequency: 'Bi-settimanale',
            status: 'RECRUITING',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
            description: 'Un colpo alla Arasaka Tower andato male. Ora tutta Night City vi dà la caccia. Avete 72 ore per pulire il vostro nome o finire in discarica.',
            levelRange: 'Rank 4',
            minPlayers: 3,
            maxPlayers: 5,
            sessions: [],
            notes: []
        },
        {
            title: 'Call of Cthulhu: Il Faro',
            type: 'ONE_SHOT',
            system: 'Call of Cthulhu 7e',
            dmId: dmVal.id,
            startDate: new Date('2025-12-24'),
            frequency: 'One-Shot',
            status: 'RECRUITING',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
            description: 'Un faro isolato sulla costa del Maine. Il custode è scomparso. E le stelle stanno iniziando a muoversi in modi sbagliati.',
            levelRange: 'Investigatori',
            minPlayers: 2,
            maxPlayers: 4,
            sessions: [],
            notes: []
        }
    ];

    for (const c of campaigns) {
        await prisma.campaign.create({
            data: {
                title: c.title,
                type: c.type,
                system: c.system,
                dmId: c.dmId,
                startDate: c.startDate,
                frequency: c.frequency,
                status: c.status,
                image: c.image,
                description: c.description,
                levelRange: c.levelRange,
                rules: c.rules, // Added field
                plot: c.plot,   // Added field
                minPlayers: c.minPlayers, // Added field
                maxPlayers: c.maxPlayers, // Added field
                sessions: {
                    create: c.sessions
                },
                notes: {
                    create: c.notes
                }
            }
        });
    }

    // Add Alex to 'L'Ombra del Re Stregone' campaign
    const epicCampaign = await prisma.campaign.findFirst({ where: { title: 'L\'Ombra del Re Stregone' } });
    if (epicCampaign) {
        // Add Alex (Barbarian)
        await prisma.campaignParticipant.create({
            data: {
                campaignId: epicCampaign.id,
                characterId: char1.id,
                userId: alex.id
            }
        });

        // Add a second dummy character for variety using DM user as player just for visuals
        const rogueInfo = await prisma.character.create({
            data: {
                user: { connect: { id: dmVal.id } },
                name: 'Vanya',
                race: 'Elf',
                class: 'Rogue',
                level: 5,
                status: 'ALIVE',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vanya',
                stats: JSON.stringify({ str: 10, dex: 20, con: 12, int: 14, wis: 12, cha: 10 }),
                skills: JSON.stringify(['Stealth', 'Sleight of Hand']),
                hp: 45, maxHp: 45, background: 'Criminal', alignment: 'Neutral'
            }
        })

        await prisma.campaignParticipant.create({
            data: {
                campaignId: epicCampaign.id,
                characterId: rogueInfo.id,
                userId: dmVal.id
            }
        });
    }

    console.log('✅ Created campaigns');
    console.log('\n🎉 Database seeding completed successfully!\n');
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
