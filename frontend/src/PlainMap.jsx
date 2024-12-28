import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import SearchBar from "./SearchBar";
import ZoomControl from "./ZoomControl";
import SearchFunctionality from "./SearchFunctionality";

import { Box } from "@mui/material";

const PlainMap = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <SearchBar onSearch={setSearchQuery} />
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={3}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl />
        <SearchFunctionality query={searchQuery} />
      </MapContainer>
    </Box>
  );
};

export default PlainMap;
