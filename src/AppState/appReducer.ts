import { AppState } from "./types";

enum ActionType {
  "LOAD_DATA",
  "NEXT_CARD",
}

type LoadDataAction = {
  type: ActionType.LOAD_DATA;
  payload: { cards: string[]; currentCard: string };
};

type NextCardAction = { type: ActionType.NEXT_CARD };

type AppAction = LoadDataAction | NextCardAction;

export function appReducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case ActionType.LOAD_DATA: {
      const random = Math.floor(Math.random() * action.payload.cards.length);
      const nextCard = action.payload.cards[random];

      return {
        nextCard: `${nextCard}`,
        remainingCards: action.payload.cards,
        usedCards: [action.payload.currentCard],
      };
    }
    case ActionType.NEXT_CARD: {
      const random = Math.floor(Math.random() * state.remainingCards.length);
      const nextCard = state.remainingCards.length
        ? state.remainingCards[random]
        : "";

      state.remainingCards.splice(random, 1);

      if (state.nextCard) {
        state.usedCards.push(state.nextCard);
      }

      return { ...state, nextCard: `${nextCard}` };
    }
    default:
      return state;
  }
}
