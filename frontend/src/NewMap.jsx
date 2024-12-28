import React, { useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
      <input
        type="text"
        placeholder="Search location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "8px", width: "200px" }}
      />
      <button onClick={handleSearch} style={{ padding: "8px" }}>
        Search
      </button>
    </div>
  );
};

const SearchFunctionality = ({ query }) => {
  const map = useMap();

  React.useEffect(() => {
    if (query) {
      const fetchLocation = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              query
            )}&format=json`
          );
          const data = await response.json();
          if (data.length > 0) {
            const { lat, lon } = data[0];
            map.flyTo([lat, lon], 13); // Adjust zoom level as needed
          } else {
            alert("Location not found.");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      };

      fetchLocation();
    }
  }, [query, map]);

  return null;
};

const LeafletMapWithSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div style={{ height: "100vh" }}>
      <SearchBar onSearch={setSearchQuery} />
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SearchFunctionality query={searchQuery} />
      </MapContainer>
    </div>
  );
};

export default LeafletMapWithSearch;
