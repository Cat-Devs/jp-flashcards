import React, { useContext } from "react";
import { useRouter } from "next/router";

import { dynamoDb } from "../../lib/dynamo-db";
import { useEffect } from "react";
import { Application } from "../../src/AppContext";

interface WordsProps {
  cardId?: string;
  cardIds: string[];
}

const CardPage: React.FC<WordsProps> = ({ cardId, cardIds }) => {
  const router = useRouter();
  const { dispatch } = useContext(Application);

  useEffect(() => {
    dispatch({
      type: "loadData",
      payload: { cards: cardIds, currentCard: cardId },
    });
    router.push(`/cards/${cardId}`);
  }, [router, dispatch, cardId, cardIds]);

  return null;
};

export async function getStaticProps() {
  const { Items: items } = await dynamoDb.scan({
    FilterExpression: "attribute_exists(title)",
  });

  const random = Math.floor(Math.random() * items.length);
  const item = items[random];
  const cardIds = items.map((item) => item.id);

  // Pass data to the page via props
  return {
    props: {
      cardIds,
      cardId: item.id,
    },
    revalidate: 600,
  };
}

export default CardPage;
