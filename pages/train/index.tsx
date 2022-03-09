import { createHash } from 'crypto';
import { getSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { getDbClient } from '../../lib/dynamo-db';
import { trainCards } from '../../lib/train-cards';
import { useApp } from '../../src/AppState';
import { CardData, FlashCardData } from '../../src/types';

interface WordsProps {
  cards: CardData[];
}

const CardPage: React.FC<WordsProps> = ({ cards }) => {
  const { loadTrainData } = useApp();

  useEffect(() => {
    if (cards) {
      loadTrainData(cards);
    }
  }, [cards, loadTrainData]);

  return null;
  // return <FlashcardPage />;
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session?.user?.email) {
    return {
      props: {},
    };
  }

  const client = getDbClient();
  const { Items: items } = await client.query<FlashCardData>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: {
      '#type': 'type',
    },
    ExpressionAttributeValues: {
      ':type': 'card',
    },
  });

  if (!items.length) {
    return {
      props: {},
    };
  }

  const userHash = createHash('sha256').update(session.user.email).digest('hex');
  const cards = await trainCards(userHash, items);

  return {
    props: { cards },
  };
}

export default CardPage;
