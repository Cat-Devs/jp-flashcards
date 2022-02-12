import React, { useEffect, useMemo } from "react";
import { isMobile } from "react-device-detect";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { Flashcard, FlashCardItem } from "../Components/Flashcard";
import { LoadingCard } from "../Components/LoadingCard";
import { KeyboardHelper } from "../Components/KeyboardHelper";
import { Progress } from "../Components/Progress";
import { useApp } from "../AppState";
import { FlashCardData } from "../types";

interface FlashcardPageProps {
  card?: FlashCardData;
  quiz?: boolean;
}

export const FlashcardPage: React.FC<FlashcardPageProps> = ({ card, quiz }) => {
  const { gameMode, nextCard, goHome, loading, loadSound, unloadSound, playSound, canPlaySounds, stats } = useApp();

  useEffect(() => {
    if (canPlaySounds && card?.jp) {
      loadSound(card.jp);
    }

    return () => {
      unloadSound();
    };
  }, [canPlaySounds, card, loadSound, unloadSound]);

  const cardData: FlashCardItem = useMemo(() => {
    if (!card) {
      return null;
    } else if (gameMode === "hiragana") {
      return {
        firstLine: { text: card?.hiragana, lang: "ja-jp" },
        solution: [
          { text: card?.katakana, lang: "ja-jp" },
          { text: card?.kanji, lang: "ja-jp" },
          { text: card?.romaji, lang: "ja-jp" },
          { text: card?.en, lang: "en-us" },
        ],
      };
    } else if (gameMode === "kanji") {
      return {
        firstLine: { text: card?.kanji, lang: "ja-jp" },
        solution: [
          { text: card?.hiragana, lang: "ja-jp" },
          { text: card?.katakana, lang: "ja-jp" },
          { text: card?.romaji, lang: "ja-jp" },
          { text: card?.en, lang: "en-us" },
        ],
      };
    } else if (gameMode === "kana") {
      return {
        firstLine: { text: card?.hiragana || card?.katakana, lang: "ja-jp" },
        solution: [
          { text: card?.hiragana, lang: "ja-jp" },
          { text: card?.katakana, lang: "ja-jp" },
          { text: card?.kanji, lang: "ja-jp" },
          { text: card?.romaji, lang: "ja-jp" },
          { text: card?.en, lang: "en-us" },
        ],
      };
    } else {
      return {
        firstLine: { text: card?.en, lang: "en-us" },
        solution: [
          { text: card?.hiragana, lang: "ja-jp" },
          { text: card?.katakana, lang: "ja-jp" },
          { text: card?.kanji, lang: "ja-jp" },
          { text: card?.romaji, lang: "ja-jp" },
        ],
      };
    }
  }, [card, gameMode]);

  if (loading) {
    return (
      <Container maxWidth="md" disableGutters>
        <Progress status={stats.progress} />
        <Box sx={{ p: 2 }}>
          <LoadingCard />
        </Box>
      </Container>
    );
  }

  if (!card?.en) {
    return (
      <Container maxWidth="md" disableGutters>
        <Box sx={{ p: 2 }}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Card Not Found
              </Typography>
            </CardContent>
            <CardActions>
              {quiz ? (
                <Button color="primary" onClick={() => nextCard("void")}>
                  Next
                </Button>
              ) : (
                <Button color="primary" onClick={goHome}>
                  Go Home
                </Button>
              )}
            </CardActions>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" disableGutters>
      <Progress status={stats.progress} />
      <Box sx={{ p: 2 }}>
        <Flashcard
          card={cardData}
          canPlaySounds={canPlaySounds}
          quiz={quiz}
          onPlaySound={playSound}
          onNext={nextCard}
        />
      </Box>
      {!isMobile && quiz && <KeyboardHelper />}
    </Container>
  );
};
