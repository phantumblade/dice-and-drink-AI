import prisma from '../src/prisma';
import * as bcrypt from 'bcrypt';

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

    console.log('✅ Created user:', alex.name);

    // 2. Create Products - 10 Games, 10 Drinks, 10 Snacks
    const products = [
        // GAMES (10)
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
            id: 'g3',
            name: 'Wingspan',
            category: 'game',
            description: 'Costruisci il più bel rifugio ornitologico. Un gioco di carte engine-building con splendide illustrazioni di uccelli.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Strategia', 'Natura', 'Engine-Building']),
            rating: 4.9,
            players: '1-5',
            duration: '40-70m'
        },
        {
            id: 'g4',
            name: 'Gloomhaven',
            category: 'game',
            description: 'Epico dungeon crawler tattico cooperativo. Campagna legacy con combattimenti strategici impegnativi.',
            price: 8,
            image: 'https://images.unsplash.com/photo-1606503153255-59d7e30b5719?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Co-op', 'Tattico', 'Campagna']),
            rating: 4.9,
            players: '1-4',
            duration: '90-150m'
        },
        {
            id: 'g5',
            name: 'Terraforming Mars',
            category: 'game',
            description: 'Rendi Marte abitabile! Gioca carte, gestisci risorse e competi per trasformare il pianeta rosso.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Sci-Fi', 'Engine-Building', 'Carte']),
            rating: 4.7,
            players: '1-5',
            duration: '90-120m'
        },
        {
            id: 'g6',
            name: 'Codenames',
            category: 'game',
            description: 'Party game di associazione di parole. Due squadre gareggiano per individuare i loro agenti segreti.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1611891487750-c0f5c1093c4e?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Party', 'Parole', 'Squadre']),
            rating: 4.6,
            players: '4-8',
            duration: '15-30m'
        },
        {
            id: 'g7',
            name: 'Azul',
            category: 'game',
            description: 'Gioco astratto di piazzamento tessere ispirato alle piastrelle portoghesi. Elegante e accattivante.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Astratto', 'Pattern', 'Famiglia']),
            rating: 4.7,
            players: '2-4',
            duration: '30-45m'
        },
        {
            id: 'g8',
            name: '7 Wonders',
            category: 'game',
            description: 'Costruisci una meraviglia del mondo antico. Card drafting competitivo con civilizzazioni storiche.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Civiltà', 'Carte', 'Drafting']),
            rating: 4.5,
            players: '3-7',
            duration: '30-45m'
        },
        {
            id: 'g9',
            name: 'Betrayal at House on the Hill',
            category: 'game',
            description: 'Esplora una casa infestata... finché uno di voi tradisce! Ogni partita è diversa con 50+ scenari horror.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1509715513011-e394f0cb20c4?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Horror', 'Esplorazione', 'Narrativo']),
            rating: 4.4,
            players: '3-6',
            duration: '60m'
        },
        {
            id: 'g10',
            name: 'Pandemic',
            category: 'game',
            description: 'Salvate il mondo insieme! Co-op intenso contro malattie globali. Il lavoro di squadra è essenziale.',
            price: 0,
            image: 'https://images.unsplash.com/photo-1584463404100-c26ba7de3f76?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Co-op', 'Strategia', 'Tematico']),
            rating: 4.6,
            players: '2-4',
            duration: '45m'
        },

        // DRINKS (10)
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
            id: 'd2',
            name: 'Elisir di Mana',
            category: 'drink',
            description: 'Blue curaçao, gin e scintille commestibili. Magico e luminoso, perfetto per i lanciatori di incantesimi.',
            price: 9.00,
            image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Cocktail', 'Magico', 'Blu']),
            rating: 4.7,
            alcohol: true
        },
        {
            id: 'd3',
            name: 'Soffio del Drago',
            category: 'drink',
            description: 'Tequila piccante con peperoncino jalapeño e lime. Per i coraggiosi che osano sfidare il drago!',
            price: 8.00,
            image: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Shot', 'Piccante', 'Forte']),
            rating: 4.3,
            alcohol: true
        },
        {
            id: 'd4',
            name: 'Ispirazione Bardica',
            category: 'drink',
            description: 'Champagne con sciroppo di sambuco e glitter commestibili. Elegante e festivo.',
            price: 10.00,
            image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Champagne', 'Elegante', 'Festa']),
            rating: 4.8,
            alcohol: true
        },
        {
            id: 'd5',
            name: 'Colpo Critico',
            category: 'drink',
            description: 'Whiskey shot con cannella e zenzero. Un 20 naturale di sapore!',
            price: 7.00,
            image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Shot', 'Speziato', 'Whiskey']),
            rating: 4.4,
            alcohol: true
        },
        {
            id: 'd6',
            name: 'Prova di Furtività',
            category: 'drink',
            description: 'Rum scuro con cola e carbone attivo. Nero come la notte, dolce come la vittoria.',
            price: 8.50,
            image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Rum', 'Scuro', 'Misterioso']),
            rating: 4.2,
            alcohol: true
        },
        {
            id: 'd7',
            name: 'Nat 20',
            category: 'drink',
            description: 'Selezione rotante di birre artigianali locali. Chiedi al barista la birra del giorno!',
            price: 6.00,
            image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Birra', 'Artigianale', 'Locale']),
            rating: 4.6,
            alcohol: true
        },
        {
            id: 'd8',
            name: 'Vino Elfico',
            category: 'drink',
            description: 'Sangria bianca con fiori di sambuco e frutti di bosco. Delicata e rinfrescante.',
            price: 7.50,
            image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Vino', 'Sangria', 'Floreale']),
            rating: 4.5,
            alcohol: true
        },
        {
            id: 'd9',
            name: 'Birra Nanica',
            category: 'drink',
            description: 'Stout scura e robusta con note di cioccolato e caffè. Forte come un nano!',
            price: 6.50,
            image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Stout', 'Scura', 'Intensa']),
            rating: 4.7,
            alcohol: true
        },
        {
            id: 'd10',
            name: 'Infuso del Mago',
            category: 'drink',
            description: 'Cocktail al caffè con Irish cream e un tocco di liquore al whiskey. Energizzante e decadente.',
            price: 9.50,
            image: 'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Caffè', 'Cremoso', 'Liquore']),
            rating: 4.6,
            alcohol: true
        },

        // SNACKS (10)
        {
            id: 's1',
            name: 'Nachos Supreme',
            category: 'snack',
            description: 'Montagna di chips di tortilla con formaggio fuso, jalapeños, fagioli neri e salsa piccante.',
            price: 6.00,
            image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Salato', 'Condivisione']),
            rating: 4.6
        },
        {
            id: 's2',
            name: 'Uova del Drago',
            category: 'snack',
            description: 'Scotch eggs croccanti con salsiccia speziata e uovo sodo. Serviti con senape al miele.',
            price: 7.50,
            image: 'https://images.unsplash.com/photo-1587486937773-f5de4e301f3d?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Proteico', 'Sostanzioso', 'Britannico']),
            rating: 4.7
        },
        {
            id: 's3',
            name: 'Tagliere degli Avventurieri',
            category: 'snack',
            description: 'Selezione di formaggi artigianali, salumi pregiati, olive, noci e marmellate. Perfetto per il gruppo.',
            price: 12.00,
            image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Gourmet', 'Condivisione', 'Variegato']),
            rating: 4.9
        },
        {
            id: 's4',
            name: 'Forziere del Mimic',
            category: 'snack',
            description: 'Patatine fritte caricate in una scatola a forma di tesoro con bacon, formaggio cheddar e cipollotti.',
            price: 8.00,
            image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Fritto', 'Caricato', 'Tematico']),
            rating: 4.5
        },
        {
            id: 's5',
            name: 'Ali di Gufo-Orso',
            category: 'snack',
            description: 'Alette di pollo buffalo piccanti con salsa blu cheese e sedano croccante. 8 pezzi.',
            price: 7.00,
            image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Piccante', 'Pollo', 'Classico']),
            rating: 4.6
        },
        {
            id: 's6',
            name: 'Gelatine del Cubo',
            category: 'snack',
            description: 'Shot di gelatina alla vodka in forma di cubo. Vari gusti frutti. Tremolano come la cosa vera!',
            price: 5.00,
            image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Dolce', 'Party', 'Gelatina']),
            rating: 4.3
        },
        {
            id: 's7',
            name: 'Delizia Halfling',
            category: 'snack',
            description: 'Mini burger sliders con manzo angus, formaggio cheddar e cipolla caramellata. 3 pezzi.',
            price: 9.00,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Burger', 'Mini', 'Sostanzioso']),
            rating: 4.8
        },
        {
            id: 's8',
            name: 'Popcorn del Mago',
            category: 'snack',
            description: 'Mix di popcorn con tre sapori: caramello, formaggio e piccante. Magicamente buono!',
            price: 4.50,
            image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Dolce', 'Salato', 'Mix']),
            rating: 4.4
        },
        {
            id: 's9',
            name: 'Pretzel della Taverna',
            category: 'snack',
            description: 'Pretzel morbidi serviti caldi con salsa al formaggio alla birra e senape tedesca.',
            price: 6.50,
            image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Tedesco', 'Caldo', 'Formaggio']),
            rating: 4.7
        },
        {
            id: 's10',
            name: 'Quesadilla della Missione',
            category: 'snack',
            description: 'Quesadilla con pollo, peperoni, cipolla e formaggio. Servita con pico de gallo e panna acida.',
            price: 8.50,
            image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&q=80&w=600&h=600',
            tags: JSON.stringify(['Messicano', 'Sostanzioso', 'Saporito']),
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

    console.log(`✅ Created ${products.length} products (${products.filter(p => p.category === 'game').length} games, ${products.filter(p => p.category === 'drink').length} drinks, ${products.filter(p => p.category === 'snack').length} snacks)`);

    // 3. Create Tournaments - 20 total, synchronized with games
    const tournaments = [
        // Magic: The Gathering tournaments (4)
        {
            id: 't1',
            title: 'Venerdì Night Magic',
            date: new Date('2024-12-06T18:00:00'),
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
            title: 'Modern Masters',
            date: new Date('2024-12-14T15:00:00'),
            type: 'Modern',
            gameSystem: 'Magic: The Gathering',
            frequency: 'Mensile',
            includes: JSON.stringify(['3 Booster Packs', 'Snack']),
            rules: 'Formato Modern. Eliminazione diretta dopo turni svizzeri.',
            slots: 24,
            filled: 18,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Torneo mensile Modern con premi importanti. Tutti i set moderni permessi.'
        },
        {
            id: 't3',
            title: 'Commander Clash',
            date: new Date('2024-12-21T14:00:00'),
            type: 'Commander',
            gameSystem: 'Magic: The Gathering',
            frequency: 'Bi-settimanale',
            includes: JSON.stringify(['Drink Medio', 'Snack da Tavolo']),
            rules: 'Commander 1v1 o multiplayer. Lista ban ufficiale.',
            slots: 16,
            filled: 12,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Scontro epico di comandanti! Porta il tuo mazzo più creativo.'
        },
        {
            id: 't4',
            title: 'Draft Domenicale',
            date: new Date('2024-12-08T11:00:00'),
            type: 'Draft',
            gameSystem: 'Magic: The Gathering',
            frequency: 'Settimanale',
            includes: JSON.stringify(['3 Booster per Draft', 'Caffè Gratis']),
            rules: 'Booster draft dell\'ultimo set. Turni a tempo.',
            slots: 8,
            filled: 8,
            status: 'full',
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Draft mattutino perfetto per iniziare la domenica con strategia pura!'
        },

        // D&D campaigns and one-shots (4)
        {
            id: 't5',
            title: 'Ombre della Valle',
            date: new Date('2024-12-07T14:00:00'),
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
            description: 'Una tetra avventura horror investigativa. Il villaggio di Krezk è silenzioso... troppo silenzioso.'
        },
        {
            id: 't6',
            title: 'Maledizione di Strahd - Campagna',
            date: new Date('2024-12-10T19:00:00'),
            type: 'Campagna D&D',
            gameSystem: 'D&D 5e',
            frequency: 'Settimanale',
            includes: JSON.stringify(['Manuali Forniti', 'Dadi al Tavolo', 'Drink Incluso']),
            rules: 'Livello 1-10. Campagna lunga, impegno settimanale richiesto.',
            slots: 5,
            filled: 5,
            status: 'full',
            dm: 'Valentina R.',
            image: 'https://images.unsplash.com/photo-1596727827808-49e0ef6cd3e1?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Campagna gotica horror nel regno di Barovia. Sessione zero completata, campagna in corso.'
        },
        {
            id: 't7',
            title: 'Avventura per Principianti',
            date: new Date('2024-12-15T15:00:00'),
            type: 'One-Shot D&D',
            gameSystem: 'D&D 5e',
            frequency: 'One-shot (3 Ore)',
            includes: JSON.stringify(['Tutto il Materiale', 'Introduzione Regole', 'Snack']),
            rules: 'Livello 1. Perfetto per nuovi giocatori!',
            slots: 6,
            filled: 3,
            status: 'upcoming',
            dm: 'Marco D.',
            image: 'https://images.unsplash.com/photo-1551927336-575d9e8f6d0d?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Mai giocato a D&D? Questa è la tua occasione! Avventura introduttiva guidata.'
        },
        {
            id: 't8',
            title: 'La Tomba dell\'Orrore',
            date: new Date('2024-12-28T10:00:00'),
            type: 'Dungeon Crawl',
            gameSystem: 'D&D 5e',
            frequency: 'One-shot (6 Ore)',
            includes: JSON.stringify(['Pranzo Incluso', 'Personaggi Pre-gen Liv 15']),
            rules: 'Alta mortalità. Porta personaggi di backup!',
            slots: 6,
            filled: 6,
            status: 'full',
            dm: 'Andrea V.',
            image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Il dungeon più letale della storia di D&D. Solo per veterani coraggiosi!'
        },

        // Other board game tournaments (8)
        {
            id: 't9',
            title: 'Campionato Wingspan',
            date: new Date('2024-12-12T17:00:00'),
            type: 'Torneo',
            gameSystem: 'Wingspan',
            frequency: 'Mensile',
            includes: JSON.stringify(['Snack', 'Drink']),
            rules: 'Regole base + espansione Europea. 3 round.',
            slots: 20,
            filled: 15,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Chi costruirà il migliore rifugio ornitologico? Torneo mensile con premi a tema!'
        },
        {
            id: 't10',
            title: 'Lega Gloomhaven',
            date: new Date('2024-12-09T18:30:00'),
            type: 'Campagna',
            gameSystem: 'Gloomhaven',
            frequency: 'Settimanale',
            includes: JSON.stringify(['Materiali Forniti', 'Birra/Soft Drink']),
            rules: 'Campagna cooperativa in corso. Nuovi giocatori benvenuti.',
            slots: 4,
            filled: 4,
            status: 'full',
            image: 'https://images.unsplash.com/photo-1606503153255-59d7e30b5719?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Unisciti alla compagnia di mercenari più letale di Gloomhaven!'
        },
        {
            id: 't11',
            title: 'Terraforming Mars Championship',
            date: new Date('2024-12-20T16:00:00'),
            type: 'Competitivo',
            gameSystem: 'Terraforming Mars',
            frequency: 'Trimestrale',
            includes: JSON.stringify(['Drink Tematico', 'Snack Spaziali']),
            rules: 'Regole base + tutte le espansioni. Drafting corporazioni.',
            slots: 15,
            filled: 9,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Chi terraformerà Marte più efficacemente? Torneo trimestrale ad alta competizione!'
        },
        {
            id: 't12',
            title: 'Battaglia Codenames',
            date: new Date('2024-12-13T20:00:00'),
            type: 'Squadre',
            gameSystem: 'Codenames',
            frequency: 'Bi-settimanale',
            includes: JSON.stringify(['Snack Condivisi', 'Drink per Vincitori']),
            rules: 'Squadre di 4-6 persone. Torneo a eliminazione.',
            slots: 24,
            filled: 16,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1611891487750-c0f5c1093c4e?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Serata party competitiva! Forma la tua squadra di spie!'
        },
        {
            id: 't13',
            title: 'Maestri di Azul',
            date: new Date('2024-12-18T15:00:00'),
            type: 'Torneo',
            gameSystem: 'Azul',
            frequency: 'Mensile',
            includes: JSON.stringify(['Tè/Caffè', 'Pasticcini']),
            rules: 'Gioco base. 4 round svizzeri + finale.',
            slots: 16,
            filled: 11,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Eleganza astratta! Torneo pomeridiano rilassato ma competitivo.'
        },
        {
            id: 't14',
            title: 'Scontro di Civiltà - 7 Wonders',
            date: new Date('2024-12-11T19:00:00'),
            type: 'Torneo',
            gameSystem: '7 Wonders',
            frequency: 'Mensile',
            includes: JSON.stringify(['Drink Antico', 'Snack Mediterraneo']),
            rules: 'Gioco base + Leaders. 3 round.',
            slots: 21,
            filled: 14,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Costruite le meraviglie più grandiose! Torneo serale con atmosfera storica.'
        },
        {
            id: 't15',
            title: 'Notte Horror a Casa sulla Collina',
            date: new Date('2024-12-27T21:00:00'),
            type: 'Evento Speciale',
            gameSystem: 'Betrayal at House on the Hill',
            frequency: 'Evento Unico',
            includes: JSON.stringify(['Ambientazione Tematica', 'Drink Horror', 'Snack Macabri']),
            rules: 'Sessioni multiple. Luci soffuse, atmosfera inquietante.',
            slots: 18,
            filled: 6,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1509715513011-e394f0cb20c4?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Evento speciale di fine anno! Casa decorata, atmosfera horror, tradimenti garantiti!'
        },
        {
            id: 't16',
            title: 'Pandemic: Salviamo il Mondo!',
            date: new Date('2024-12-16T18:00:00'),
            type: 'Co-op Challenge',
            gameSystem: 'Pandemic',
            frequency: 'Mensile',
            includes: JSON.stringify(['Drink Salutare', 'Snack Energetico']),
            rules: 'Difficoltà Eroica. Squadre di 4 giocatori.',
            slots: 12,
            filled: 8,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1584463404100-c26ba7de3f76?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Sfida cooperativa ad alta tensione! Riuscirete a salvare l\'umanità?'
        },

        // Mixed board game nights (4)
        {
            id: 't17',
            title: 'Serata Giochi Misti',
            date: new Date('2024-12-05T19:30:00'),
            type: 'Open Gaming',
            gameSystem: 'Vari',
            frequency: 'Settimanale',
            includes: JSON.stringify(['Libreria Completa', 'Snack Condivisi']),
            rules: 'Porta il tuo gioco o scegline uno dalla nostra collezione!',
            slots: 30,
            filled: 22,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1592061956369-6301a27ea799?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Serata libera per giocare a quello che vuoi! Tavoli aperti e atmosfera rilassata.'
        },
        {
            id: 't18',
            title: 'Famiglia Board Game Day',
            date: new Date('2024-12-22T14:00:00'),
            type: 'Famiglia',
            gameSystem: 'Giochi Famiglia',
            frequency: 'Mensile',
            includes: JSON.stringify(['Giochi per Tutte le Età', 'Snack Bambini', 'Drink Adulti']),
            rules: 'Benvenuti bambini accompagnati! Giochi adatti a tutte le età.',
            slots: 40,
            filled: 25,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Domenica pomeriggio perfetta per famiglie! Giochi educativi e divertenti.'
        },
        {
            id: 't19',
            title: 'Notte di Giochi Strategici',
            date: new Date('2024-12-19T20:00:00'),
            type: 'Strategy Night',
            gameSystem: 'Giochi Strategici Pesanti',
            frequency: 'Bi-settimanale',
            includes: JSON.stringify(['Caffè Illimitato', 'Snack Energetici']),
            rules: 'Solo giochi weight 3.5+. Preparati per sessioni lunghe!',
            slots: 20,
            filled: 16,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1611891487750-c0f5c1093c4e?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Per veri strateghi! Porta il tuo cervello più affilato e preparati a sessioni intense.'
        },
        {
            id: 't20',
            title: 'Capodanno Ludico 2025',
            date: new Date('2024-12-31T20:00:00'),
            type: 'Evento Speciale',
            gameSystem: 'Misto + Party Games',
            frequency: 'Annuale',
            includes: JSON.stringify(['Buffet Completo', 'Open Bar', 'Countdown Mezzanotte', 'Party Games']),
            rules: 'Festa di Capodanno! Giochi, cibo, drink, e divertimento fino all\'alba!',
            slots: 60,
            filled: 45,
            status: 'upcoming',
            image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Festeggia il 2025 con noi! Notte epica di giochi, cibo, drink e festeggiamenti!'
        }
    ];

    for (const t of tournaments) {
        await prisma.tournament.upsert({
            where: { id: t.id },
            update: {},
            create: t,
        });
    }

    console.log(`✅ Created ${tournaments.length} tournaments`);

    // 4. Create Campaign (existing one)
    const campaign = await prisma.campaign.upsert({
        where: { id: 'c1' },
        update: {},
        create: {
            id: 'c1',
            tournamentId: 't6',
            title: 'Maledizione di Strahd',
            system: 'D&D 5e',
            dm: 'Valentina R.',
            image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=600&h=600',
            description: 'Una campagna di horror gotico nelle terre di Barovia.',
            sessions: {
                create: [
                    { id: 's1', title: 'Nella Nebbia', date: new Date('2024-11-01'), summary: 'Il gruppo è entrato a Barovia ed è stato subito attaccato dai lupi.', location: 'Boschi di Svalich' },
                    { id: 's2', title: 'Casa della Morte', date: new Date('2024-11-08'), summary: 'Il gruppo ha esplorato una casa inquietante. Stabby è caduto in una trappola.', location: 'Villaggio di Barovia' }
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
    const existingChars = await prisma.character.count({ where: { campaignId: 'c1' } });
    if (existingChars === 0) {
        await prisma.character.createMany({
            data: [
                { id: 'ch1', name: 'Grommash', class: 'Barbaro', level: 5, race: 'Orco', status: 'Alive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grom', campaignId: 'c1', userId: 'u1' },
                { id: 'ch2', name: 'Elara', class: 'Mago', level: 5, race: 'Elfo', status: 'Alive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elara', campaignId: 'c1' },
                { id: 'ch3', name: 'Stabby', class: 'Ladro', level: 5, race: 'Halfling', status: 'Dead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stabby', campaignId: 'c1' }
            ],
        });
    }

    console.log('✅ Created campaign with characters');
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
