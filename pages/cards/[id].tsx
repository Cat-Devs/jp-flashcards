import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { getDbClient } from '../../lib/dynamo-db';
import { useApp } from '../../src/AppState';
import { CardNotFound } from '../../src/Components/CardNotFound';
import { LoadingCard } from '../../src/Components/LoadingCard';
import { FlashcardPage } from '../../src/Pages/FlashcardPage';
import { FlashCardData } from '../../src/types';

interface WordsProps {
  card?: FlashCardData;
  error?: boolean;
}

const CardPage: React.FC<WordsProps> = ({ card, error }) => {
  const { goHome, loading } = useApp();

  if (error) {
    return (
      <Container maxWidth="md" disableGutters>
        <Box sx={{ p: 2 }}>
          <CardNotFound onGoHome={goHome} />
        </Box>
      </Container>
    );
  }

  if (!card || loading) {
    return (
      <Container maxWidth="md" disableGutters>
        <Box sx={{ p: 2 }}>
          <LoadingCard />
        </Box>
      </Container>
    );
  }

  return <FlashcardPage card={card} quiz={false} />;
};

export async function getStaticProps({ params }) {
  const client = getDbClient();
  const { Item: item } = await client.get({
    Key: {
      id: params.id,
    },
  });

  if (!item) {
    return {
      props: {
        error: true,
      },
    };
  }

  // Pass data to the page via props
  return {
    props: {
      card: item,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default CardPage;
