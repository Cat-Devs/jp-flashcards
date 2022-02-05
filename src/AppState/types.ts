export type GameMode = "en" | "hiragana" | "kanji" | "kana";

export interface AppState {
  loading: Boolean;
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
  "LOADING",
}

type LoadingAction = {
  type: AppActionType.LOADING;
  payload: boolean;
};

type LoadDataAction = {
  type: AppActionType.LOAD_DATA;
  payload: { cardIds: string[]; nextCard: string };
};

type NextCardAction = { type: AppActionType.NEXT_CARD };

type SetGameAction = {
  type: AppActionType.SET_GAME;
  payload: { gameMode: GameMode };
};

export type AppAction = LoadingAction | LoadDataAction | NextCardAction | SetGameAction;
