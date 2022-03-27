import { useRouter } from 'next/router';
import { createContext, Dispatch, useEffect, useMemo, useReducer } from 'react';
import { appReducer } from './appReducer';
import type { AppAction, AppState, GameState } from './types';
import { AppActionType } from './types';

export const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
}>({
  state: null,
  dispatch: null,
});

const initialState: AppState = {
  loading: false,
  game: {
    nextCard: '',
    currentCard: '',
    cardMode: 'en',
    gameMode: 'guest',
    gameLevel: '1',
    cards: [],
    remainingCards: [],
    usedCards: [],
    wrongCards: [],
    correctCards: [],
  },
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

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
    };
  }, [router]);

  const sessionState = typeof window !== 'undefined' && sessionStorage.getItem('app-state');
  const storedGameState = JSON.parse(sessionState || '{}');
  const appState = { ...initialState, game: { ...initialState.game, ...storedGameState } };
  const [state, dispatch] = useReducer(appReducer, appState);

  useEffect(() => {
    // While playing the flashcard game
    // Check if the user navigated back in the browser history or the url was manually altered
    if (
      router.route === '/shuffle/[id]' &&
      router.query?.id &&
      state.game?.currentCard &&
      state.game.currentCard !== router.query.id
    ) {
      router.push(`/shuffle/${state.game.currentCard}`);
    }
  }, [router, state.game.currentCard]);

  useEffect(() => {
    // Store the app state into the session storage
    const storedState: GameState = {
      ...state.game,
    };

    sessionStorage.setItem('app-state', JSON.stringify(storedState));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value} {...props} />;
}
