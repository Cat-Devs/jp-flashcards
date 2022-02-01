import { AppState, AppAction, AppActionType } from "./types";

export function appReducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case AppActionType.LOAD_DATA: {
      if (state.currentCard) {
        return state;
      }

      const random = Math.floor(Math.random() * action.payload.cardIds.length);
      const nextCard = action.payload.cardIds[random];

      return {
        nextCard: `${nextCard}`,
        currentCard: `${action.payload.randomCard}`,
        remainingCards: action.payload.cardIds,
        usedCards: [],
      };
    }

    case AppActionType.NEXT_CARD: {
      console.warn("Next card");

      const random = Math.floor(Math.random() * state.remainingCards.length);
      const nextCard = state.remainingCards.length
        ? state.remainingCards[random]
        : "";

      state.remainingCards.splice(random, 1);

      if (state.nextCard) {
        state.usedCards.push(state.currentCard);
      }

      return {
        ...state,
        currentCard: `${state.nextCard}`,
        nextCard: `${nextCard}`,
      };
    }
    default:
      return state;
  }
}
