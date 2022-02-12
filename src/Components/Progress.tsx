import React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

interface ProgressProps {
  status: number;
}

export const Progress: React.FC<ProgressProps> = ({ status }) => {
  return (
    <Box sx={{ p: 2, pb: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={Number(status || 0)} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(status)}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
