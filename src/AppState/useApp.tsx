import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    const usedCards = state.usedCards.length || 0;
    const wrongCards = state.wrongCards.length || 0;
    const totalCards =
      (state.usedCards.length || 0) + (state.remainingCards.length || 0) + ([state.currentCard].length || 0);
    const progress = Number(((100 * usedCards) / totalCards).toFixed(2));

    setGameStats({
      usedCards,
      totalCards,
      wrongCards,
      progress,
      cardsStats: state.cardsStats,
    });
  }, [state.currentCard, state.remainingCards, state.usedCards, state.wrongCards, state.cardsStats]);

  const fetchUserData = useCallback(async () => {
    if (userLoggedIn) {
      try {
        const userStatsReq = await fetch('/api/get-user-stats', { method: 'POST' });
        const userStats = await userStatsReq.json();
        dispatch({ type: AppActionType.SET_USER_STATS, payload: userStats });
      } catch (err) {
        console.error(err?.message);
        dispatch({ type: AppActionType.SET_USER_STATS, payload: undefined });
      }
    } else {
      dispatch({ type: AppActionType.SET_USER_STATS, payload: undefined });
    }
  }, [userLoggedIn, dispatch]);

  const loadData = useCallback(async () => {
    if (!state.cardMode || !state.gameLevel) {
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

    const cardData = await fetchData(state.cardMode, state.gameLevel, state.gameMode);

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
  }, [dispatch, router, state.gameLevel, state.gameMode, state.cardMode]);

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

      if (userLoggedIn && state.gameMode !== 'guest' && cardResult !== 'void') {
        await fetch('/api/update', {
          method: 'POST',
          body: JSON.stringify({ cardId: state.currentCard, cardResult }),
        });
      }

      dispatch({ type: AppActionType.NEXT_CARD, payload: cardResult });

      if (state.nextCard) {
        router.push(`/shuffle/${state.nextCard}`);
      }
    },
    [dispatch, router, unloadSound, userLoggedIn, state.nextCard, state.gameMode, state.currentCard]
  );

  const playWrongCards = useCallback(() => {
    dispatch({ type: AppActionType.PLAY_WRONG_CARDS });

    if (state.nextCard) {
      router.push(`/shuffle/${state.nextCard}`);
    }
  }, [dispatch, router, state.nextCard]);

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
    currentCard: state.currentCard,
    cardMode: state.cardMode,
    gameLevel: state.gameLevel,
    gameMode: state.gameMode,
    userStats: state.userStats,
    loading: Boolean(state.loading),
    authenticating: Boolean(status !== 'authenticated' && status !== 'unauthenticated'),
    canPlaySounds: userLoggedIn,
    fetchUserData,
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
