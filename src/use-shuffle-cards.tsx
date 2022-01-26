import { WrappedBuildError } from "next/dist/server/next-server";
import { useEffect, useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "loadData": {
      console.warn("load data");
      const random = Math.floor(Math.random() * action.payload.cards.length);
      const nextCard = action.payload.cards[random];

      return {
        nextCard: `${nextCard}`,
        remainingCards: action.payload.cards,
        usedCards: [action.payload.currentCard],
      };
    }
    case "nextCard": {
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
export const useShuffleCards = (cardIds: string[] = []) => {
  const initialState = {
    remainingCards: cardIds,
    usedCards: [],
    nextCard: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.warn(state);
  }, [state]);

  const nextCard = () => {
    dispatch({ type: "nextCard" });
  };

  const getState = () => {
    console.warn("getState");
  };

  return { nextCard, getState, state, dispatch };
};
