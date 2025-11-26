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
  registeredTournaments: string[]; // IDs of confirmed tournaments
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

export enum TournamentType {
  STANDARD = 'Standard',
  DND = 'Campagna D&D',
  PARTY = 'Party',
  BLITZ = 'Blitz'
}

export interface TournamentParticipant {
  name: string;
  avatar: string;
}

export interface Tournament {
  id: string;
  title: string;
  date: string;
  type: TournamentType;
  gameSystem?: string; // e.g., "Magic: The Gathering", "D&D 5e"
  frequency?: string; // e.g., "One-shot", "Settimanale", "Mensile"
  includes?: string[]; // e.g., ["Booster Pack", "Drink Incluso", "Cena"]
  rules?: string; // Brief rules summary
  slots: number;
  filled: number;
  participantsList?: TournamentParticipant[]; // New field for showing users
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  image: string;
  description: string;
  dm?: string;
}

export interface StatData {
  name: string;
  value: number;
}

// D&D Tracker Types
export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  status: 'Alive' | 'Dead' | 'Missing';
  avatar: string;
  player: string;
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
  system: string;
  dm: string;
  image: string;
  description: string;
  party: Character[];
  sessions: Session[];
  notes: CampaignNote[];
  tournamentId?: string; // Link to the tournament entry
}