import React, { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

export interface FlashCardItem {
  kanji: string;
  hiragana: string;
  katakana: string;
  jp: string;
  examples: string[];
  romaji: string;
  id: string;
  pictureId: string;
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

  useEffect(() => {
    setShowAnswer(false);
  }, [card]);

  const playAudio = async () => {
    const audioData = Buffer.from(audio, "hex");
    const blob = new Blob([audioData], { type: "audio/mpeg" });
    const url = webkitURL.createObjectURL(blob);
    const audioEl = new Audio(url);
    audioEl.load();
    audioEl.play();
  };

  const click = async () => {
    setShowAnswer((answer) => !answer);

    if (showAnswer) {
      return;
    }

    playAudio();
  };

  const buttonClick = () => {
    onNext && onNext(card.id);
  };

  return (
    <Card>
      <CardActionArea onClick={click}>
        <CardHeader
          avatar={
            <Avatar aria-label="audio">
              <VolumeUpIcon />
            </Avatar>
          }
          title={card.title}
        ></CardHeader>
        <CardContent>
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
            </>
          )}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" onClick={buttonClick}>
          Wrong
        </Button>
        <Button size="small" onClick={buttonClick}>
          Correct
        </Button>
      </CardActions>
    </Card>
  );
};
