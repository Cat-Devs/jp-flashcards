export interface AppState {
  currentCard: string;
  remainingCards: string[];
  usedCards: string[];
  wrongCards: string[];
  correctCards: string[];
  nextCard: string;
  gameMode: string;
}

export enum AppActionType {
  "LOAD_DATA",
  "NEXT_CARD",
}

type LoadDataAction = {
  type: AppActionType.LOAD_DATA;
  payload: { cardIds: string[]; randomCard: string };
};

type NextCardAction = { type: AppActionType.NEXT_CARD };

export type AppAction = LoadDataAction | NextCardAction;
