export type GameMode = "en" | "hiragana" | "kanji" | "kana";
export type GameLevel = "1" | "2" | "3" | "4";

export interface AppState {
  loading: Boolean;
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
  "NEXT_CARD",
  "SET_GAME",
  "SET_LEVEL",
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
  payload: GameMode;
};

type SetLevelAction = {
  type: AppActionType.SET_LEVEL;
  payload: GameLevel;
};

export type AppAction = LoadingAction | LoadDataAction | NextCardAction | SetGameAction | SetLevelAction;
