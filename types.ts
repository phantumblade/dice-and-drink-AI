export enum UserRole {
  GUEST = 'guest',
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  stats?: UserStats;
  badges?: Badge[];
  bookings: Booking[];
  registeredTournaments: { tournamentId: string; tournament: Tournament }[]; // IDs of confirmed tournaments
  campaignsJoined: { campaignId: string; campaign: Campaign; character: Character }[];
  pendingRequests: string[]; // IDs of tournaments waiting for DM approval
}

export interface Booking {
  id: string;
  date: string;
  time: string;
  participants: number;
  duration: number; // hours
  items: CartItem[]; // Pre-ordered items
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface UserStats {
  gamesPlayed: number;
  winRate: number;
  favoriteGame: string;
  totalSpent: number;
  xp: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  dateEarned: string;
}

export enum ProductCategory {
  GAME = 'game',
  DRINK = 'drink',
  SNACK = 'snack'
}

export enum TournamentType {
  STANDARD = 'Standard',
  COMPETITIVE = 'Competitive',
  CASUAL = 'Casual',
  DND = 'D&D One-Shot',
  BLITZ = 'Blitz'
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string;
  tags: string[];
  rating: number;
  players?: string;
  duration?: string;
  alcohol?: boolean;
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
}



export interface TournamentParticipant {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  joinedAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  date: string;
  type: string;
  gameId?: string;
  game?: Product;
  entryFee: number;
  prizes: any; // JSON
  winnerId?: string;
  winner?: {
    id: string;
    name: string;
    avatar: string;
  };
  image: string;
  description: string;
  rules?: string;
  slots: number;
  filled: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants?: TournamentParticipant[];

  // Legacy/Compatibility
  gameSystem?: string;
  frequency?: string;
  includes?: string[];
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  race: string;
  class: string;
  level: number;
  background?: string;
  alignment?: string;
  stats: any; // { str: 10, ... }
  skills: any; // { stealth: +5, ... }
  inventory?: any; // JSON
  hp: number;
  maxHp: number;
  status: 'ALIVE' | 'DEAD' | 'RETIRED';
  avatar: string;
}

export interface CampaignParticipant {
  id: string;
  character: Character;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  joinedAt: string;
}

export interface CampaignRequest {
  id: string;
  character: Character;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  summary: string;
  location: string;
}

export interface CampaignNote {
  id: string;
  title: string;
  content: string;
  type: 'Lore' | 'NPC' | 'Location' | 'Loot';
}

export interface Campaign {
  id: string;
  title: string;
  type: 'ONE_SHOT' | 'SHORT_CAMPAIGN' | 'LONG_CAMPAIGN';
  system: string;
  dm: {
    id: string;
    name: string;
    avatar: string;
  };
  startDate: string;
  frequency: string;
  status: 'RECRUITING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  image: string;
  description: string;
  levelRange: string;
  participants: CampaignParticipant[];
  requests?: CampaignRequest[];
  sessions?: Session[];
  notes?: CampaignNote[];
  _count?: {
    participants: number;
    requests: number;
  };
}