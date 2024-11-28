import { useState } from "react";
import * as fabric from "fabric";

const Line = ({ canvas }) => {
  const [isLineModeActive, setIsLineModeActive] = useState(false);

  const toggleLineMode = () => {
    if (!canvas) return;

    if (isLineModeActive) {
      // Turn off line drawing mode
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
      setIsLineModeActive(false);
      return;
    }

    // Activate line drawing mode
    let line = null;

    const startDrawing = (event) => {
      const pointer = canvas.getPointer(event.e);
      line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: "black",
        strokeWidth: 2,
        selectable: false, // Initially not selectable
        hasControls: true, // Add resize/rotate controls later
        hasBorders: true, // Add borders for visual feedback
      });
      canvas.add(line);
    };

    const whileDrawing = (event) => {
      if (!line) return;
      const pointer = canvas.getPointer(event.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      canvas.renderAll();
    };

    const stopDrawing = () => {
      if (line) {
        line.set({
          selectable: true, // Make the line selectable after it's drawn
          hasControls: true, // Allow resizing and rotation
        });
        canvas.setActiveObject(line); // Automatically select the line
      }
      line = null;
    };

    canvas.on("mouse:down", startDrawing);
    canvas.on("mouse:move", whileDrawing);
    canvas.on("mouse:up", stopDrawing);

    setIsLineModeActive(true);
  };

  return (
    <button
      className={`w-fit p-2 rounded ${
        isLineModeActive ? "bg-red-500" : "bg-blue-500"
      } text-white hover:bg-blue-700`}
      onClick={toggleLineMode}
    >
      {isLineModeActive ? "Stop" : "Draw Line"}
    </button>
  );
};

export default Line;
