// import React, { useState } from "react";
// import * as fabric from "fabric";

// const Guidelines = ({ canvas, gridSize = 20, snapDistance = 10 }) => {
//   const [areGuidelinesEnabled, setAreGuidelinesEnabled] = useState(false);

//   const enableGuidelines = () => {
//     if (!canvas) return;

//     const width = canvas.getWidth();
//     const height = canvas.getHeight();

//     // Create guidelines
//     const verticalLines = [];
//     const horizontalLines = [];

//     for (let i = 0; i < width; i += gridSize) {
//       const line = new fabric.Line([i, 0, i, height], {
//         stroke: "red",
//         strokeDashArray: [5, 5],
//         selectable: false,
//         excludeFromExport: true,
//         opacity: 0, // Hidden initially
//       });
//       verticalLines.push(line);
//       canvas.add(line);
//     }

//     for (let j = 0; j < height; j += gridSize) {
//       const line = new fabric.Line([0, j, width, j], {
//         stroke: "red",
//         strokeDashArray: [5, 5],
//         selectable: false,
//         excludeFromExport: true,
//         opacity: 0, // Hidden initially
//       });
//       horizontalLines.push(line);
//       canvas.add(line);
//     }

//     // Show and snap to guidelines
//     const showGuidelines = (target) => {
//       const left = target.left;
//       const top = target.top;
//       const right = left + target.width * target.scaleX;
//       const bottom = top + target.height * target.scaleY;

//       verticalLines.forEach((line) => {
//         if (
//           Math.abs(line.left - left) <= snapDistance ||
//           Math.abs(line.left - right) <= snapDistance
//         ) {
//           line.set("opacity", 1);
//         } else {
//           line.set("opacity", 0);
//         }
//       });

//       horizontalLines.forEach((line) => {
//         if (
//           Math.abs(line.top - top) <= snapDistance ||
//           Math.abs(line.top - bottom) <= snapDistance
//         ) {
//           line.set("opacity", 1);
//         } else {
//           line.set("opacity", 0);
//         }
//       });

//       canvas.renderAll();
//     };

//     const snapToGrid = (target) => {
//       const snapIfClose = (position) =>
//         Math.abs(position % gridSize) <= snapDistance
//           ? Math.round(position / gridSize) * gridSize
//           : position;

//       target.left = snapIfClose(target.left);
//       target.top = snapIfClose(target.top);
//     };

//     const handleObjectMoving = (e) => {
//       const target = e.target;
//       showGuidelines(target);
//       snapToGrid(target);
//     };

//     const handleObjectScaling = (e) => {
//       const target = e.target;
//       showGuidelines(target);
//       snapToGrid(target);
//     };

//     const handleObjectRotating = (e) => {
//       const target = e.target;
//       showGuidelines(target);
//     };

//     const hideGuidelines = () => {
//       verticalLines.forEach((line) => line.set("opacity", 0));
//       horizontalLines.forEach((line) => line.set("opacity", 0));
//       canvas.renderAll();
//     };

//     if (!areGuidelinesEnabled) {
//       canvas.on("object:moving", handleObjectMoving);
//       canvas.on("object:scaling", handleObjectScaling);
//       canvas.on("object:rotating", handleObjectRotating);
//       canvas.on("mouse:up", hideGuidelines);

//       setAreGuidelinesEnabled(true);
//     } else {
//       canvas.off("object:moving", handleObjectMoving);
//       canvas.off("object:scaling", handleObjectScaling);
//       canvas.off("object:rotating", handleObjectRotating);
//       canvas.off("mouse:up", hideGuidelines);

//       verticalLines.forEach((line) => canvas.remove(line));
//       horizontalLines.forEach((line) => canvas.remove(line));
//       setAreGuidelinesEnabled(false);
//     }
//   };

//   return (
//     <button
//       className="p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-700"
//       onClick={enableGuidelines}
//     >
//       {areGuidelinesEnabled ? "Disable Guidelines" : "Enable Guidelines"}
//     </button>
//   );
// };

