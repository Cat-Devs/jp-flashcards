import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { LoadingCard } from "../Components/LoadingCard";
import { useApp } from "../AppState";

export const ResultPage: React.FC = () => {
  const { goHome, loading, playWrongCards, stats } = useApp();

  if (loading) {
    return (
      <Container maxWidth="md" disableGutters>
        <Box sx={{ p: 2 }}>
          <LoadingCard />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" disableGutters>
      <Box sx={{ p: 2 }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Challenge completed.
            </Typography>
            {stats.wrongCards ? (
              <Typography gutterBottom variant="h5" component="div">
                You have missed {stats.wrongCards} cards.
              </Typography>
            ) : (
              <Typography gutterBottom variant="h5" component="div">
                You have correctly guessed all the cards.
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Button color="primary" onClick={goHome}>
              Go Home
            </Button>
            {stats.wrongCards ? (
              <Button color="primary" onClick={playWrongCards}>
                Play wrong cards
              </Button>
            ) : null}
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};
