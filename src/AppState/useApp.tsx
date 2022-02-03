import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { AppContext } from "./AppContext";
import { AppActionType, GameMode } from "./types";

export function useApp() {
  const router = useRouter();
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(`useApp must be used within an AppProvider`);
  }

  const { state, dispatch } = context;

  useEffect(() => {
    sessionStorage.setItem("app-state", JSON.stringify(state));
  }, [state]);

  const nextCard = () => {
    dispatch({ type: AppActionType.NEXT_CARD });

    if (state.nextCard) {
      router.push(`/shuffle/${state.nextCard}`);
    }
  };

  const loadData = (
    cards: string[],
    hiraganaIds: string[],
    kanjiIds: string[]
  ) => {
    if (state.gameMode === "hiragana") {
      const cardIds = hiraganaIds.sort(() => Math.random() - 0.5);
      const nextCard =
        hiraganaIds[String(Math.floor(Math.random() * cardIds.length))];

      dispatch({
        type: AppActionType.LOAD_DATA,
        payload: { cardIds, nextCard },
      });

      return router.push(`/shuffle/${nextCard}`);
    } else if (state.gameMode === "kanji") {
      const cardIds = kanjiIds.sort(() => Math.random() - 0.5);
      const nextCard =
        kanjiIds[String(Math.floor(Math.random() * cardIds.length))];

      dispatch({
        type: AppActionType.LOAD_DATA,
        payload: { cardIds, nextCard },
      });

      return router.push(`/shuffle/${nextCard}`);
    }

    const cardIds = cards.sort(() => Math.random() - 0.5);
    const nextCard = cards[String(Math.floor(Math.random() * cardIds.length))];

    dispatch({
      type: AppActionType.LOAD_DATA,
      payload: { cardIds, nextCard },
    });

    return router.push(`/shuffle/${nextCard}`);
  };

  const setGame = (gameMode: GameMode) => {
    dispatch({
      type: AppActionType.SET_GAME,
      payload: { gameMode },
    });
  };

  const goHome = () => {
    router.push(`/`);
  };

  return {
    currentCard: state.currentCard,
    gameMode: state.gameMode,
    setGame,
    loadData,
    nextCard,
    goHome,
  };
}
