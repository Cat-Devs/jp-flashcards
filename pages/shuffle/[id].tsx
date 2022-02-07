import React from "react";

import { dynamoDb } from "../../lib/dynamo-db";
import { createAudioData } from "../../lib/audio";
import { useApp } from "../../src/AppState";
import { FlashcardPage } from "../../src/Pages/FlashcardPage";
import { ResultPage } from "../../src/Pages/ResultPage";
import { FlashCardData } from "../../src/types";

interface CardPageProps {
  card?: FlashCardData;
  audio?: any;
}

const CardPage: React.FC<CardPageProps> = ({ card, audio }) => {
  const { currentCard, loading } = useApp();

  if (!loading && !Boolean(currentCard)) {
    return <ResultPage />;
  }

  return <FlashcardPage card={card} audio={audio} quiz={true} />;
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

  const audio = await createAudioData(item.jp);

  // Pass data to the page via props
  return {
    props: {
      card: item,
      audio: audio.toString("hex"),
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
