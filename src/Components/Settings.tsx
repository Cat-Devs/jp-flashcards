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
import { CARD_MODE_LABELS, GAME_MODE_LABELS } from '../strings';

export const Settings: React.FC = () => {
  const { cardMode, gameLevel, gameMode, setGameMode, setLevel, setCardMode, userLoggedIn, user } = useApp();
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
    if (gameMode === 'train') {
      return GAME_MODE_LABELS.TRAIN;
    }
    if (gameMode === 'practice') {
      return GAME_MODE_LABELS.PRACTICE;
    }
    if (gameMode === 'weak') {
      return GAME_MODE_LABELS.WEAK;
    }
    if (gameMode === 'guest') {
      return GAME_MODE_LABELS.GUEST;
    }

    return userLoggedIn ? GAME_MODE_LABELS.TRAIN : GAME_MODE_LABELS.GUEST;
  }, [gameMode, userLoggedIn]);

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
    <Box sx={{ my: 4 }} data-testid="Settings">
      {userLoggedIn && (
        <Box sx={{ pb: 4 }}>
          <Accordion
            variant="outlined"
            expanded={gameModeExpanded}
            onChange={() => setGameModeExpanded(!gameModeExpanded)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              data-cy="game-mode-settings"
              data-testid="game-mode-settings"
            >
              <Typography>{gameModeLabel}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl>
                <RadioGroup name="game-mode-buttons-group" value={gameMode} onChange={handleGameMode}>
                  <FormControlLabel
                    value="train"
                    data-testid="game-mode-settings-train"
                    control={<Radio />}
                    label={GAME_MODE_LABELS.TRAIN}
                  />
                  {(user.learnedCards && (
                    <FormControlLabel
                      value="practice"
                      data-testid="game-mode-settings-practice"
                      control={<Radio />}
                      label={GAME_MODE_LABELS.PRACTICE}
                    />
                  )) ||
                    null}
                  {(user.weakCards && (
                    <FormControlLabel
                      value="weak"
                      data-testid="game-mode-settings-weak"
                      control={<Radio />}
                      label={GAME_MODE_LABELS.WEAK}
                    />
                  )) ||
                    null}
                  <FormControlLabel
                    value="guest"
                    data-testid="game-mode-settings-guest"
                    control={<Radio />}
                    label={GAME_MODE_LABELS.GUEST}
                  />
                </RadioGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {gameMode !== 'train' && (
        <Box sx={{ pb: 4 }}>
          <Accordion
            variant="outlined"
            expanded={cardModeExpanded}
            onChange={() => setCardModeExpanded(!cardModeExpanded)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              data-cy="card-mode-settings"
              data-testid="card-mode-settings"
            >
              <Typography>{cardModeLabel}</Typography>
            </AccordionSummary>
            <AccordionDetails data-cy="card-mode-details">
              <FormControl>
                <RadioGroup name="card-mode-buttons-group" value={cardMode} onChange={handleCardMode}>
                  <FormControlLabel
                    data-cy="card-mode-settings-en"
                    data-testid="card-mode-settings-en"
                    value="en"
                    control={<Radio />}
                    label={CARD_MODE_LABELS.EN}
                  />
                  <FormControlLabel
                    data-cy="card-mode-settings-hiragana"
                    data-testid="card-mode-settings-hiragana"
                    value="hiragana"
                    control={<Radio />}
                    label={CARD_MODE_LABELS.HIRAGANA}
                  />
                  <FormControlLabel
                    data-cy="card-mode-settings-kana"
                    data-testid="card-mode-settings-kana"
                    value="kana"
                    control={<Radio />}
                    label={CARD_MODE_LABELS.KANA}
                  />
                  <FormControlLabel
                    data-cy="card-mode-settings-kanji"
                    data-testid="card-mode-settings-kanji"
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
          <FormLabel id="game-level-group-label" data-cy="game-level-settings" data-testid="game-level">
            Level
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="game-level-group-label"
            name="game-level-buttons-group"
            data-testid="game-level-buttons-group"
            value={gameLevel}
            onChange={handleGameLevel}
          >
            <FormControlLabel value="1" data-testid="game-level-1" control={<Radio />} label="1" />
            <FormControlLabel value="2" data-testid="game-level-2" control={<Radio />} label="2" />
            <FormControlLabel value="3" data-testid="game-level-3" control={<Radio />} label="3" />
            <FormControlLabel value="4" data-testid="game-level-4" control={<Radio />} label="4" />
            <FormControlLabel value="5" data-testid="game-level-5" control={<Radio />} label="5" />
          </RadioGroup>
        </FormControl>
      )}
    </Box>
  );
};
