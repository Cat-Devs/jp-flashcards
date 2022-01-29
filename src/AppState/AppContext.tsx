import { createContext, useMemo, useReducer } from "react";
import { appReducer } from "./appReducer";
import { AppState } from "./types";

export const AppContext = createContext({
  state: null,
  dispatch: null,
});

const initialState: AppState = {
  remainingCards: [],
  usedCards: [],
  wrongCards: [],
  correctCards: [],
  nextCard: "",
  gameMode: "",
};

export function AppProvider(props) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value} {...props} />;
}
