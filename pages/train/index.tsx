import React, { useEffect } from 'react';
import { getDbClient } from '../../lib/dynamo-db';
import { useApp } from '../../src/AppState';
import { FlashcardPage } from '../../src/Pages/FlashcardPage';
import { FlashCardData } from '../../src/types';

interface WordsProps {
  cards: FlashCardData[];
}

const CardPage: React.FC<WordsProps> = () => {
  const { loadData } = useApp();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return <FlashcardPage />;
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

export default CardPage;
