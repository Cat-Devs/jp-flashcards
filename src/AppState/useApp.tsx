import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useContext, useState } from 'react';
import { CardData, PrepareGameConfig } from '../types';
import { AppContext } from './AppContext';
import { AppActionType, CardMode, CardResult, GameLevel, GameMode } from './types';

interface GameStats {
  usedCards: number;
  totalCards: number;
  wrongCards: number;
  progress: number;
}

const initialGameStats: GameStats = {
  progress: 0,
  totalCards: 0,
  usedCards: 0,
  wrongCards: 0,
};

async function fetchPrepareGameData(cardMode: CardMode, gameLevel: GameLevel, gameMode: GameMode): Promise<CardData[]> {
  try {
    const res = await fetch(`/api/prepare-game`, {
      method: 'POST',
      body: JSON.stringify({
        config: {
          cardMode,
          gameLevel,
          gameMode,
        } as PrepareGameConfig,
      }),
    });
    const data = await res.json();

    if (!data.cards?.length) {
      throw new Error('Missing cards. Cannot prepare the game');
    }

    return data.cards;
  } catch (error) {
    console.error(error);
  }
}

export function useApp() {
  const router = useRouter();
  const context = useContext(AppContext);
  const { data: session, status } = useSession();
  const [gameStats, setGameStats] = useState<GameStats>(initialGameStats);
  const authenticating = Boolean(status !== 'authenticated' && status !== 'unauthenticated');

  if (!context) {
    throw new Error(`useApp must be used within an AppProvider`);
  }

  const { state, dispatch } = context;

  const userLoggedIn = Boolean(session?.user?.email && state.user);

  const getGameStats = useCallback(async () => {
    const usedCards = state.game.usedCards.length || 0;
    const wrongCards = state.game.wrongCards.length || 0;
    const totalCards =
      (state.game.usedCards.length || 0) +
      (state.game.remainingCards.length || 0) +
      ([state.game.currentCard].length || 0);
    const progress = Number(((100 * usedCards) / totalCards).toFixed(2));

    setGameStats({
      usedCards,
      totalCards,
      wrongCards,
      progress,
    });
  }, [state.game.currentCard, state.game.remainingCards, state.game.usedCards, state.game.wrongCards]);

  const getUser = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const userStatsReq = await fetch('/api/get-user-stats', { method: 'POST' });
        const user = await userStatsReq.json();
        dispatch({ type: AppActionType.SET_USER, payload: user });
      } catch (err) {
        console.error(err?.message);
        dispatch({ type: AppActionType.SET_USER, payload: undefined });
      } finally {
      }
    } else {
      dispatch({ type: AppActionType.SET_USER, payload: undefined });
    }
  }, [dispatch, session?.user?.email]);

  const loadTrainData = useCallback(
    async (cards: CardData[]) => {
      const nextCard = cards[Math.floor(Math.random() * cards.length)].id;

      dispatch({
        type: AppActionType.LOAD_DATA,
        payload: { cards, nextCard },
      });
    },
    [dispatch]
  );

  const loadData = useCallback(async () => {
    if (!state.game.cardMode || !state.game.gameLevel) {
      throw new Error('Missing required information.');
    }

    dispatch({
      type: AppActionType.LOADING,
      payload: true,
    });

    const { cardMode, gameLevel, gameMode } = state.game;
    const cardData = await fetchPrepareGameData(cardMode, gameLevel, gameMode);

    if (!cardData) {
      console.error('Cannot fetch flashcards data');
      dispatch({
        type: AppActionType.LOAD_DATA,
        payload: { cards: [], nextCard: '' },
      });
      return router.push(`/shuffle/0`);
    }

    const nextCard = cardData[Math.floor(Math.random() * cardData.length)].id;

    dispatch({
      type: AppActionType.LOAD_DATA,
      payload: { cards: cardData, nextCard },
    });

    router.push(`/shuffle/${nextCard}`);
  }, [dispatch, router, state.game]);

  const setCardMode = useCallback(
    (cardMode: CardMode) => {
      dispatch({
        type: AppActionType.SET_CARDS,
        payload: cardMode,
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

  const setGameMode = useCallback(
    (gameMode: GameMode) => {
      dispatch({
        type: AppActionType.SET_GAME_MODE,
        payload: gameMode,
      });
    },
    [dispatch]
  );

  const goHome = useCallback(() => {
    router.push(`/`);
  }, [router]);

  const openSettings = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const nextCard = useCallback(
    async (cardResult: CardResult) => {
      dispatch({ type: AppActionType.NEXT_CARD, payload: cardResult });

      if (state.game.nextCard) {
        router.push(`/shuffle/${state.game.nextCard}`);
      }

      if (userLoggedIn && state.game.gameMode !== 'guest' && !state.game.nextCard) {
        const cards = [...state.game.usedCards];
        const wrongCards = [...state.game.wrongCards];

        if (state.game.currentCard) {
          cards.push(state.game.currentCard);
        }
        if (cardResult === 'wrong' && state.game.currentCard) {
          wrongCards.push(state.game.currentCard);
        }

        if (!state.game.currentCard) {
          router.push(`/shuffle/summary`);
          return;
        }

        getUser();
        await fetch('/api/update', {
          method: 'POST',
          body: JSON.stringify({ wrongCards, cards }),
        });
        router.push(`/shuffle/summary`);
      }
    },
    [dispatch, getUser, router, userLoggedIn, state.game]
  );

  const playWrongCards = useCallback(() => {
    dispatch({ type: AppActionType.PLAY_WRONG_CARDS });
  }, [dispatch]);

  const logIn = useCallback(() => {
    signIn();
  }, []);

  const logOut = useCallback(() => {
    dispatch({
      type: AppActionType.SET_GAME_MODE,
      payload: 'guest',
    });

    signOut();
  }, [dispatch]);

  return {
    currentGame: state.game,
    currentCard: state.game.currentCard,
    cardMode: state.game.cardMode,
    gameLevel: state.game.gameLevel,
    gameMode: state.game.gameMode,
    user: state.user,
    loading: Boolean(state.loading),
    status,
    authenticating,
    getUser,
    getGameStats,
    gameStats,
    userLoggedIn,
    logIn,
    logOut,
    setCardMode,
    setLevel,
    setGameMode,
    loadData,
    loadTrainData,
    nextCard,
    goHome,
    openSettings,
    playWrongCards,
  };
}
