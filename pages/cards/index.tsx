import React from "react";
import { useRouter } from "next/router";

import { dynamoDb } from "../../lib/dynamo-db";
import { useEffect } from "react";

interface WordsProps {
  cardId?: string;
}

const CardPage: React.FC<WordsProps> = ({ cardId }) => {
  const router = useRouter();
  useEffect(() => {
    router.push(`/cards/${cardId}`);
  }, [router, cardId]);

  return null;
};

export async function getStaticProps() {
  const { Items: items } = await dynamoDb.scan({
    FilterExpression: "attribute_exists(title)",
  });

  const random = Math.floor(Math.random() * items.length);
  const item = items[random];

  // Pass data to the page via props
  return {
    props: {
      cardId: item.id,
    },
  };
}

export default CardPage;
