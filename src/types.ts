import type { CardMode, CardResult, GameLevel, GameMode } from './AppState';
export type { CardMode, GameLevel, GameMode, CardResult };

export interface CardData {
  id: string;
  accuracy?: string;
}

export interface FlashCardData {
  id: string;
  category: string;
  level: string;
  en: string;
  jp: string;
  kanji?: string;
  hiragana?: string;
  katakana?: string;
  romaji?: string;
}

export interface PrepareGameConfig {
  gameMode: GameMode;
  cardMode?: CardMode;
  gameLevel?: GameLevel;
}

export interface UserData {
  id: string;
  type: 'user' | 'card';
  cards: CardData[];
  current_level: GameLevel;
}
