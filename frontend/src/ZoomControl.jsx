import React from 'react'
import { Box } from "@mui/material";
import { Add ,Remove} from '@mui/icons-material';
import { MapContainer, TileLayer, useMap } from "react-leaflet";
const ZoomControl=()=> {
    const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        onClick={handleZoomIn}
        sx={{
          bgcolor: "background.paper",
          mb: 1,
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "2px",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Add />
      </Box>
      <Box
        onClick={handleZoomOut}
        sx={{
          bgcolor: "background.paper",
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "2px",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <Remove />
      </Box>
    </Box>
  );
  
}

export default ZoomControl