import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useApp } from '../AppState';
import { Settings } from '../Components/Settings';
import { UserStats } from '../Components/UserStats';

export const HomePage: React.FC = () => {
  const { gameMode, user, userLoggedIn } = useApp();
  const router = useRouter();

  const handleStartGame = () => {
    // if (userLoggedIn && gameMode === 'train') {
    //   router.push('/train');
    //   return;
    // }
    router.push('/shuffle');
  };

  const userStatsEnabled = useMemo(() => {
    return userLoggedIn && gameMode === 'train';
  }, [gameMode, userLoggedIn]);

  return (
    <main aria-labelledby="title">
      <Box my={4}>
        <Typography id="title" variant="h4" component="h1" gutterBottom>
          Japanese Flashcards
        </Typography>
      </Box>
      <Settings />
      {userStatsEnabled && <UserStats user={user} />}
      <Box my={4}>
        <Button variant="outlined" onClick={handleStartGame}>
          Play
        </Button>
      </Box>
    </main>
  );
};
