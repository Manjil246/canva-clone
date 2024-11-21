import React, { useState, useEffect } from "react";

const Border = ({ canvas }) => {
  const [borderColor, setBorderColor] = useState("#000000"); // Default border color
  const [borderWidth, setBorderWidth] = useState(1); // Default border width
  const [isObjectSelected, setIsObjectSelected] = useState(false); // Track object selection

  // Function to update the border color and width of the selected object
  const updateBorderProperties = (color, width) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set({
        stroke: color, // Set border color
        strokeWidth: width, // Set border width
      });
      canvas.renderAll(); // Re-render the canvas to apply the changes
    }
  };

  // Effect to handle canvas events and track object selection
  useEffect(() => {
    if (canvas) {
      const onObjectSelected = () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          setBorderColor(activeObject.stroke || "#000000");
          setBorderWidth(activeObject.strokeWidth || 1);
          setIsObjectSelected(true); // Show the component
        }
      };

      const onSelectionCleared = () => {
        setIsObjectSelected(false); // Hide the component
      };

      canvas.on("selection:created", onObjectSelected);
      canvas.on("selection:updated", onObjectSelected);
      canvas.on("selection:cleared", onSelectionCleared);

      // Cleanup event listeners
      return () => {
        canvas.off("selection:created", onObjectSelected);
        canvas.off("selection:updated", onObjectSelected);
        canvas.off("selection:cleared", onSelectionCleared);
      };
    }
  }, [canvas]);

  // Handlers for color and width input changes
  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setBorderColor(newColor);
    updateBorderProperties(newColor, borderWidth); // Update border properties instantly
  };

  const handleWidthChange = (e) => {
    const newWidth = Number(e.target.value);
    setBorderWidth(newWidth);
    updateBorderProperties(borderColor, newWidth); // Update border properties instantly
  };

  // Reset function to set border to default values
  const resetBorder = () => {
    setBorderColor("#000000");
    setBorderWidth(1);
    updateBorderProperties("#000000", 1); // Reset border properties to default
  };

  // Render the component only if an object is selected
  if (!isObjectSelected) return null;

  return (
    <div className="border-settings">
      <div className="mb-4">
        <label htmlFor="border-color" className="mr-2">
          Border Color:
        </label>
        <input
          type="color"
          id="border-color"
          value={borderColor}
          onChange={handleColorChange} // Handle color change immediately
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="border-width" className="mr-2">
          Border Width:
        </label>
        <input
          type="number"
          id="border-width"
          value={borderWidth}
          onChange={handleWidthChange} // Handle width change immediately
          min="1"
          className="border p-2"
        />
      </div>
      <button
        className="p-2 mt-2 bg-red-500 text-white rounded hover:bg-red-700"
        onClick={resetBorder} // Reset button to default values
      >
        Reset Border
      </button>
    </div>
  );
};

export default Border;
