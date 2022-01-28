import React, { useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

export interface FlashCardItem {
  kanji?: string;
  hiragana?: string;
  katakana?: string;
  jp: string;
  romaji?: string;
  id: string;
  title: string;
}
interface FlashcardProps {
  card: FlashCardItem;
  audio: string;
  onNext?: (cardId: string) => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  audio,
  onNext,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const playAudio = async () => {
    const audioData = Buffer.from(audio, "hex");
    const blob = new Blob([audioData], { type: "audio/mpeg" });
    const url = webkitURL.createObjectURL(blob);
    const audioEl = new Audio(url);
    audioEl.load();
    audioEl.play();
  };

  const revealSolution = () => {
    setShowAnswer(true);
    playAudio();
  };

  const buttonClick = () => {
    onNext && onNext(card.id);
  };

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {card?.title}
        </Typography>

        {!showAnswer && (
          <IconButton
            color="default"
            aria-label="listen audio"
            component="button"
            onClick={revealSolution}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        )}

        {showAnswer && (
          <>
            <Typography gutterBottom variant="h5" component="div">
              {card?.kanji}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              {card?.hiragana}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              {card?.katakana}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              {card?.romaji}
            </Typography>
            <IconButton
              color="default"
              aria-label="listen audio"
              component="button"
              size="large"
              onClick={playAudio}
            >
              <VolumeUpIcon />
            </IconButton>
          </>
        )}
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="warning"
          endIcon={<ClearIcon />}
          onClick={buttonClick}
        >
          Wrong
        </Button>
        <Button
          variant="contained"
          color="success"
          endIcon={<CheckIcon />}
          onClick={buttonClick}
        >
          Correct
        </Button>
      </CardActions>
    </Card>
  );
};
