import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import Copyright from '../src/Components/Copyright';
import { Settings } from '../src/Components/Settings';
import { UserStats } from '../src/Components/UserStats';

const Index: React.FC = () => {
  const router = useRouter();

  const handleStartGame = () => {
    router.push('/shuffle');
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} sx={{ textAlign: 'center' }}>
        <main aria-labelledby="title">
          <Box my={4}>
            <Typography id="title" variant="h4" component="h1" gutterBottom>
              Japanese Flashcards
            </Typography>
          </Box>
          <Settings />
          <UserStats />
          <Box my={4}>
            <Button variant="outlined" onClick={handleStartGame}>
              Play
            </Button>
          </Box>
        </main>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Index;
