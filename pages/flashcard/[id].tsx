import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

import { dynamoDb } from "../../lib/dynamo-db";

interface FlashCard {
  kanji: string;
  hiragana: string;
  katakana: string;
  jp: string;
  examples: string[];
  romaji: string;
  id: string;
  pictureId: string;
  title: string;
}
interface PageProps {
  card: FlashCard;
}

const Page: React.FC<PageProps> = ({ card }) => {
  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

// This gets called on every request
export async function getStaticPaths() {
  const { Items } = await dynamoDb.scan({
    FilterExpression: "attribute_exists(title)",
  });

  const paths = Items.map((item) => ({ params: { id: item.id } }));

  return {
    paths,
    fallback: false,
  };
}

export async function getServerSideProps({ params }) {
  const { Item } = await dynamoDb.get({
    Key: {
      id: params.id,
    },
  });

  console.warn(Item);

  // Pass data to the page via props
  return {
    props: {
      card: Item,
    },
  };
}

export default Page;
