import React from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardActionArea from "@mui/material/CardActionArea";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export const LoadingPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Card>
          <CardHeader
            avatar={
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            }
            title={
              <Skeleton
                animation="wave"
                height={10}
                width="50%"
                style={{ marginBottom: 6 }}
              />
            }
          ></CardHeader>
          <CardContent>
            <React.Fragment>
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{ marginBottom: 12 }}
              />
              <Skeleton
                animation="wave"
                height={10}
                width="50%"
                style={{ marginBottom: 6 }}
              />
            </React.Fragment>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
