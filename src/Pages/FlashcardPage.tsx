import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Flashcard, FlashCardItem } from "../Components/Flashcard";
import { LoadingPage } from "../Components/Loading";

interface FlashcardPageProps {
  card?: FlashCardItem;
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
  if (loading) {
    return <LoadingPage />;
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

  return <Flashcard card={card} audio={audio} quiz={quiz} onNext={onNext} />;
};
