import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Copyright from "../src/Copyright";
import Link from "next/link";
import { Button } from "@mui/material";

const Index: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Japanese Flashcards
        </Typography>
        <Link
          passHref
          href={{
            pathname: "/play",
          }}
        >
          <Button variant="outlined">Start</Button>
        </Link>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Index;
