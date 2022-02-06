import React, { useEffect } from "react";

import { dynamoDb } from "../../lib/dynamo-db";
import { useApp } from "../../src/AppState";
import { FlashcardPage } from "../../src/Pages/FlashcardPage";
import { FlashCardData } from "../../src/types";

interface WordsProps {
  cards: FlashCardData[];
}

const CardPage: React.FC<WordsProps> = ({ cards }) => {
  const { loadData } = useApp();

  useEffect(() => {
    loadData(cards);
  }, [cards, loadData]);

  return <FlashcardPage />;
};

export async function getStaticProps() {
  const { Items: items } = await dynamoDb.scan({
    FilterExpression: "attribute_exists(category) AND NOT contains(category, :last)",
    ExpressionAttributeValues: {
      ":last": "LAST_ITEM",
    },
  });

  // Pass data to the page via props
  return {
    props: {
      cards: items,
    },
    // Refresh cache every hour
    revalidate: 600,
  };
}

export default CardPage;
