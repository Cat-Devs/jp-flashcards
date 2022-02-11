import React, { useEffect } from "react";

import { useApp } from "../../src/AppState";
import { FlashcardPage } from "../../src/Pages/FlashcardPage";
import { FlashCardData } from "../../src/types";

interface WordsProps {
  cards: FlashCardData[];
}

const CardPage: React.FC<WordsProps> = () => {
  const { loadData, gameMode, gameLevel } = useApp();

  useEffect(() => {
    async function prepareGame() {
      const host = window.location.origin;

      if (!host || !gameMode || !gameLevel) {
        throw new Error("Missing required information.");
      }

      try {
        const res = await fetch(`${host}/api/prepare-game`, {
          method: "POST",
          body: JSON.stringify({
            config: {
              gameMode,
              gameLevel,
            },
          }),
        });
        const data = await res.json();

        if (!data.cardIds?.length) {
          throw new Error("Missing cards. Cannot prepare the game");
        }

        loadData(data.cardIds);
      } catch (err) {
        console.error(err);
      }
    }
    prepareGame();
  }, [gameLevel, gameMode, loadData]);

  return <FlashcardPage />;
};

export default CardPage;
