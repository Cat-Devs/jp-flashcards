import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Copyright } from '../src/Components/Copyright';
import { HomePage } from '../src/Pages/HomePage';

const Index: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box my={4} sx={{ textAlign: 'center' }}>
        <HomePage />
        <Copyright />
      </Box>
    </Container>
  );
};

export default Index;
