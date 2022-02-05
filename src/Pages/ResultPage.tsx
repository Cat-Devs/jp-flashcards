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

interface ResultPageProps {
  loading: boolean;
}

export const ResultPage: React.FC<ResultPageProps> = ({ loading }) => {
  const { goHome } = useApp();

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
              Well Done.
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              You have completed the challenge
            </Typography>
          </CardContent>
          <CardActions>
            <Button color="primary" onClick={goHome}>
              Go Home
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
};
