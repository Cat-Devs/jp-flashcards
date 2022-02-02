import { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { AppContext } from "./AppContext";
import { AppActionType } from "./types";

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
    } else {
      router.push(`/shuffle/${state.currentCard}`);
    }
  };

  const loadData = (cardIds: string[], randomCard: string) => {
    const nextCard = state.currentCard || randomCard;

    dispatch({
      type: AppActionType.LOAD_DATA,
      payload: { randomCard, cardIds },
    });

    router.push(`/shuffle/${nextCard}`);
  };

  const goHome = () => {
    router.push(`/`);
  };

  return {
    state,
    loadData,
    nextCard,
    goHome,
  };
}
