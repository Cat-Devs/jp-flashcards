import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { dynamoDb } from "../../lib/dynamo-db";
import { createAudioData } from "../../lib/audio";
import { useApp } from "../../src/AppState";
import { FlashCardItem } from "../../src/Components/Flashcard";
import { FlashcardPage } from "../../src/Pages/FlashcardPage";

interface WordsProps {
  card?: FlashCardItem;
  audio?: any;
}

const CardPage: React.FC<WordsProps> = ({ card, audio }) => {
  const { nextCard, state } = useApp();

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <FlashcardPage
          card={card}
          audio={audio}
          onNext={nextCard}
          quiz={Boolean(state.nextCard)}
        />
      </Box>
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
