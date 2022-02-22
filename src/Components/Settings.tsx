import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import React, { useCallback, useMemo, useState } from 'react';
import type { CardMode, GameLevel, GameMode } from '../AppState';
import { useApp } from '../AppState';

const enum GAME_MODE_LABELS {
  LEARN = 'Keep learning',
  PRACTICE = 'Repeat all learned words',
  WEAK = 'Repeat only your weak words',
  GUEST = 'Play with all words',
}

const enum CARD_MODE_LABELS {
  EN = 'Show cards in English',
  HIRAGANA = 'Show cards in Hiragana',
  KANA = 'Show cards in Any Kana',
  KANJI = 'Show cards in Kanji',
}

export const Settings: React.FC = () => {
  const { cardMode, gameLevel, gameMode, setGameMode, setLevel, setCardMode, userLoggedIn } = useApp();
  const [cardModeExpanded, setCardModeExpanded] = useState(false);
  const [gameModeExpanded, setGameModeExpanded] = useState(false);

  const cardModeLabel = useMemo(() => {
    if (cardMode === 'hiragana') {
      return CARD_MODE_LABELS.HIRAGANA;
    }
    if (cardMode === 'kana') {
      return CARD_MODE_LABELS.KANA;
    }
    if (cardMode === 'kanji') {
      return CARD_MODE_LABELS.KANJI;
    }

    return CARD_MODE_LABELS.EN;
  }, [cardMode]);

  const gameModeLabel = useMemo(() => {
    if (gameMode === 'learn') {
      return GAME_MODE_LABELS.LEARN;
    }
    if (gameMode === 'practice') {
      return GAME_MODE_LABELS.PRACTICE;
    }
    if (gameMode === 'weak') {
      return GAME_MODE_LABELS.WEAK;
    }

    return GAME_MODE_LABELS.GUEST;
  }, [gameMode]);

  const handleCardMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCardMode(event.target.value as CardMode);
      setCardModeExpanded(false);
    },
    [setCardMode]
  );

  const handleGameLevel = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLevel(event.target.value as GameLevel);
    },
    [setLevel]
  );

  const handleGameMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGameMode(event.target.value as GameMode);
      setGameModeExpanded(false);
    },
    [setGameMode]
  );

  return (
    <Box sx={{ my: 4 }}>
      {userLoggedIn && (
        <Box sx={{ pb: 4 }}>
          <Accordion
            variant="outlined"
            expanded={gameModeExpanded}
            onChange={() => setGameModeExpanded(!gameModeExpanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} data-cy="game-mode-settings">
              <Typography>{gameModeLabel}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl>
                <RadioGroup name="game-mode-buttons-group" value={gameMode} onChange={handleGameMode}>
                  <FormControlLabel value="learn" control={<Radio />} label={GAME_MODE_LABELS.LEARN} />
                  <FormControlLabel value="practice" control={<Radio />} label={GAME_MODE_LABELS.PRACTICE} />
                  <FormControlLabel value="weak" control={<Radio />} label={GAME_MODE_LABELS.WEAK} />
                  <FormControlLabel value="guest" control={<Radio />} label={GAME_MODE_LABELS.GUEST} />
                </RadioGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {gameMode !== 'learn' && (
        <Box sx={{ pb: 4 }}>
          <Accordion
            variant="outlined"
            expanded={cardModeExpanded}
            onChange={() => setCardModeExpanded(!cardModeExpanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} data-cy="card-mode-settings">
              <Typography>{cardModeLabel}</Typography>
            </AccordionSummary>
            <AccordionDetails data-cy="card-mode-details">
              <FormControl>
                <RadioGroup name="card-mode-buttons-group" value={cardMode} onChange={handleCardMode}>
                  <FormControlLabel
                    data-cy="card-mode-settings-en"
                    value="en"
                    control={<Radio />}
                    label={CARD_MODE_LABELS.EN}
                  />
                  <FormControlLabel
                    data-cy="card-mode-settings-hiragana"
                    value="hiragana"
                    control={<Radio />}
                    label={CARD_MODE_LABELS.HIRAGANA}
                  />
                  <FormControlLabel
                    data-cy="card-mode-settings-kana"
                    value="kana"
                    control={<Radio />}
                    label={CARD_MODE_LABELS.KANA}
                  />
                  <FormControlLabel
                    data-cy="card-mode-settings-kanji"
                    value="kanji"
                    control={<Radio />}
                    label={CARD_MODE_LABELS.KANJI}
                  />
                </RadioGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {gameMode === 'guest' && (
        <FormControl sx={{ pb: 4 }}>
          <FormLabel id="game-level-group-label" data-cy="game-level-settings">
            Level
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="game-level-group-label"
            name="game-level-buttons-group"
            value={gameLevel}
            onChange={handleGameLevel}
          >
            <FormControlLabel value="1" control={<Radio />} label="1" />
            <FormControlLabel value="2" control={<Radio />} label="2" />
            <FormControlLabel value="3" control={<Radio />} label="3" />
            <FormControlLabel value="4" control={<Radio />} label="4" />
            <FormControlLabel value="5" control={<Radio />} label="5" />
          </RadioGroup>
        </FormControl>
      )}
    </Box>
  );
};
