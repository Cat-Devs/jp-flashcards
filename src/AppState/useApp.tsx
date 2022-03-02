import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useContext, useRef, useState } from 'react';
import { CardStats, GameMode } from '.';
import { PrepareGameConfig } from '../types';
import { AppContext } from './AppContext';
import { AppActionType, CardMode, CardResult, GameLevel } from './types';

interface GameStats {
  usedCards: number;
  totalCards: number;
  wrongCards: number;
  progress: number;
  cardsStats?: CardStats[];
}

const initialGameStats: GameStats = {
  progress: 0,
  totalCards: 0,
  usedCards: 0,
  wrongCards: 0,
  cardsStats: undefined,
};

export function useApp() {
  const router = useRouter();
  const context = useContext(AppContext);
  const audioPlayer = useRef<HTMLAudioElement>();
  const { data: session, status } = useSession();
  const [gameStats, setGameStats] = useState<GameStats>(initialGameStats);
  const userLoggedIn = Boolean(session?.user?.email);

  if (!context) {
    throw new Error(`useApp must be used within an AppProvider`);
  }

  const { state, dispatch } = context;

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
      cardsStats: state.game.cardsStats,
    });
  }, [
    state.game.currentCard,
    state.game.remainingCards,
    state.game.usedCards,
    state.game.wrongCards,
    state.game.cardsStats,
  ]);

  const getUserStats = useCallback(async () => {
    if (userLoggedIn) {
      dispatch({ type: AppActionType.LOADING_USER_STATS, payload: true });
      try {
        const userStatsReq = await fetch('/api/get-user-stats', { method: 'POST' });
        const userStats = await userStatsReq.json();
        dispatch({ type: AppActionType.SET_USER_STATS, payload: userStats });
      } catch (err) {
        console.error(err?.message);
      } finally {
        dispatch({ type: AppActionType.LOADING_USER_STATS, payload: false });
      }
    }
  }, [dispatch, userLoggedIn]);

  const fetchUserData = useCallback(async () => {
    if (userLoggedIn) {
      dispatch({ type: AppActionType.LOADING_USER, payload: true });
      try {
        const userStatsReq = await fetch('/api/get-user-stats', { method: 'POST' });
        const userStats = await userStatsReq.json();
        dispatch({ type: AppActionType.SET_USER_STATS, payload: userStats });
      } catch (err) {
        console.error(err?.message);
        dispatch({ type: AppActionType.SET_USER_STATS, payload: undefined });
      } finally {
        dispatch({ type: AppActionType.LOADING_USER, payload: false });
      }
    } else {
      dispatch({ type: AppActionType.SET_USER_STATS, payload: undefined });
    }
  }, [userLoggedIn, dispatch]);

  const loadData = useCallback(async () => {
    if (!state.game.cardMode || !state.game.gameLevel) {
      throw new Error('Missing required information.');
    }

    dispatch({
      type: AppActionType.LOADING,
      payload: true,
    });

    async function fetchData(
      cardMode: CardMode,
      gameLevel: GameLevel,
      gameMode: GameMode
    ): Promise<{ cardIds: string[]; cardsStats: CardStats[] }> {
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

        if (!data.cardData?.cardIds) {
          throw new Error('Missing cards. Cannot prepare the game');
        }

        return data.cardData;
      } catch (error) {
        console.error(error);
      }
    }

    const cardData = await fetchData(state.game.cardMode, state.game.gameLevel, state.game.gameMode);

    if (!cardData) {
      console.error('Cannot fetch flashcards data');
      dispatch({
        type: AppActionType.LOAD_DATA,
        payload: { cardIds: [], cardsStats: [], nextCard: '' },
      });
      return router.push(`/shuffle/0`);
    }

    const nextCard = cardData.cardIds[Math.floor(Math.random() * cardData.cardIds.length)];

    dispatch({
      type: AppActionType.LOAD_DATA,
      payload: { cardIds: cardData.cardIds, cardsStats: cardData.cardsStats, nextCard },
    });
    router.push(`/shuffle/${nextCard}`);
  }, [dispatch, router, state.game.gameLevel, state.game.gameMode, state.game.cardMode]);

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
    getUserStats();
    router.push(`/`);
  }, [router, getUserStats]);

  const openSettings = useCallback(() => {
    router.push('/profile');
  }, [router]);

  const loadSound = useCallback(
    async (audio: string) => {
      dispatch({
        type: AppActionType.LOADING_SOUND,
        payload: true,
      });

      fetch('/api/play', {
        method: 'POST',
        body: JSON.stringify({ audio }),
      })
        .then((response) => response.json())
        .then((response) => response.data || '')
        .then((response: string) => {
          const audioData = Buffer.from(response, 'hex');
          const blob = new Blob([audioData], { type: 'audio/mpeg' });
          const audioSrc = webkitURL.createObjectURL(blob);
          audioPlayer.current = new Audio(audioSrc);
          audioPlayer.current.load();
        })
        .catch(() => {
          // User unauthenticated. The audio won't work unless the users logs in
        })
        .finally(() => {
          dispatch({
            type: AppActionType.LOADING_SOUND,
            payload: false,
          });
        });
    },
    [dispatch]
  );

  const playSound = useCallback(() => {
    if (!userLoggedIn) {
      return;
    }

    audioPlayer.current?.load();
    audioPlayer.current?.play();
  }, [userLoggedIn]);

  const unloadSound = useCallback(() => {
    if (!userLoggedIn) {
      return;
    }

    audioPlayer.current?.load();
    audioPlayer.current?.pause();
    audioPlayer.current = undefined;
  }, [userLoggedIn]);

  const nextCard = useCallback(
    async (cardResult: CardResult) => {
      unloadSound();

      if (userLoggedIn && state.game.gameMode !== 'guest' && cardResult !== 'void' && !state.game.nextCard) {
        await fetch('/api/update', {
          method: 'POST',
          body: JSON.stringify({
            wrongCards: state.game.wrongCards,
            cards: state.game.usedCards,
          }),
        });
      }

      dispatch({ type: AppActionType.NEXT_CARD, payload: cardResult });

      if (state.game.nextCard) {
        router.push(`/shuffle/${state.game.nextCard}`);
      }
    },
    [dispatch, router, unloadSound, userLoggedIn, state.game]
  );

  const playWrongCards = useCallback(() => {
    dispatch({ type: AppActionType.PLAY_WRONG_CARDS });

    if (state.game.nextCard) {
      router.push(`/shuffle/${state.game.nextCard}`);
    }
  }, [dispatch, router, state.game.nextCard]);

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
    currentCard: state.game.currentCard,
    cardMode: state.game.cardMode,
    gameLevel: state.game.gameLevel,
    gameMode: state.game.gameMode,
    userStats: state.userStats,
    loading: Boolean(state.loading.loading),
    userStatsLoading: Boolean(state.loading.loadingUserStats),
    authenticating: Boolean(state.loading.loadingUser || (status !== 'authenticated' && status !== 'unauthenticated')),
    fetchUserData,
    getGameStats,
    gameStats,
    userLoggedIn,
    logIn,
    logOut,
    setCardMode,
    setLevel,
    setGameMode,
    loadData,
    loadSound,
    unloadSound,
    nextCard,
    goHome,
    openSettings,
    playSound,
    playWrongCards,
  };
}
