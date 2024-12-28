import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { List, ListItem, ListItemText, Paper, Typography, Box ,Collapse} from "@mui/material";
import { styled } from "@mui/material/styles";

const ResultsList = styled(Paper)(({ theme }) => ({
    position: "absolute",
    top: "calc(2% + 60px)", 
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "50vh",
    overflowY: "auto",
    zIndex: 1000,
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 32px)",
      margin: "0 16px",
    },
}));

const SearchFunctionality = ({ query }) => {
    const map = useMap();
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
  
    useEffect(() => {
      if (query) {
        const fetchLocation = async () => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                query
              )}&format=json&limit=5&addressdetails=1&extratags=1`
            );
            const data = await response.json();
            setSearchResults(data);
            setShowResults(data.length > 0);
          } catch (error) {
            console.error("Error fetching location:", error);
            setSearchResults([]);
            setShowResults(false);
          }
        };
  
        fetchLocation();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, [query]);
  
    const handleLocationSelect = (result) => {
      const { boundingbox } = result;
      const southWest = [parseFloat(boundingbox[0]), parseFloat(boundingbox[2])];
      const northEast = [parseFloat(boundingbox[1]), parseFloat(boundingbox[3])];
      
      map.fitBounds([southWest, northEast], { padding: [50, 50] });
      setShowResults(false); 
    };
  return (
    <Collapse in={showResults}>
      <ResultsList>
        <List>
          {searchResults.map((result, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleLocationSelect(result)}
            >
              <ListItemText
                primary={result.display_name}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {`Type: ${result.type}, Class: ${result.class}`}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </ResultsList>
    </Collapse>
  );
};

export default SearchFunctionality;

