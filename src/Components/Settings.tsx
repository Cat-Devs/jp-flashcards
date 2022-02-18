import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React, { useCallback } from 'react';
import type { CardMode, GameLevel, GameMode } from '../AppState';
import { useApp } from '../AppState';

export const Settings: React.FC = () => {
  const { cardMode, gameLevel, gameMode, setGame, setLevel, setMode, userLoggedIn } = useApp();

  const handleSetGame = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGame(event.target.value as CardMode);
    },
    [setGame]
  );

  const handleGameLevel = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLevel(event.target.value as GameLevel);
    },
    [setLevel]
  );

  const handleGameMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMode(event.target.value as GameMode);
    },
    [setMode]
  );

  return (
    <Box sx={{ my: 4 }}>
      {userLoggedIn && (
        <FormControl sx={{ pb: 4 }}>
          <RadioGroup
            aria-labelledby="game-mode-group-label"
            name="game-mode-buttons-group"
            value={gameMode}
            onChange={handleGameMode}
          >
            <FormControlLabel value="guest" control={<Radio />} label="Use all words" />
            <FormControlLabel value="learn" control={<Radio />} label="Learn new words" />
            <FormControlLabel value="practice" control={<Radio />} label="Practice learned Words" />
          </RadioGroup>
        </FormControl>
      )}

      <FormControl sx={{ pb: 4 }}>
        <FormLabel id="game-mode-group-label">Show cards in</FormLabel>
        <RadioGroup
          row
          aria-labelledby="game-mode-group-label"
          name="game-mode-buttons-group"
          value={cardMode}
          onChange={handleSetGame}
        >
          <FormControlLabel value="en" control={<Radio />} label="English" />
          <FormControlLabel value="hiragana" control={<Radio />} label="Hiragana" />
          <FormControlLabel value="kana" control={<Radio />} label="Any Kana" />
          <FormControlLabel value="kanji" control={<Radio />} label="Kanji" />
        </RadioGroup>
      </FormControl>

      {gameMode === 'guest' && (
        <FormControl sx={{ pb: 4 }}>
          <FormLabel id="game-level-group-label">Level</FormLabel>
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
