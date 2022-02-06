import React, { useMemo } from "react";
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
import { useApp } from "../AppState";
import { KeyboardHelper } from "../Components/KeyboardHelper";
import { FlashCardData } from "../types";

interface FlashcardPageProps {
  card?: FlashCardData;
  audio?: string;
  quiz?: boolean;
}

export const FlashcardPage: React.FC<FlashcardPageProps> = ({ card, audio, quiz }) => {
  const { gameMode, nextCard, goHome, loading } = useApp();

  const cardData: FlashCardItem = useMemo(() => {
    if (!card) {
      return null;
    }

    if (gameMode === "hiragana") {
      return {
        firstLine: { text: card?.hiragana, lang: "ja-jp" },
        solution: [
          { text: card?.katakana, lang: "ja-jp" },
          { text: card?.kanji, lang: "ja-jp" },
          { text: card?.romaji, lang: "ja-jp" },
          { text: card?.en, lang: "en-us" },
        ],
      };
    }

    if (gameMode === "kanji") {
      return {
        firstLine: { text: card?.kanji, lang: "ja-jp" },
        solution: [
          { text: card?.hiragana, lang: "ja-jp" },
          { text: card?.katakana, lang: "ja-jp" },
          { text: card?.romaji, lang: "ja-jp" },
          { text: card?.en, lang: "en-us" },
        ],
      };
    }

    if (gameMode === "kana") {
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
    }

    return {
      firstLine: { text: card?.en, lang: "en-us" },
      solution: [
        { text: card?.hiragana, lang: "ja-jp" },
        { text: card?.katakana, lang: "ja-jp" },
        { text: card?.kanji, lang: "ja-jp" },
        { text: card?.romaji, lang: "ja-jp" },
      ],
    };
  }, [card, gameMode]);

  if (loading) {
    return (
      <Container maxWidth="md" disableGutters>
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
                <Button color="primary" onClick={nextCard}>
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
      <Box sx={{ p: 2 }}>
        <Flashcard card={cardData} audio={audio} quiz={quiz} onNext={nextCard} />
      </Box>
      {!isMobile && quiz && <KeyboardHelper />}
    </Container>
  );
};
