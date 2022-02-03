import React from "react";

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

export interface FlashCardData {
  id: string;
  category: string;
  en: string;
  jp: string;
  kanji?: string;
  hiragana?: string;
  katakana?: string;
  romaji?: string;
}

interface FlashcardPageProps {
  card?: FlashCardData;
  audio?: string;
  quiz?: boolean;
  loading?: boolean;
  onNext?: () => void;
}

export const FlashcardPage: React.FC<FlashcardPageProps> = ({
  card,
  audio,
  onNext,
  loading,
  quiz,
}) => {
  const { gameMode } = useApp();

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <LoadingCard />
        </Box>
      </Container>
    );
  }

  if (!(card && card.en)) {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Card Not Found
          </Typography>
        </CardContent>
        <CardActions>
          <Button color="primary" onClick={onNext}>
            Next
          </Button>
        </CardActions>
      </Card>
    );
  }

  let cardData: FlashCardItem;
  if (gameMode === "hiragana") {
    cardData = {
      firstLine: card.hiragana,
      solution: [card.katakana, card.kanji, card.romaji, card.en],
    };
  } else if (gameMode === "kanji") {
    cardData = {
      firstLine: card.kanji,
      solution: [card.hiragana, card.katakana, card.romaji, card.en],
    };
  } else if (gameMode === "kana") {
    cardData = {
      firstLine: card.hiragana || card.katakana,
      solution: [
        card.hiragana,
        card.katakana,
        card.kanji,
        card.romaji,
        card.en,
      ],
    };
  } else {
    cardData = {
      firstLine: card.en,
      solution: [card.hiragana, card.katakana, card.kanji, card.romaji],
    };
  }

  return (
    <Flashcard card={cardData} audio={audio} quiz={quiz} onNext={onNext} />
  );
};
