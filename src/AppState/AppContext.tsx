import { createContext, useMemo, useReducer, Dispatch } from "react";
import { appReducer } from "./appReducer";
import { AppState, AppAction, GameMode } from "./types";

export const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
}>({
  state: null,
  dispatch: null,
});

const initialState: AppState = {
  remainingCards: [],
  usedCards: [],
  wrongCards: [],
  correctCards: [],
  nextCard: "",
  gameMode: "en",
  currentCard: "",
};

export function AppProvider(props) {
  let appState = { ...initialState };

  if (typeof window !== "undefined") {
    const storedState = sessionStorage.getItem("app-state");
    if (storedState) {
      appState = JSON.parse(storedState);
    }
  }

  const [state, dispatch] = useReducer(appReducer, appState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value} {...props} />;
}
