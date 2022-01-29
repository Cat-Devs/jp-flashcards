import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Flashcard, FlashCardItem } from "../Components/Flashcard";

interface FlashcardPageProps {
  card?: FlashCardItem;
  audio?: string;
  quiz?: boolean;
  onNext: () => void;
}

export const FlashcardPage: React.FC<FlashcardPageProps> = ({
  card,
  audio,
  onNext,
  quiz,
}) => {
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
