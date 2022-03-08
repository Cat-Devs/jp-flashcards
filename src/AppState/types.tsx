import { CardData } from '../types';

export type CardMode = 'en' | 'hiragana' | 'kanji' | 'kana';
export type GameLevel = '1' | '2' | '3' | '4' | '5';
export type CardResult = 'correct' | 'wrong' | 'void';
export type GameMode = 'guest' | 'train' | 'weak' | 'practice';

export interface UserState {
  userHash: string;
  learnedCards: number;
  weakCards: number;
  level: number;
}

export interface LoadingState {}
export interface GameState {
  cards: CardData[];
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

export interface LoadingState {
  loading: boolean;
  loadingData: boolean;
}
export interface AppState {
  loading: LoadingState;
  game: GameState;
  user?: UserState;
}

export enum AppActionType {
  'LOAD_DATA',
  'SET_USER',
  'NEXT_CARD',
  'SET_GAME_MODE',
  'SET_CARDS',
  'SET_LEVEL',
  'LOADING',
  'PLAY_WRONG_CARDS',
}

type LoadingAction = {
  type: AppActionType.LOADING;
  payload: boolean;
};

type SetUserAction = {
  type: AppActionType.SET_USER;
  payload: UserState;
};

type LoadDataAction = {
  type: AppActionType.LOAD_DATA;
  payload: { cards: CardData[]; nextCard: string };
};

type NextCardAction = {
  type: AppActionType.NEXT_CARD;
  payload: CardResult;
};

type SetCardModeAction = {
  type: AppActionType.SET_CARDS;
  payload: CardMode;
};

type SetLevelAction = {
  type: AppActionType.SET_LEVEL;
  payload: GameLevel;
};

type SetGameModeAction = {
  type: AppActionType.SET_GAME_MODE;
  payload: GameMode;
};

type PlayWrongCardsAction = {
  type: AppActionType.PLAY_WRONG_CARDS;
};

export type AppAction =
  | LoadingAction
  | LoadDataAction
  | SetUserAction
  | NextCardAction
  | SetCardModeAction
  | SetGameModeAction
  | SetLevelAction
  | PlayWrongCardsAction;
