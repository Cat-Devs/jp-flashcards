import React, { useEffect } from "react";

import { dynamoDb } from "../../lib/dynamo-db";
import { useApp } from "../../src/AppState";
import { FlashcardPage } from "../../src/Pages/FlashcardPage";

interface WordsProps {
  cardId?: string;
  cardIds: string[];
}

const CardPage: React.FC<WordsProps> = ({ cardIds, cardId }) => {
  const { loadData } = useApp();

  useEffect(() => {
    loadData(cardIds, cardId);
  }, []);

  return <FlashcardPage loading={true} />;
};

export async function getStaticProps() {
  const { Items: items } = await dynamoDb.scan({});

  const random = Math.floor(Math.random() * items.length);
  const item = items[random];
  const cardIds = items.map((item) => item.id);

  // Pass data to the page via props
  return {
    props: {
      cardIds,
      cardId: item.id,
    },
    // Refresh cache every hour
    revalidate: 600,
  };
}

export default CardPage;