// export default Guidelines;

import React, { useState, useEffect } from "react";
import * as fabric from "fabric";

const Guidelines = ({ canvas, gridSize = 20, snapThreshold = 5 }) => {
  const [areGuidelinesEnabled, setAreGuidelinesEnabled] = useState(false);
  const [verticalLines, setVerticalLines] = useState([]);
  const [horizontalLines, setHorizontalLines] = useState([]);

  // Function to create grid lines (vertical and horizontal)
  const createGridLines = () => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    const newVerticalLines = [];
    const newHorizontalLines = [];

    // Create vertical lines
    for (let i = 0; i < width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: "gray", // Gray color for grid lines
        strokeDashArray: [1, 1],
        selectable: false,
        excludeFromExport: true,
        opacity: 0, // Initially hidden
      });
      line.customType = "guideline";
      newVerticalLines.push(line);
      canvas.add(line);
    }

    // Create horizontal lines
    for (let j = 0; j < height; j += gridSize) {
      const line = new fabric.Line([0, j, width, j], {
        stroke: "gray", // Gray color for grid lines
        strokeDashArray: [1, 1],
        selectable: false,
        excludeFromExport: true,
        opacity: 0, // Initially hidden
      });
      line.customType = "guideline";
      newHorizontalLines.push(line);
      canvas.add(line);
    }

    // Set state with the new lines
    setVerticalLines(newVerticalLines);
    setHorizontalLines(newHorizontalLines);
  };

  // Toggle guidelines visibility
  const enableGuidelines = () => {
    if (!canvas) return;

    if (!areGuidelinesEnabled) {
      // Show all grid lines when enabled
      verticalLines.forEach((line) => line.set("opacity", 1));
      horizontalLines.forEach((line) => line.set("opacity", 1));
      setAreGuidelinesEnabled(true);
    } else {
      // Hide all grid lines when disabled
      verticalLines.forEach((line) => line.set("opacity", 0));
      horizontalLines.forEach((line) => line.set("opacity", 0));
      setAreGuidelinesEnabled(false);
    }

    canvas.renderAll();
  };

  // Snapping logic: Snap object to the nearest grid line
  const snapToGuidelines = (object) => {
    // Only snap if guidelines are enabled
    if (!areGuidelinesEnabled) return;

    const objectLeft = object.left;
    const objectTop = object.top;

    let snapped = false;

    // Snap to the closest vertical line
    verticalLines.forEach((line) => {
      const lineX = line.get("x1");
      const diff = Math.abs(objectLeft - lineX);
      if (diff <= snapThreshold) {
        object.set("left", lineX); // Snap to the vertical line
        snapped = true; // Mark that a snap occurred
      }
    });

    // Snap to the closest horizontal line
    horizontalLines.forEach((line) => {
      const lineY = line.get("y1");
      const diff = Math.abs(objectTop - lineY);
      if (diff <= snapThreshold) {
        object.set("top", lineY); // Snap to the horizontal line
        snapped = true; // Mark that a snap occurred
      }
    });

    // Only trigger a re-render if snapping occurred
    if (snapped) {
      canvas.renderAll(); // Re-render the canvas after snapping
    }
  };

  // Add event listener to handle snapping when object is moved
  useEffect(() => {
    if (canvas) {
      canvas.on("object:moving", (e) => {
        const object = e.target;
        snapToGuidelines(object); // Apply snapping during object movement
      });
    }

    return () => {
      if (canvas) {
        canvas.off("object:moving"); // Clean up the event listener
      }
    };
  }, [canvas, verticalLines, horizontalLines, areGuidelinesEnabled]);

  // Create grid lines once when the canvas is available or changes
  useEffect(() => {
    if (canvas) {
      createGridLines(); // Create grid lines when the component mounts
    }
  }, [canvas]);

  return (
    <button
      className="p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-700"
      onClick={enableGuidelines}
    >
      {areGuidelinesEnabled ? "Disable Guidelines" : "Enable Guidelines"}
    </button>
  );
};

export default Guidelines;
