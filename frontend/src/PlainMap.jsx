import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import SearchBar from "./SearchBar";
import ZoomControl from "./ZoomControl";
import SearchFunctionality from "./SearchFunctionality";
import RenderNames from "./RenderNam";
import { Box, Button } from "@mui/material";
import MapClickHandle from "./MapClickHandle";

const PlainMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationData, setLocationData] = useState([]);
  const [isVisible, setIsVisible] = useState(true); 

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:4000/getLocations");
        const data = await response.json();
        setLocationData(data); 
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

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
          // url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl />
        <SearchFunctionality query={searchQuery} />
        <MapClickHandle/>
        <RenderNames locationData={locationData} isVisible={isVisible} />
      </MapContainer>
    </Box>
  );
};

export default PlainMap;
