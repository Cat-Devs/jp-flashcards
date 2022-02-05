import React, { useEffect } from "react";

import { dynamoDb } from "../../lib/dynamo-db";
import { useApp } from "../../src/AppState";
import { FlashcardPage } from "../../src/Pages/FlashcardPage";

interface WordsProps {
  cardIds: string[];
  hiraganaIds: string[];
  kanjiIds: string[];
}

const CardPage: React.FC<WordsProps> = ({ cardIds, hiraganaIds, kanjiIds }) => {
  const { loadData } = useApp();

  useEffect(() => {
    loadData(cardIds, hiraganaIds, kanjiIds);
  }, [loadData, cardIds, hiraganaIds, kanjiIds]);

  return <FlashcardPage />;
};

export async function getStaticProps() {
  const { Items: items } = await dynamoDb.scan({
    FilterExpression: "attribute_exists(category) AND NOT contains(category, :last)",
    ExpressionAttributeValues: {
      ":last": "LAST_ITEM",
    },
  });

  const cards = items.map((item) => item.id);
  const kanjis = items.filter((item) => item.kanji).map((item) => item.id);
  const hiraganas = items.filter((item) => item.hiragana).map((item) => item.id);

  const cardIds = cards.splice(0, 30);
  const hiraganaIds = hiraganas.splice(0, 30);
  const kanjiIds = kanjis.splice(0, 30);

  // Pass data to the page via props
  return {
    props: {
      cardIds,
      hiraganaIds,
      kanjiIds,
    },
    // Refresh cache every hour
    revalidate: 600,
  };
}

export default CardPage;
