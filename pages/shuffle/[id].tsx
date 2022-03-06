import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { getDbClient } from '../../lib/dynamo-db';
import { useApp } from '../../src/AppState';
import { LoadingCard } from '../../src/Components/LoadingCard';
import { FlashcardPage } from '../../src/Pages/FlashcardPage';
import type { FlashCardData } from '../../src/types';

interface ShufflePageProps {
  card?: FlashCardData;
}

const ShufflePage: React.FC<ShufflePageProps> = ({ card }) => {
  const { currentGame } = useApp();

  if (!card) {
    return (
      <Container maxWidth="md" disableGutters>
        <Box sx={{ p: 2 }}>
          <LoadingCard />
        </Box>
      </Container>
    );
  }

  const cardAccuracy = currentGame.cards.find((cardItem) => cardItem.id === card.id)?.accuracy;

  return <FlashcardPage card={card} quiz={true} accuracy={cardAccuracy} />;
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
      props: {},
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

export default ShufflePage;
