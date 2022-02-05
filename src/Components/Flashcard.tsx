import React, { useCallback, useState } from "react";
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
  firstLine: { text: string; lang: string };
  solution: { text: string; lang: string }[];
}

interface FlashcardProps {
  card: FlashCardItem;
  audio: string;
  quiz?: boolean;
  onNext?: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({ card, audio, quiz, onNext }) => {
  const [expanded, setExpanded] = useState(!quiz);
  const { play } = useAudio(audio);

  const handleShow = useCallback(() => {
    setExpanded(true);
  }, []);

  const handleWrong = useCallback(() => {
    if (expanded) {
      onNext();
    }
  }, [expanded, onNext]);

  const handleCorrect = useCallback(() => {
    if (expanded) {
      onNext();
    }
  }, [expanded, onNext]);

  useKeyPress({ onArrowLeft: handleWrong, onArrowRight: handleCorrect, onSpace: handleShow });

  const handleCheckAnswer = () => {
    if (!expanded) {
      setExpanded(true);
      play();
    }
  };

  const nextCardClick = () => {
    onNext();
  };

  return (
    <Card>
      <CardContent>
        <Accordion
          disableGutters
          square
          elevation={0}
          defaultExpanded={!quiz}
          expanded={expanded}
          onChange={handleCheckAnswer}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography fontWeight={500} lang={card.firstLine.lang} gutterBottom variant="h4">
              {card.firstLine.text}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flex: "1 1 auto" }}>
                {card.solution.map((solutionItem, index) => (
                  <Typography key={`solution-item-${index}`} lang={solutionItem.lang} gutterBottom variant="h5">
                    {solutionItem.text}
                  </Typography>
                ))}
              </Box>
              <Box>
                <IconButton color="primary" aria-label="listen audio" component="button" size="large" onClick={play}>
                  <VolumeUpIcon />
                </IconButton>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </CardContent>

      {!expanded && (
        <CardActions>
          <Button color="primary" onClick={handleCheckAnswer}>
            Check answer
          </Button>
        </CardActions>
      )}
      {quiz && expanded && (
        <CardActions>
          <Button color="warning" endIcon={<ClearIcon />} onClick={nextCardClick}>
            Wrong
          </Button>
          <Button color="success" endIcon={<CheckIcon />} onClick={nextCardClick}>
            Correct
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
