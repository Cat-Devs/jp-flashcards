export type GameMode = "en" | "hiragana" | "kanji" | "kana";
export type GameLevel = "1" | "2" | "3" | "4";

export interface AppState {
  loading: Boolean;
  loadingSound: Boolean;
  loadingData: Boolean;
  currentCard: string;
  remainingCards: string[];
  usedCards: string[];
  wrongCards: string[];
  correctCards: string[];
  nextCard: string;
  gameMode: GameMode;
  gameLevel: GameLevel;
}

export enum AppActionType {
  "LOAD_DATA",
  "LOADING_SOUND",
  "NEXT_CARD",
  "SET_GAME",
  "SET_LEVEL",
  "LOADING",
}

type LoadingAction = {
  type: AppActionType.LOADING;
  payload: boolean;
};

type LoadingSoundAction = {
  type: AppActionType.LOADING_SOUND;
  payload: boolean;
};

type LoadDataAction = {
  type: AppActionType.LOAD_DATA;
  payload: { cardIds: string[]; nextCard: string };
};

type NextCardAction = { type: AppActionType.NEXT_CARD };

type SetGameAction = {
  type: AppActionType.SET_GAME;
  payload: GameMode;
};

type SetLevelAction = {
  type: AppActionType.SET_LEVEL;
  payload: GameLevel;
};

export type AppAction =
  | LoadingAction
  | LoadingSoundAction
  | LoadDataAction
  | NextCardAction
  | SetGameAction
  | SetLevelAction;
