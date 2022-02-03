export type GameMode = "en" | "hiragana" | "kanji" | "kana";

export interface AppState {
  currentCard: string;
  remainingCards: string[];
  usedCards: string[];
  wrongCards: string[];
  correctCards: string[];
  nextCard: string;
  gameMode: GameMode;
}

export enum AppActionType {
  "LOAD_DATA",
  "NEXT_CARD",
  "SET_GAME",
}

type LoadDataAction = {
  type: AppActionType.LOAD_DATA;
  payload: { cardIds: string[]; nextCard: string };
};

type NextCardAction = { type: AppActionType.NEXT_CARD };

type SetGameAction = {
  type: AppActionType.SET_GAME;
  payload: { gameMode: GameMode };
};

export type AppAction = LoadDataAction | NextCardAction | SetGameAction;
