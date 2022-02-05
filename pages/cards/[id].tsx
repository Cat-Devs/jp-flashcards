import React from "react";

import { dynamoDb } from "../../lib/dynamo-db";
import { createAudioData } from "../../lib/audio";
import { FlashCardData, FlashcardPage } from "../../src/Pages/FlashcardPage";

interface WordsProps {
  card?: FlashCardData;
  audio?: any;
  loading?: boolean;
}

const CardPage: React.FC<WordsProps> = ({ card, audio, loading }) => {
  return (
    <FlashcardPage card={card} audio={audio} loading={loading} quiz={false} />
  );
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
