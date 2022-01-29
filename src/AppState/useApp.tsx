import { useContext } from "react";
import { AppContext } from "./AppContext";

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(`useApp must be used within an AppProvider`);
  }

  const { state, dispatch } = context;

  const nextCard = () => {
    dispatch({ type: "nextCard" });
  };

  return {
    nextCard,
    state,
    dispatch,
  };
}
