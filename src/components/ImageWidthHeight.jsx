import { useState, useEffect } from "react";

const ImageWidthHeight = ({ canvas }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const updateDimensions = (activeObject) => {
    if (activeObject) {
      setWidth(activeObject.width);
      setHeight(activeObject.height);
    }
  };

  const handleWidthChange = (e) => {
    setWidth(Number(e.target.value));
  };

  const handleHeightChange = (e) => {
    setHeight(Number(e.target.value));
  };

  const handleAspectRatioChange = () => {
    const activeObject = canvas.getActiveObject();

    if (activeObject && activeObject.type === "image") {
      const originalWidth = activeObject.width;
      const originalHeight = activeObject.height;

      const scaleX = width / originalWidth;
      const scaleY = height / originalHeight;

      // Use the smaller scale factor to maintain aspect ratio
      const scale = Math.min(scaleX, scaleY);

      // Apply scaling and set new dimensions
      activeObject.set({
        scaleX: scale, // Set uniform scaling to fit within the dimensions
        scaleY: scale,
      });

      activeObject.setCoords(); // Update object's bounding box
      canvas.requestRenderAll(); // Re-render the canvas
    } else {
      alert("No image selected!");
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const updateSelectedObject = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        updateDimensions(activeObject);
      }
    };

    const handleSelectionCreated = (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject) {
        updateDimensions(activeObject);
      }
    };

    const handleSelectionUpdated = (e) => {
      const activeObject = e.selected?.[0];
      if (activeObject) {
        updateDimensions(activeObject);
      }
    };

    // Attach event listeners
    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionUpdated);

    // Set initial dimensions for any pre-selected object
    updateSelectedObject();

    // Cleanup listeners on component unmount
    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionUpdated);
    };
  }, [canvas]); // Dependency array ensures this runs when `canvas` changes

  return (
    <div className="aspect-ratio-control">
      <h3 className="font-bold mb-2">Change Aspect Ratio</h3>
      <div className="flex gap-2 mb-4">
        <div>
          <label htmlFor="width" className="block text-sm font-medium">
            Width
          </label>
          <input
            type="number"
            id="width"
            step={1}
            value={width}
            onChange={handleWidthChange}
            className="border px-2 py-1 rounded w-20"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium">
            Height
          </label>
          <input
            type="number"
            id="height"
            step={1}
            value={height}
            onChange={handleHeightChange}
            className="border px-2 py-1 rounded w-20"
          />
        </div>
      </div>
      <button
        onClick={handleAspectRatioChange}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update
      </button>
    </div>
  );
};

export default ImageWidthHeight;
