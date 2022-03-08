import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { UserState } from '../AppState';

interface UserStatsProps {
  user?: UserState;
}

export const UserStats: React.FC<UserStatsProps> = ({ user }) => {
  const weakCardsCopy = useMemo(() => {
    if (!user?.weakCards) {
      return null;
    }
    if (user.weakCards === 1) {
      return 'You only have 1 word to improve';
    }
    return `You have ${user.weakCards} words to improve`;
  }, [user?.weakCards]);

  const learnedCardsCopy = useMemo(() => {
    if (!user?.learnedCards) {
      return null;
    }
    if (!user.learnedCards) {
      return "You haven't learned any word yet";
    }
    if (user.learnedCards === 1) {
      return 'You know only 1 word for now';
    }
    return `You have studied a total of ${user.learnedCards} words so far`;
  }, [user?.learnedCards]);

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ pb: 2 }}>
        <Typography>Your current level is {user.level}</Typography>
        <Typography>{learnedCardsCopy}</Typography>
        {(user.learnedCards && user.weakCards && <Typography>{weakCardsCopy}</Typography>) || null}
      </Box>
      <Typography>That{"'"}s amazing. Keep learning!</Typography>
    </Box>
  );
};
