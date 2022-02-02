import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { LoadingCard } from "../Components/LoadingCard";

interface ResultPageProps {
  loading: boolean;
  onHome: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ loading, onHome }) => {
  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <LoadingCard />
        </Box>
      </Container>
    );
  }

  return (
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
        <Button color="primary" onClick={onHome}>
          Go Home
        </Button>
      </CardActions>
    </Card>
  );
};
