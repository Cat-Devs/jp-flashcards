export type CardMode = 'en' | 'hiragana' | 'kanji' | 'kana';
export type GameLevel = '1' | '2' | '3' | '4' | '5';
export type CardResult = 'correct' | 'wrong' | 'void';
export type GameMode = 'guest' | 'learn' | 'weak' | 'practice';

export interface UserStats {
  userHash: string;
  learnedCards: number;
  weakCards: number;
  level: number;
}

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
  userStats: UserStats;
}

export enum AppActionType {
  'LOAD_DATA',
  'LOADING_SOUND',
  'NEXT_CARD',
  'SET_GAME_MODE',
  'SET_CARDS',
  'SET_LEVEL',
  'SET_USER_STATS',
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

type SetUserStatsAction = {
  type: AppActionType.SET_USER_STATS;
  payload: UserStats;
};

export type AppAction =
  | LoadingAction
  | LoadingSoundAction
  | LoadDataAction
  | NextCardAction
  | SetCardModeAction
  | SetGameModeAction
  | SetLevelAction
  | PlayWrongCardsAction
  | SetUserStatsAction;
