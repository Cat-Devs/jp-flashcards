import { useCallback, useContext } from "react";
import { useRouter } from "next/router";

import { AppContext } from "./AppContext";
import { AppActionType, GameLevel, GameMode } from "./types";
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
      const cardIds: string[] = cards
        .filter((card) => {
          if (state.gameMode === "hiragana") {
            return card.hiragana;
          } else if (state.gameMode === "kanji") {
            return card.kanji;
          }
          return true;
        })
        .filter((card: FlashCardData) => {
          const selectedLevel = Number(state.gameLevel);
          const cardLevel = Number(card.level);

          return selectedLevel >= cardLevel;
        })
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
    [dispatch, router, state.gameMode, state.gameLevel]
  );

  const setGame = useCallback(
    (gameMode: GameMode) => {
      dispatch({
        type: AppActionType.SET_GAME,
        payload: gameMode,
      });
    },
    [dispatch]
  );

  const setLevel = useCallback(
    (gameLevel: GameLevel) => {
      dispatch({
        type: AppActionType.SET_LEVEL,
        payload: gameLevel,
      });
    },
    [dispatch]
  );

  const goHome = useCallback(() => {
    router.push(`/`);
  }, [router]);

  return {
    loading: Boolean(state.loading),
    currentCard: state.currentCard,
    gameMode: state.gameMode,
    gameLevel: state.gameLevel,
    setGame,
    setLevel,
    loadData,
    nextCard,
    goHome,
  };
}
