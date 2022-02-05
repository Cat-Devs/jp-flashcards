import React from "react";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";

import { useApp } from "../AppState";
import { GameMode } from "../AppState/types";

export const Settings: React.FC = () => {
  const { gameMode, setGame } = useApp();

  const handleSetGame = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGame(event.target.value as GameMode);
  };

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
    </Box>
  );
};
