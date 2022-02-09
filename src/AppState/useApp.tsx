import { useCallback, useContext, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { AppContext } from "./AppContext";
import { AppActionType, GameLevel, GameMode } from "./types";
import { FlashCardData } from "../types";

export function useApp() {
  const router = useRouter();
  const context = useContext(AppContext);
  const audioPlayer = useRef<HTMLAudioElement>();
  const { data: session } = useSession();

  if (!context) {
    throw new Error(`useApp must be used within an AppProvider`);
  }

  const { state, dispatch } = context;

  const loadData = useCallback(
    (cards: FlashCardData[]) => {
      const cardIds: string[] = cards
        .filter((card) => {
          if (state.gameMode === "hiragana") {
            return card.hiragana;
          } else if (state.gameMode === "kanji") {
            return card.kanji;
          }
          return true;
        })
        .filter((card: FlashCardData) => {
          const selectedLevel = Number(state.gameLevel);
          const cardLevel = Number(card.level);

          return selectedLevel >= cardLevel;
        })
        .map((card) => card.id)
        .splice(0, 30)
        .sort(() => Math.random() - 0.5);

      const nextCard = cardIds[String(Math.floor(Math.random() * cardIds.length))];

      dispatch({
        type: AppActionType.LOAD_DATA,
        payload: { cardIds, nextCard },
      });

      return router.push(`/shuffle/${nextCard}`);
    },
    [dispatch, router, state.gameMode, state.gameLevel]
  );

  const setGame = useCallback(
    (gameMode: GameMode) => {
      dispatch({
        type: AppActionType.SET_GAME,
        payload: gameMode,
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

  const goHome = useCallback(() => {
    router.push(`/`);
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

      fetch("/api/play", {
        method: "POST",
        body: JSON.stringify({ audio }),
      })
        .then((response) => response.json())
        .then((response) => response.data || "")
        .then((response: string) => {
          const audioData = Buffer.from(response, "hex");
          const blob = new Blob([audioData], { type: "audio/mpeg" });
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

  const nextCard = useCallback(() => {
    unloadSound();
    dispatch({ type: AppActionType.NEXT_CARD });

    if (state.nextCard) {
      router.push(`/shuffle/${state.nextCard}`);
    }
  }, [dispatch, router, state.nextCard, unloadSound]);

  return {
    loading: Boolean(state.loading),
    currentCard: state.currentCard,
    gameMode: state.gameMode,
    gameLevel: state.gameLevel,
    canPlaySounds: Boolean(session),
    setGame,
    setLevel,
    loadData,
    loadSound,
    unloadSound,
    nextCard,
    goHome,
    playSound,
  };
}
