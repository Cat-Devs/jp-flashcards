import React from "react";

import { dynamoDb } from "../../lib/dynamo-db";
import { useApp } from "../../src/AppState";
import { FlashcardPage } from "../../src/Pages/FlashcardPage";
import { ResultPage } from "../../src/Pages/ResultPage";
import { FlashCardData } from "../../src/types";

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
  const { Item: item } = await dynamoDb.get({
    Key: {
      id: params.id,
    },
  });

  if (!item) {
    return {
      props: {},
      // Refresh cache every hour
      revalidate: 600,
    };
  }

  // Pass data to the page via props
  return {
    props: {
      card: item,
    },
    // Refresh cache every hour
    revalidate: 600,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default CardPage;
