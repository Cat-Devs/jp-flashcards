import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';

import { useApp } from '../AppState';
import { GameMode, GameLevel } from '../AppState/types';

export const Settings: React.FC = () => {
  const { gameMode, gameLevel, setGame, setLevel } = useApp();

  const handleSetGame = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGame(event.target.value as GameMode);
    },
    [setGame]
  );

  const handleGameLevel = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLevel(event.target.value as GameLevel);
    },
    [setLevel]
  );

  return (
    <Box sx={{ my: 4 }}>
      <FormControl>
        <FormLabel id="game-mode-group-label">Game Mode</FormLabel>
        <RadioGroup
          row
          aria-labelledby="game-mode-group-label"
          name="game-mode-buttons-group"
          value={gameMode}
          onChange={handleSetGame}
        >
          <FormControlLabel value="en" control={<Radio />} label="English" />
          <FormControlLabel value="hiragana" control={<Radio />} label="Hiragana" />
          <FormControlLabel value="kana" control={<Radio />} label="Kana" />
          <FormControlLabel value="kanji" control={<Radio />} label="Kanji" />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel id="game-mode-group-label">Level</FormLabel>
        <RadioGroup
          row
          aria-labelledby="game-mode-group-label"
          name="game-mode-buttons-group"
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
    </Box>
  );
};
