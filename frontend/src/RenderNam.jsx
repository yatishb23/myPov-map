import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const RenderNames = ({ locationData, isVisible }) => {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoomChange = () => {
      setCurrentZoom(map.getZoom());
    };

    map.on("zoomend", handleZoomChange);

    return () => {
      map.off("zoomend", handleZoomChange);
    };
  }, [map]);

  useEffect(() => {
    const markers = [];

    if (locationData && locationData.length > 0) {
      locationData.map((location) => {
        const { lat, lng, name, fontColor = "black", fontSize = "13px", zoom } = location;

        if (currentZoom >= zoom-2) {
          const marker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: "custom-text-marker",
              html: `
                <div style="
                  color: ${fontColor};
                  font-size: ${fontSize};
                  font-weight: normal;
                  font-family: "Lucida Console", "Courier New", monospace;
                  transform: translate(-50%, -50%); /* Center text horizontally and vertically */
                ">
                  ${name}
                </div>`,
              iconSize: L.point(0, 0), // Set iconSize to 0 to avoid default icon size
              iconAnchor: [0, 0], // Anchor point at center
            //   className: "custom-marker",
            }),
          });

          marker.addTo(map);
          markers.push(marker);
        }
      });
    }

    return () => {
      markers.forEach((marker) => map.removeLayer(marker));
    };
  }, [locationData, currentZoom, isVisible, map]);

  return null;
};

export default RenderNames;