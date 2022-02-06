import { useCallback, useContext } from "react";
import { useRouter } from "next/router";

import { AppContext } from "./AppContext";
import { AppActionType, GameMode } from "./types";
import { FlashCardData } from "../types";

export function useApp() {
  const router = useRouter();
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(`useApp must be used within an AppProvider`);
  }

  const { state, dispatch } = context;

  const nextCard = useCallback(() => {
    dispatch({ type: AppActionType.NEXT_CARD });

    if (state.nextCard) {
      router.push(`/shuffle/${state.nextCard}`);
    }
  }, [dispatch, router, state.nextCard]);

  const loadData = useCallback(
    (cards: FlashCardData[]) => {
      if (state.gameMode === "hiragana") {
        const cardIds = cards
          .filter((card) => card.hiragana)
          .map((card) => card.id)
          .splice(0, 30)
          .sort(() => Math.random() - 0.5);
        const nextCard = cardIds[String(Math.floor(Math.random() * cardIds.length))];

        dispatch({
          type: AppActionType.LOAD_DATA,
          payload: { cardIds, nextCard },
        });

        return router.push(`/shuffle/${nextCard}`);
      } else if (state.gameMode === "kanji") {
        const cardIds = cards
          .filter((card) => card.kanji)
          .map((card) => card.id)
          .splice(0, 30)
          .sort(() => Math.random() - 0.5);
        const nextCard = cardIds[String(Math.floor(Math.random() * cardIds.length))];

        dispatch({
          type: AppActionType.LOAD_DATA,
          payload: { cardIds, nextCard },
        });

        return router.push(`/shuffle/${nextCard}`);
      }

      const cardIds = cards
        .map((card) => card.id)
        .splice(0, 30)
        .sort(() => Math.random() - 0.5);
      const nextCard = cardIds[String(Math.floor(Math.random() * cardIds.length))];

      dispatch({
        type: AppActionType.LOAD_DATA,
        payload: { cardIds, nextCard },
      });

      return router.push(`/shuffle/${nextCard}`);
    },
    [dispatch, router, state.gameMode]
  );

  const setGame = useCallback(
    (gameMode: GameMode) => {
      dispatch({
        type: AppActionType.SET_GAME,
        payload: { gameMode },
      });
    },
    [dispatch]
  );

  const goHome = () => {
    router.push(`/`);
  };

  return {
    loading: Boolean(state.loading),
    currentCard: state.currentCard,
    gameMode: state.gameMode,
    setGame,
    loadData,
    nextCard,
    goHome,
  };
}
