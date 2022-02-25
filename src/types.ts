import { CardMode, CardResult, GameLevel, GameMode } from './AppState';
export type { CardMode, GameLevel, GameMode, CardResult };

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
  weak_cards: {
    [id: string]: string;
  };
  learned_cards: string[];
  current_level: GameLevel;
}
