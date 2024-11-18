import React, { useEffect, useState } from "react";
import * as fabric from "fabric";

const Guidelines = ({ canvas, gridSize = 20, snapDistance = 10 }) => {
  const [areGuidelinesEnabled, setAreGuidelinesEnabled] = useState(true);

  useEffect(() => {
    if (!canvas) return;

    const width = canvas.getWidth();
    const height = canvas.getHeight();

    // Create guidelines
    const verticalLines = [];
    const horizontalLines = [];

    for (let i = 0; i < width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: "red",
        strokeDashArray: [5, 5],
        selectable: false,
        excludeFromExport: true,
        opacity: 0, // Hidden initially
      });
      verticalLines.push(line);
      canvas.add(line);
    }

    for (let j = 0; j < height; j += gridSize) {
      const line = new fabric.Line([0, j, width, j], {
        stroke: "red",
        strokeDashArray: [5, 5],
        selectable: false,
        excludeFromExport: true,
        opacity: 0, // Hidden initially
      });
      horizontalLines.push(line);
      canvas.add(line);
    }

    // Show and snap to guidelines
    const showGuidelines = (target) => {
      const left = target.left;
      const top = target.top;
      const right = left + target.width * target.scaleX;
      const bottom = top + target.height * target.scaleY;

      verticalLines.forEach((line) => {
        if (
          Math.abs(line.left - left) <= snapDistance ||
          Math.abs(line.left - right) <= snapDistance
        ) {
          line.set("opacity", 1);
        } else {
          line.set("opacity", 0);
        }
      });

      horizontalLines.forEach((line) => {
        if (
          Math.abs(line.top - top) <= snapDistance ||
          Math.abs(line.top - bottom) <= snapDistance
        ) {
          line.set("opacity", 1);
        } else {
          line.set("opacity", 0);
        }
      });

      canvas.renderAll();
    };

    const snapToGrid = (target) => {
      const snapIfClose = (position) =>
        Math.abs(position % gridSize) <= snapDistance
          ? Math.round(position / gridSize) * gridSize
          : position;

      target.left = snapIfClose(target.left);
      target.top = snapIfClose(target.top);
    };

    const handleObjectMoving = (e) => {
      const target = e.target;
      showGuidelines(target);
      snapToGrid(target);
    };

    const handleObjectScaling = (e) => {
      const target = e.target;
      showGuidelines(target);
      snapToGrid(target);
    };

    const handleObjectRotating = (e) => {
      const target = e.target;
      showGuidelines(target);
    };

    const hideGuidelines = () => {
      verticalLines.forEach((line) => line.set("opacity", 0));
      horizontalLines.forEach((line) => line.set("opacity", 0));
      canvas.renderAll();
    };

    // Listen for selection changes
    const handleSelectionChanged = () => {
      const selectedObject = canvas.getActiveObject();
      if (!selectedObject) {
        hideGuidelines();
      }
    };

    // Enable or disable guidelines based on object selection and move events
    if (areGuidelinesEnabled) {
      canvas.on("object:moving", handleObjectMoving);
      canvas.on("object:scaling", handleObjectScaling);
      canvas.on("object:rotating", handleObjectRotating);
      canvas.on("object:selected", handleSelectionChanged);
      canvas.on("object:deselected", handleSelectionChanged);
      canvas.on("mouse:up", hideGuidelines);
    } else {
      canvas.off("object:moving", handleObjectMoving);
      canvas.off("object:scaling", handleObjectScaling);
      canvas.off("object:rotating", handleObjectRotating);
      canvas.off("object:selected", handleSelectionChanged);
      canvas.off("object:deselected", handleSelectionChanged);
      canvas.off("mouse:up", hideGuidelines);

      verticalLines.forEach((line) => canvas.remove(line));
      horizontalLines.forEach((line) => canvas.remove(line));
    }

    // Cleanup on unmount
    return () => {
      verticalLines.forEach((line) => canvas.remove(line));
      horizontalLines.forEach((line) => canvas.remove(line));
    };
  }, [canvas, areGuidelinesEnabled]);

  return null;
};

export default Guidelines;
