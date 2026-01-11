export enum GameState {
  MENU = 'MENU',
  SETUP = 'SETUP',
  LOBBY = 'LOBBY',
  INPUT = 'INPUT', // New phase for Pot Mode
  PASS_N_PLAY = 'PASS_N_PLAY',
  PLAYING = 'PLAYING',
  REVEAL = 'REVEAL',
  REMOTE_MENU = 'REMOTE_MENU',
  REMOTE_LOBBY = 'REMOTE_LOBBY',
  REMOTE_INPUT = 'REMOTE_INPUT', // New phase for Remote Pot Mode
  REMOTE_PLAYING = 'REMOTE_PLAYING',
  REMOTE_REVEAL = 'REMOTE_REVEAL'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Player {
  id: string;
  name: string;
  isImposter: boolean;
  score: number;
  hasViewedRole?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  isPremium?: boolean;
  isNSFW?: boolean;
  isCustom?: boolean; // For Pot Mode
}

export interface WordPack {
  [categoryID: string]: {
    [Difficulty.EASY]: string[];
    [Difficulty.MEDIUM]: string[];
    [Difficulty.HARD]: string[];
  }
}

export interface RoomSettings {
  timerDuration: number; // Seconds. 0 = off
  imposterCount?: number; // 1 or 2
}

export interface RoomData {
  room_code: string;
  host_id: string;
  players: Player[];
  game_state: string;
  current_word: string;
  current_category: string;
  settings?: RoomSettings;
  votes?: Record<string, string>; // voterId -> suspectId
  started_at?: string | null;
  custom_words?: string[]; // Pool of custom words submitted
  starting_player_index?: number; // Index of player who starts the discussion
  used_words?: string[]; // History of words used in this session
}