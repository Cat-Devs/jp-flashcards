export type CardMode = 'en' | 'hiragana' | 'kanji' | 'kana';
export type GameLevel = '1' | '2' | '3' | '4';
export type CardResult = 'correct' | 'wrong' | 'void';
export type GameMode = 'guest' | 'learn' | 'practice';

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
  cardMode: CardMode;
  gameLevel: GameLevel;
  gameMode: GameMode;
}

export enum AppActionType {
  'LOAD_DATA',
  'LOADING_SOUND',
  'NEXT_CARD',
  'SET_GAME',
  'SET_LEVEL',
  'SET_MODE',
  'LOADING',
  'PLAY_WRONG_CARDS',
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

type NextCardAction = {
  type: AppActionType.NEXT_CARD;
  payload: CardResult;
};

type SetGameAction = {
  type: AppActionType.SET_GAME;
  payload: CardMode;
};

type SetLevelAction = {
  type: AppActionType.SET_LEVEL;
  payload: GameLevel;
};

type SetModeAction = {
  type: AppActionType.SET_MODE;
  payload: GameMode;
};

type PlayWrongCardsAction = {
  type: AppActionType.PLAY_WRONG_CARDS;
};

export type AppAction =
  | LoadingAction
  | LoadingSoundAction
  | LoadDataAction
  | NextCardAction
  | SetGameAction
  | SetModeAction
  | SetLevelAction
  | PlayWrongCardsAction;
