import React from "react";

import { dynamoDb } from "../../lib/dynamo-db";
import { createAudioData } from "../../lib/audio";
import { FlashcardPage } from "../../src/Pages/FlashcardPage";
import { FlashCardData } from "../../src/types";

interface WordsProps {
  card?: FlashCardData;
  audio?: any;
}

const CardPage: React.FC<WordsProps> = ({ card, audio }) => {
  return <FlashcardPage card={card} audio={audio} quiz={false} />;
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
