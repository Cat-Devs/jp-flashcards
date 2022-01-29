import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { dynamoDb } from "../../lib/dynamo-db";
import { createAudioData } from "../../lib/audio";
import { Flashcard, FlashCardItem } from "../../src/Components/Flashcard";
import { useApp } from "../../src/AppState";

interface WordsProps {
  card?: FlashCardItem;
  cardIds?: string[];
  audio?: any;
}

const CardPage: React.FC<WordsProps> = ({ card, audio, cardIds }) => {
  const router = useRouter();
  const { state, dispatch } = useApp();

  const playNextCard = () => {
    dispatch({ type: "nextCard" });
    router.push(`/cards/${state.nextCard}`);
  };

  useEffect(() => {
    if (!card) {
      dispatch({ type: "nextCard" });
      router.push(`/cards/${state.nextCard}`);
    }
  }, [card, dispatch, router, state.nextCard]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Flashcard card={card} audio={audio} onNext={playNextCard} />
      </Box>
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const { Items: items } = await dynamoDb.scan({
    FilterExpression: "attribute_exists(title)",
  });

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

  const cardIds = items.map((item) => item.id);
  const audio = await createAudioData(item.jp);

  // Pass data to the page via props
  return {
    props: {
      cardIds,
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
