import React, { useContext, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";

import { dynamoDb } from "../../lib/dynamo-db";
import { createAudioData } from "../../lib/audio";
import { Flashcard, FlashCardItem } from "../../src/Components/Flashcard";
import { Application } from "../../src/AppContext";

interface WordsProps {
  card: FlashCardItem;
  cardIds: string[];
  audio: any;
}

const CardPage: React.FC<WordsProps> = ({ card, audio, cardIds }) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Application);

  const playNextCard = () => {
    dispatch({ type: "nextCard" });
    router.push(`/cards/${state.nextCard}`);
  };

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

  const audio = await createAudioData(item.jp);
  const cardIds = items.map((item) => item.id);

  // Pass data to the page via props
  return {
    props: {
      cardIds,
      card: item,
      audio: audio.toString("hex"),
    },
  };
}

export async function getStaticPaths() {
  const { Items: items } = await dynamoDb.scan({
    FilterExpression: "attribute_exists(title)",
  });

  const paths = items.map((item) => {
    // Pass data to the page via props
    return {
      params: {
        id: item.id,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export default CardPage;
