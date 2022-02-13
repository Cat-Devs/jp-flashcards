import React from 'react';

import { dynamoDb } from '../../lib/dynamo-db';
import { FlashcardPage } from '../../src/Pages/FlashcardPage';
import { FlashCardData } from '../../src/types';

interface WordsProps {
  card?: FlashCardData;
}

const CardPage: React.FC<WordsProps> = ({ card }) => {
  return <FlashcardPage card={card} quiz={false} />;
};

export async function getStaticProps({ params }) {
  const { Item: item } = await dynamoDb.get({
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
