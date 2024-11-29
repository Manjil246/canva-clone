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

  // Add a vertical line in the center of the canvas
  const addVerticalLine = () => {
    if (!canvas) return;

    const center = canvas.getCenter();
    const lineHeight = canvas.height * 0.8; // 80% of canvas height
    const startY = center.top - lineHeight / 2; // Calculate starting Y position
    const endY = center.top + lineHeight / 2; // Calculate ending Y position

    const verticalLine = new fabric.Line(
      [center.left, startY, center.left, endY], // X remains constant at center.left
      {
        stroke: "black",
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        hasBorders: true,
      }
    );
    canvas.add(verticalLine);
    canvas.renderAll();
  };

  // Add a horizontal line in the center of the canvas
  const addHorizontalLine = () => {
    if (!canvas) return;

    const center = canvas.getCenter();
    const lineWidth = canvas.width * 0.8; // 80% of canvas width
    const startX = center.left - lineWidth / 2; // Calculate starting X position
    const endX = center.left + lineWidth / 2; // Calculate ending X position

    const horizontalLine = new fabric.Line(
      [startX, center.top, endX, center.top], // Y remains constant at center.top
      {
        stroke: "black",
        strokeWidth: 2,
        selectable: true,
        hasControls: true,
        hasBorders: true,
      }
    );
    canvas.add(horizontalLine);
    canvas.renderAll();
  };

  return (
    <>
      <div className="flex">
        <button
          className={`w-fit p-2 rounded ${
            isLineModeActive ? "bg-red-500" : "bg-blue-500"
          } text-white hover:bg-blue-700`}
          onClick={toggleLineMode}
        >
          {isLineModeActive ? "Stop" : "Draw Line"}
        </button>
        <button className="w-fit p-2" onClick={addVerticalLine}>
          <div className="w-[2px] h-10 bg-black "></div>
        </button>
        <button className="w-fit p-2" onClick={addHorizontalLine}>
          <div className="w-10 h-[2px] bg-black "></div>
        </button>
      </div>
    </>
  );
};

export default Line;
