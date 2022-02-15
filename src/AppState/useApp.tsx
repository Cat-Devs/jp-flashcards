import { createHash } from 'crypto';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GameMode } from '.';
import { PrepareGameConfig } from '../types';
import { AppContext } from './AppContext';
import { AppActionType, CardMode, CardResult, GameLevel } from './types';

interface Stats {
  usedCards: number;
  totalCards: number;
  wrongCards: number;
  progress: number;
}

export function useApp() {
  const initialStats: Stats = {
    progress: 0,
    totalCards: 0,
    usedCards: 0,
    wrongCards: 0,
  };
  const router = useRouter();
  const context = useContext(AppContext);
  const audioPlayer = useRef<HTMLAudioElement>();
  const { data: session } = useSession();
  const [userHash, setUserHash] = useState<string>();
  const [stats, setStats] = useState<Stats>(initialStats);

  if (!context) {
    throw new Error(`useApp must be used within an AppProvider`);
  }

  const { state, dispatch } = context;

  useEffect(() => {
    if (session?.user?.email) {
      const hash = createHash('sha256').update(session.user.email).digest('hex');
      setUserHash(hash);
    } else {
      setUserHash(null);
    }
  }, [session]);

  useEffect(() => {
    const usedCards = state.usedCards.length || 0;
    const wrongCards = state.wrongCards.length || 0;
    const totalCards =
      (state.usedCards.length || 0) + (state.remainingCards.length || 0) + ([state.currentCard].length || 0);
    const progress = Number(((100 * usedCards) / totalCards).toFixed(2));

    setStats({
      usedCards,
      totalCards,
      wrongCards,
      progress,
    });
  }, [state.wrongCards, state.currentCard, state.remainingCards, state.usedCards]);

  const loadData = useCallback(async () => {
    if (!state.cardMode || !state.gameLevel) {
      throw new Error('Missing required information.');
    }

    dispatch({
      type: AppActionType.LOADING,
      payload: true,
    });

    async function fetchData(cardMode: CardMode, gameLevel: GameLevel, gameMode: GameMode): Promise<string[]> {
      try {
        const res = await fetch(`/api/prepare-game`, {
          method: 'POST',
          body: JSON.stringify({
            config: {
              cardMode,
              gameLevel,
              gameMode: session ? gameMode : 'guest',
            } as PrepareGameConfig,
          }),
        });
        const data = await res.json();

        if (!data.cardIds?.length) {
          throw new Error('Missing cards. Cannot prepare the game');
        }

        return data.cardIds;
      } catch (error) {
        console.error(error);
      }
    }

    const cardIds = await fetchData(state.cardMode, state.gameLevel, state.gameMode);
    if (!cardIds?.length) {
      console.error('Cannot fetch flashcards data');
      dispatch({
        type: AppActionType.LOAD_DATA,
        payload: { cardIds: [], nextCard: '' },
      });
      return router.push(`/shuffle/0`);
    }

    const nextCard = cardIds[Math.floor(Math.random() * cardIds.length)];
    dispatch({
      type: AppActionType.LOAD_DATA,
      payload: { cardIds, nextCard },
    });
    router.push(`/shuffle/${nextCard}`);
  }, [dispatch, router, state.gameLevel, state.gameMode, state.cardMode]);

  const setGame = useCallback(
    (cardMode: CardMode) => {
      dispatch({
        type: AppActionType.SET_GAME,
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

  const setMode = useCallback(
    (gameMode: GameMode) => {
      dispatch({
        type: AppActionType.SET_MODE,
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
      if (!session) {
        return;
      }

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
    [dispatch, session]
  );

  const playSound = useCallback(() => {
    if (!session) {
      return;
    }

    audioPlayer.current?.load();
    audioPlayer.current?.play();
  }, [session]);

  const unloadSound = useCallback(() => {
    if (!session) {
      return;
    }

    audioPlayer.current?.load();
    audioPlayer.current?.pause();
    audioPlayer.current = undefined;
  }, [session]);

  const nextCard = useCallback(
    async (cardResult: CardResult) => {
      unloadSound();

      if (userHash) {
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
    [dispatch, router, unloadSound, userHash, state.nextCard, state.currentCard]
  );

  const playWrongCards = useCallback(() => {
    dispatch({ type: AppActionType.PLAY_WRONG_CARDS });

    if (state.nextCard) {
      router.push(`/shuffle/${state.nextCard}`);
    }
  }, [dispatch, router, state.nextCard]);

  return {
    currentCard: state.currentCard,
    cardMode: state.cardMode,
    gameLevel: state.gameLevel,
    gameMode: state.gameMode,
    loading: Boolean(state.loading),
    isUserLoggedIn: Boolean(session),
    canPlaySounds: Boolean(session),
    signIn: useCallback(() => signIn(), []),
    signOut: useCallback(() => signOut(), []),
    stats,
    userHash,
    setGame,
    setLevel,
    setMode,
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
