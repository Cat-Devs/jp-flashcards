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
}

export const FlashcardPage: React.FC<FlashcardPageProps> = ({
  card,
  audio,
  loading,
  quiz,
}) => {
  const { gameMode, nextCard, goHome } = useApp();

  if (loading) {
    return (
      <Container maxWidth="md" disableGutters>
        <Box sx={{ p: 2 }}>
          <LoadingCard />
        </Box>
      </Container>
    );
  }

  if (!(card && card.en)) {
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

  let cardData: FlashCardItem;

  if (gameMode === "hiragana") {
    cardData = {
      firstLine: { text: card.hiragana, lang: "ja-jp" },
      solution: [
        { text: card.katakana, lang: "ja-jp" },
        { text: card.kanji, lang: "ja-jp" },
        { text: card.romaji, lang: "ja-jp" },
        { text: card.en, lang: "en-us" },
      ],
    };
  } else if (gameMode === "kanji") {
    cardData = {
      firstLine: { text: card.kanji, lang: "ja-jp" },
      solution: [
        { text: card.hiragana, lang: "ja-jp" },
        { text: card.katakana, lang: "ja-jp" },
        { text: card.romaji, lang: "ja-jp" },
        { text: card.en, lang: "en-us" },
      ],
    };
  } else if (gameMode === "kana") {
    cardData = {
      firstLine: { text: card.hiragana || card.katakana, lang: "ja-jp" },
      solution: [
        { text: card.hiragana, lang: "ja-jp" },
        { text: card.katakana, lang: "ja-jp" },
        { text: card.kanji, lang: "ja-jp" },
        { text: card.romaji, lang: "ja-jp" },
        { text: card.en, lang: "en-us" },
      ],
    };
  } else {
    cardData = {
      firstLine: { text: card.en, lang: "en-us" },
      solution: [
        { text: card.hiragana, lang: "ja-jp" },
        { text: card.katakana, lang: "ja-jp" },
        { text: card.kanji, lang: "ja-jp" },
        { text: card.romaji, lang: "ja-jp" },
      ],
    };
  }

  return (
    <Container maxWidth="md" disableGutters>
      <Box sx={{ p: 2 }}>
        <Flashcard
          card={cardData}
          audio={audio}
          quiz={quiz}
          onNext={nextCard}
        />
      </Box>
    </Container>
  );
};
