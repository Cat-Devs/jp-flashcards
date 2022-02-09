import { useRouter } from "next/router";
import { createContext, useMemo, useReducer, Dispatch, useEffect } from "react";
import { appReducer } from "./appReducer";
import { AppState, AppAction, AppActionType } from "./types";

export const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
}>({
  state: null,
  dispatch: null,
});

const initialState: AppState = {
  loading: false,
  loadingData: false,
  loadingSound: false,
  nextCard: "",
  currentCard: "",
  gameMode: "en",
  gameLevel: "1",
  remainingCards: [],
  usedCards: [],
  wrongCards: [],
  correctCards: [],
};

export function AppProvider(props) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      dispatch({ type: AppActionType.LOADING, payload: true });
    };
    const handleRouteChangeEnd = () => {
      dispatch({ type: AppActionType.LOADING, payload: false });
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
    };
  }, [router]);

  const sessionState = typeof window !== "undefined" && sessionStorage.getItem("app-state");
  const storedState = JSON.parse(sessionState || "{}");
  const appState = { ...initialState, ...storedState };
  const [state, dispatch] = useReducer(appReducer, appState);

  useEffect(() => {
    // While playing the flashcard game
    // Check if the user navigated back in the browser history or the url was manually altered
    if (
      router.route === "/shuffle/[id]" &&
      router.query?.id &&
      state?.currentCard &&
      state.currentCard !== router.query.id
    ) {
      router.push(`/shuffle/${state.currentCard}`);
    }
  }, [router, state.currentCard]);

  useEffect(() => {
    // Store the app state into the session storage
    const storedState: AppState = {
      ...state,
      loading: undefined,
    };

    sessionStorage.setItem("app-state", JSON.stringify(storedState));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value} {...props} />;
}
