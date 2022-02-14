import React, { useCallback, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import Box from '@mui/material/Box';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Tooltip from '@mui/material/Tooltip';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { useKeyPress } from '../Hooks/use-key-press';
import { CardResult } from '../AppState/types';

export interface FlashCardItem {
  firstLine: { text: string; lang: string };
  solution: { text: string; lang: string }[];
}

interface FlashcardProps {
  card: FlashCardItem;
  canPlaySounds: boolean;
  onPlaySound: () => void;
  quiz?: boolean;
  onNext?: (cardResult: CardResult) => void;
}

const FlashcardCmp: React.FC<FlashcardProps> = ({ card, quiz, canPlaySounds, onPlaySound, onNext }) => {
  const [expanded, setExpanded] = useState(!quiz);

  const handleCheckAnswer = useCallback(() => {
    if (!expanded) {
      setExpanded(true);
      canPlaySounds && onPlaySound();
    }
  }, [expanded, onPlaySound, canPlaySounds]);

  const handleWrong = useCallback(() => {
    if (expanded && quiz) {
      onNext('wrong');
    }
  }, [expanded, onNext, quiz]);

  const handleCorrect = useCallback(() => {
    if (expanded && quiz) {
      onNext('correct');
    }
  }, [expanded, onNext, quiz]);

  useKeyPress({ onArrowLeft: handleWrong, onArrowRight: handleCorrect, onSpace: handleCheckAnswer });

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
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ flex: '1 1 auto' }}>
                {card.solution.map((solutionItem, index) => (
                  <Typography key={`solution-item-${index}`} lang={solutionItem.lang} gutterBottom variant="h5">
                    {solutionItem.text}
                  </Typography>
                ))}
              </Box>
              <Box>
                <Tooltip title={canPlaySounds ? 'Listen' : 'Only logged in users can play sounds'}>
                  <IconButton
                    color="primary"
                    aria-label="listen audio"
                    component="button"
                    size="large"
                    onClick={onPlaySound}
                  >
                    {canPlaySounds ? <VolumeUpIcon /> : <VolumeOffIcon />}
                  </IconButton>
                </Tooltip>
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
          <Button color="warning" endIcon={<ClearIcon />} onClick={handleWrong}>
            Wrong
          </Button>
          <Button color="success" endIcon={<CheckIcon />} onClick={handleCorrect}>
            Correct
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export const Flashcard = React.memo(FlashcardCmp);
