import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";

import Copyright from "../src/Components/Copyright";

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
            pathname: "/cards",
          }}
        >
          <Button variant="outlined">Play Words flashcards</Button>
        </Link>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Index;
