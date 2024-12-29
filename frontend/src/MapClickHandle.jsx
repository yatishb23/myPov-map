import React, { useState, useEffect } from "react";
import { useMapEvent, useMap } from "react-leaflet";
import { Check } from "lucide-react";

function MapClickHandle() {
  const [popup, setPopup] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [coord, setCoord] = useState({ lat: 0, lng: 0 });
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [tempMarker, setTempMarker] = useState(null);
  const [popupPosition, setPopupPosition] = useState("right");
  const [currentZoom, setCurrentZoom] = useState(3);

  // Colors for the color picker
  const colors = [
    { hex: "#000000", name: "Black" },
    { hex: "#CCCCCC", name: "Gray" },
    { hex: "#FF0000", name: "Red" },
    { hex: "#ff5100", name: "Yellow" },
    { hex: "#FF7F00", name: "Orange" },
    { hex: "#FFFF00", name: "Yellow" },
    { hex: "#00FF00", name: "Green" },
    { hex: "#0FF0FF", name: "Light Blue" },
    { hex: "#0000FF", name: "Blue" },
  ];

  // State to hold the form data and saved locations
  const [formData, setFormData] = useState({
    name: "",
    color: "#000000",
    font: "Arial",
    lat: 0,
    lng: 0,
    zoom: currentZoom,
  });
  const [locationData, setLocationData] = useState([]);

  const map = useMap();

  useMapEvent("click", (e) => {
    if (popup.visible) return;

    const { lat, lng } = e.latlng;
    setCoord({ lat, lng });
    setTempMarker({ lat, lng });

    const point = map.latLngToContainerPoint(e.latlng);
    setPopup({
      visible: true,
      x: point.x,
      y: point.y,
    });
  });

  // Handle zoom changes to adjust markers
  useMapEvent("zoomend", () => {
    const zoomLevel = map.getZoom();
    setCurrentZoom(zoomLevel);

    // Remove all existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer.options.icon.options.className === "custom-text-marker") {
        map.removeLayer(layer);
      }
    });

    // Add markers based on zoom level
    locationData.forEach((location) => {
      if (zoomLevel >= location.zoom) {
        const { lat, lng, name, color } = location;

        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: "custom-text-marker",
            html: `
              <div style="
                color: ${color};
                font-size: 13px;
                font-weight: normal;
                font-family: Arial, Helvetica, sans-serif;
                white-space: nowrap;
                transform: translate(-50%, -50%);
              ">
                ${name}
              </div>`,
            iconSize: L.point(0, 0),
            iconAnchor: [0, 0],
          }),
        });

        marker.addTo(map);
      }
    });
  });

  const handleClick = (event) => {
    const { clientX, clientY } = event;


    setPopup({
      visible: true,
      x: clientX,
      y: clientY,
    });
    setPopupPosition(position);
  };
  // Close the popup
  const closePopup = () => {
    setPopup((prev) => ({ ...prev, visible: false }));
    setTempMarker(null);
  };

  // Handle changes in the input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      color: selectedColor,
      lat: coord.lat,
      lng: coord.lng,
      zoom: currentZoom,
    }));
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setFormData((prev) => ({ ...prev, color }));
  };

  // Handle saving the location
  const handleSave = async () => {
    const dataToSave = { ...formData, zoom: currentZoom };
    console.log("Saving data:", dataToSave);

    try {
      const response = await fetch("http://localhost:4000/Location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      const data = await response.json();

      if (data.message === "Location saved successfully!") {
        
        setLocationData((prev) => [...prev, dataToSave]);

        if (currentZoom >= dataToSave.zoom-2) {
          const marker = L.marker([dataToSave.lat, dataToSave.lng], {
            icon: L.divIcon({
              className: "custom-text-marker",
              html: `
                <div style="
                  color: ${dataToSave.color};
                  font-size: 13px;
                  font-weight: medium;
                  font-family: "Lucida Console", "Courier New", monospace;
                  transform: translate(-50%, -50%);
                ">
                  ${dataToSave.name}
                </div>`,
              iconSize: L.point(0, 0),
              iconAnchor: [0, 0],
            }),
          });

          marker.addTo(map);
        } else {
          console.log(`Marker not displayed because current zoom (${currentZoom}) is less than saved zoom (${dataToSave.zoom})`);
        }
      } else {
        alert("Error saving location!");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    closePopup();
  };

  // Close the popup on wheel or double-click
  useEffect(() => {
    const handleWheel = () => setPopup((prev) => ({ ...prev, visible: false }));
    const handleDblClick = () =>
      setPopup((prev) => ({ ...prev, visible: false }));

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("dblclick", handleDblClick);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("dblclick", handleDblClick);
    };
  }, []);

  // Adjust popup position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (popup.visible) {
        const windowWidth = window.innerWidth;
        const position = popup.x > windowWidth / 2 ? "left" : "right";
        setPopupPosition(position);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [popup]);

  return (
    <div
    onClick={handleClick}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      {tempMarker && (
        <div
          style={{
            position: "absolute",
            top: `${popup.y}px`,
            left: `${popup.x}px`,
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "red",
            transform: "translate(-50%, -50%)",
            zIndex: 1001,
          }}
        />
      )}
      {popup.visible && (
        <div
          style={{
            position: "absolute",
            top: `${popup.y}px`,
            left: popupPosition === "right" ? `${popup.x + 20}px` : "auto",
            right:
              popupPosition === "left"
                ? `${window.innerWidth - popup.x + 20}px`
                : "auto",
            backgroundColor: "white",
            border: "1px solid gray",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "12px",
            width: "240px",
            transform: "translateY(-50%)",
            zIndex: 1000,
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div>
              <label
                htmlFor="name"
                style={{ display: "block", marginBottom: "4px" }}
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                onClick={(e) => e.stopPropagation()} 
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleColorSelect(color.hex)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border:
                      selectedColor === color.hex
                        ? "2px solid #CCCCCC"
                        : "none",
                    backgroundColor: color.hex,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={`Select ${color.name}`}
                >
                  {selectedColor === color.hex && (
                    <Check
                      style={{
                        color: "white",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={closePopup}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "black",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapClickHandle;
