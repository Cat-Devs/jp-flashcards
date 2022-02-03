import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
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
  const { currentCard, nextCard, goHome } = useApp();

  if (!loading && !Boolean(currentCard)) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <ResultPage onHome={goHome} loading={loading} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <FlashcardPage
          card={card}
          audio={audio}
          onNext={nextCard}
          loading={loading}
          quiz={true}
        />
      </Box>
      {!isMobile && <KeyboardHelper />}
    </Container>
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
