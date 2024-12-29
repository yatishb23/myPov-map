import React, { useState, useEffect } from "react";
import { useMapEvent } from "react-leaflet";
import { Check } from 'lucide-react';

function MapClickHandle() {
  const [popup, setPopup] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [coord, setCoord] = useState({ lat: 0, lng: 0 });
  const [selectedColor, setSelectedColor] = useState("#FF0000");
  const [tempMarker, setTempMarker] = useState(null);
  const [popupPosition, setPopupPosition] = useState("right");

  const colors = [
    { hex: "#000000", name: "Black" },
    { hex: "#CCCCCC", name: "Gray" },
    { hex: "#ff5100", name: "Yellow" },
    { hex: "#FF7F00", name: "Orange" },
    { hex: "#FFFF00", name: "Yellow" },
    { hex: "#00FF00", name: "Green" },
    { hex: "#0FF0FF", name: "Light Blue" },
    { hex: "#0000FF", name: "Blue" },
    { hex: "#FF0000", name: "Red" },
    { hex: "#00bbff", name: "Sky Blue" },
  ];
  const [formData, setFormData] = useState({
    name: "",
    color: "#000000",
    font: "Arial",
    lat: 0,
    lng: 0,
  });

  useMapEvent("click", (e) => {
    if (e.originalEvent.detail > 1) return;
    setCoord(e.latlng);
    setTempMarker(e.latlng);
  });

  useMapEvent("zoomend", () => {
    setPopup((prev) => ({ ...prev, visible: false }));
    setTempMarker(null);
  });

  useEffect(() => {
    const handleWheel = () => {
      setPopup((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const handleDblClick = () => {
      setPopup((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener("dblclick", handleDblClick);

    return () => {
      window.removeEventListener("dblclick", handleDblClick);
    };
  }, []);

  const handleClick = (event) => {
    const { clientX, clientY } = event;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let position = "right";
    if (clientX + 240 > windowWidth) {
      position = "left";
    }

    let popupX = clientX;
    let popupY = clientY;

    if (position === "left" && popupX - 240 < 0) {
      popupX = 20; 
    }

    if (popupY + 240 > windowHeight) {
      popupY = windowHeight - 240 - 20; 
    }

    setPopup({
      visible: true,
      x: popupX,
      y: popupY,
    });
    setPopupPosition(position);
  };

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, visible: false }));
    setTempMarker(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value, color: selectedColor, lat: coord.lat, lng: coord.lng }));
  };

  const handleSave = () => {
    console.log("Saving data:", formData);
    closePopup();
  };

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
            right: popupPosition === "left" ? `${window.innerWidth - popup.x + 20}px` : "auto",
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
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label htmlFor="name" style={{ display: "block", marginBottom: "4px" }}>Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
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
                  onClick={() => setSelectedColor(color.hex)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: selectedColor === color.hex ? "2px solid #CCCCCC" : "none",
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
            <div>
              <label htmlFor="font" style={{ display: "block", marginBottom: "4px" }}>Font</label>
              <select
                id="font"
                name="font"
                value={formData.font}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier">Courier</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
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
