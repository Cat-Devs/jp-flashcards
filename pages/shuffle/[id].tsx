import React from 'react';
import { getDbClient } from '../../lib/dynamo-db';
import { useApp } from '../../src/AppState';
import { FlashcardPage } from '../../src/Pages/FlashcardPage';
import type { FlashCardData } from '../../src/types';

interface ShufflePageProps {
  card?: FlashCardData;
}

const ShufflePage: React.FC<ShufflePageProps> = ({ card }) => {
  const { currentGame } = useApp();
  const cardAccuracy = currentGame.cards.find((cardItem) => cardItem.id === card.id).accuracy;

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
