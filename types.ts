
export enum ClassType {
  FIGHTER = 'FIGHTER',
  MAGE = 'MAGE',
  ROGUE = 'ROGUE'
}

export enum GameStatus {
  OFF = 'OFF',
  START_SCREEN = 'START_SCREEN',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum GameMode {
  EXPLORE = 'EXPLORE',
  COMBAT = 'COMBAT',
  DIALOGUE = 'DIALOGUE'
}

export interface Stats {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stamina: number;
  strength: number;  // Acts as Attack Bonus
  intellect: number; // Acts as Magic Bonus
  agility: number;   // Acts as Flee/Crit Bonus
  defense: number;   // Acts as DR and AC Modifier
}

export interface Player {
  name: string;
  class: ClassType | null;
  stats: Stats;
  inventory: string[];
  currentLocationId: string;
  previousLocationId?: string; // Tracks the last valid tile for 'return' command
  flags: Record<string, boolean>;
  killCount: number; // Tracks number of enemies defeated
  // Combat temp states
  isGuarding?: boolean;
  tempDefenseBonus?: number;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  damageDice: string; // e.g., '1d6'
  attackBonus: number;
  defense: number;
  description: string;
  aggressiveness: number;
  xpReward: number;
  canFlee: boolean;
  dropItem?: string; // Item ID dropped on death
}

export interface Location {
  id: string;
  name: string;
  description: string;
  shortDescription?: string; // For visited tiles
  isConstruction?: boolean; // Triggers "Under Construction" logic
  exits: Record<string, string>;
  lockedExits?: Record<string, { 
    reason: string; 
    keyItem?: string; 
    requiredClass?: ClassType;
    unlockFlag?: string; // If player has this flag, lock is bypassed
  }>;
  items?: string[];
  enemyId?: string;
  randomEncounters?: { enemyId: string; chance: number }[];
  triggers?: (player: Player) => string | null;
}

export interface LogEntry {
  id: string;
  text: string;
  type: 'info' | 'error' | 'success' | 'combat' | 'dialogue' | 'system';
  timestamp: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  url: string;
}
