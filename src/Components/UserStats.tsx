import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo } from 'react';
import { useApp } from '../AppState';

interface UserStatsProps {}

export const UserStats: React.FC<UserStatsProps> = ({}) => {
  const { userLoggedIn, userStats, fetchUserData, gameMode } = useApp();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const weakCardsCopy = useMemo(() => {
    if (!userStats?.weakCards) {
      return null;
    }

    if (!userStats.weakCards) {
      return "You rock! You don't have any card to improve";
    }
    if (userStats.weakCards === 1) {
      return 'You only have 1 card to improve';
    }
    return `You have ${userStats.weakCards} cards to improve`;
  }, [userStats?.weakCards]);

  const learnedCardsCopy = useMemo(() => {
    if (!userStats?.learnedCards) {
      return null;
    }

    if (!userStats.learnedCards) {
      return "You haven't learned any card yet.";
    }
    if (userStats.learnedCards === 1) {
      return 'You know only 1 card for now.';
    }
    return `You have learned ${userStats.learnedCards} cards so far.`;
  }, [userStats?.learnedCards]);

  if (!userLoggedIn || !userStats || gameMode !== 'learn') {
    return null;
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography>Your current level is: {userStats.level}</Typography>
      {(userStats.learnedCards && <Typography>{weakCardsCopy}</Typography>) || null}
      <Typography gutterBottom>{learnedCardsCopy}</Typography>
      <Typography>That{"'"}s amazing. Keep learning!</Typography>
    </Box>
  );
};
