import React, { useState } from "react";
import { Canvas } from "fabric";

function SaveCanvas({ canvas }) {
  // Function to handle downloading the canvas state as a JSON file
  const handleSaveCanvas = () => {
    if (!canvas) return;

    const canvasState = JSON.stringify(canvas.toJSON());
    const blob = new Blob([canvasState], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "canvas-state.json";
    link.click();
  };

  // Function to handle loading the canvas from a JSON file
  const handleLoadCanvas = (event) => {
    if (!canvas) return;

    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const canvasState = JSON.parse(reader.result);
          // Load the canvas state from the imported JSON file
          canvas.loadFromJSON(canvasState, () => {
            canvas.requestRenderAll();
          });
          alert("Canvas loaded successfully!");
        } catch (error) {
          alert(
            "Error loading the canvas. Please ensure the file is a valid JSON."
          );
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      {/* Button to save the canvas */}
      <button onClick={handleSaveCanvas} className="btn-save">
        Save Canvas
      </button>

      {/* File input to import a canvas from a JSON file */}
      <div>
        <label htmlFor="import-file" className="btn-load">
          Import Canvas
        </label>
        <input
          type="file"
          id="import-file"
          accept=".json"
          onChange={handleLoadCanvas}
          style={{ display: "none" }} // Hide the file input element
        />
      </div>
    </div>
  );
}

export default SaveCanvas;
