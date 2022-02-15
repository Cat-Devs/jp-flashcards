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
  cardMode: CardMode;
  gameLevel: GameLevel;
  gameMode: GameMode;
}
