import React from "react";
import { isMobile } from "react-device-detect";

import { dynamoDb } from "../../lib/dynamo-db";
import { createAudioData } from "../../lib/audio";
import { useApp } from "../../src/AppState";
import { FlashCardData, FlashcardPage } from "../../src/Pages/FlashcardPage";
import { KeyboardHelper } from "../../src/Components/KeyboardHelper";
import { ResultPage } from "../../src/Pages/ResultPage";

interface CardPageProps {
  card?: FlashCardData;
  audio?: any;
  loading?: boolean;
}

const CardPage: React.FC<CardPageProps> = ({ card, audio, loading }) => {
  const { currentCard } = useApp();

  if (!loading && !Boolean(currentCard)) {
    return <ResultPage loading={loading} />;
  }

  return (
    <>
      <FlashcardPage card={card} audio={audio} loading={loading} quiz={true} />
      {!isMobile && <KeyboardHelper />}
    </>
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
