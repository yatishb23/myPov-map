import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const SearchFunctionality = ({ query }) => {
    const map = useMap();
  
    useEffect(() => {
      if (query) {
        const fetchLocation = async () => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                query
              )}&format=json`
            );
            const data = await response.json();
            console.log(data);
            if (data.length > 0) {
              const { lat, lon } = data[0];
              map.flyTo([lat, lon], 15);
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
export default SearchFunctionality