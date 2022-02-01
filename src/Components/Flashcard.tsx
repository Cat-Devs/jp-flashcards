import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Accordion from "@mui/material/Accordion";
import Box from "@mui/material/Box";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useAudio } from "../Hooks/use-audio";
import { useKeyPress } from "../Hooks/use-key-press";

export interface FlashCardItem {
  id: string;
  category: string;
  en: string;
  jp: string;
  kanji?: string;
  hiragana?: string;
  katakana?: string;
  romaji?: string;
}
interface FlashcardProps {
  card: FlashCardItem;
  audio: string;
  onNext?: (cardId: string) => void;
  quiz?: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  card,
  audio,
  quiz,
  onNext,
}) => {
  const { play } = useAudio(audio);
  useKeyPress(onNext, onNext);

  const toggleSolution = (_event: React.SyntheticEvent, expanded: boolean) => {
    if (expanded) {
      play();
    }
  };

  const nextCardClick = () => {
    onNext(card.id);
  };

  return (
    <Card>
      <CardContent>
        <Accordion
          disableGutters
          square
          elevation={0}
          defaultExpanded={!quiz}
          onChange={toggleSolution}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography gutterBottom variant="h5" component="div">
              {card.en}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flex: "1 1 auto" }}>
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
              </Box>
              <Box>
                <IconButton
                  color="primary"
                  aria-label="listen audio"
                  component="button"
                  size="large"
                  onClick={play}
                >
                  <VolumeUpIcon />
                </IconButton>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </CardContent>

      {quiz && (
        <CardActions>
          <Button
            color="warning"
            endIcon={<ClearIcon />}
            onClick={nextCardClick}
          >
            Wrong
          </Button>
          <Button
            color="success"
            endIcon={<CheckIcon />}
            onClick={nextCardClick}
          >
            Correct
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
