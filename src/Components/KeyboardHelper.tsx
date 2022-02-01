import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { blueGrey } from "@mui/material/colors";

export const KeyboardHelper = () => {
  return (
    <Box
      sx={{
        width: "100%",
        position: "absolute",
        bottom: 0,
        left: 0,
        textAlign: "center",
      }}
    >
      <Typography gutterBottom variant="h6">
        Navigate with your keyboard
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "4px 14px",
            alignItems: "center",
          }}
        >
          <Avatar
            variant="rounded"
            sx={{ bgcolor: blueGrey[600], marginBottom: "4px" }}
          >
            <ArrowLeft />
          </Avatar>
          <Typography>Wrong</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "4px 14px",
            alignItems: "center",
          }}
        >
          <Avatar
            variant="rounded"
            sx={{ bgcolor: blueGrey[600], marginBottom: "4px" }}
          >
            <ArrowRight />
          </Avatar>
          <Typography>Correct</Typography>
        </Box>
      </Box>
    </Box>
  );
};
