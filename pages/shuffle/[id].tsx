import React from 'react';
import { getDbClient } from '../../lib/dynamo-db';
import { useApp } from '../../src/AppState';
import { FlashcardPage } from '../../src/Pages/FlashcardPage';
import { ResultPage } from '../../src/Pages/ResultPage';
import type { FlashCardData } from '../../src/types';

interface CardPageProps {
  card?: FlashCardData;
}

const CardPage: React.FC<CardPageProps> = ({ card }) => {
  const { currentCard, loading } = useApp();

  if (!loading && !Boolean(currentCard)) {
    return <ResultPage />;
  }

  return <FlashcardPage card={card} quiz={true} />;
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

export default CardPage;
