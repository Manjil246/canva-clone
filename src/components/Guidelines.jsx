import React, { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";

const Guidelines = ({ canvas, gridSize = 20, snapThreshold = 5, changed }) => {
  const [areGuidelinesEnabled, setAreGuidelinesEnabled] = useState(false);
  const [verticalLines, setVerticalLines] = useState([]);
  const [horizontalLines, setHorizontalLines] = useState([]);

  // Check if gridlines already exist on the canvas
  const areGridLinesPresent = () => {
    return canvas.getObjects().some((obj) => obj.customType === "guideline");
  };

  useEffect(() => {
    if (changed) {
      createGuidelines(false);
    }
  }, [changed]);

  // Function to create grid lines (vertical and horizontal)
  const createGuidelines = (check = true) => {
    // Prevent duplicate gridline creation
    if (check) {
      if (areGridLinesPresent()) return;
    }

    // Remove existing grid lines before adding new ones
    canvas.getObjects().forEach((obj) => {
      if (obj.customType === "guideline") {
        canvas.remove(obj);
      }
    });

    const width = canvas.getWidth();
    const height = canvas.getHeight();
    // console.log(width, height);

    const newVerticalLines = [];
    const newHorizontalLines = [];

    // Create vertical lines
    for (let i = 0; i < width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: "gray", // Gray color for grid lines
        strokeDashArray: [1, 1],
        selectable: false,
        excludeFromExport: true,
        evented: false,
        opacity: areGuidelinesEnabled ? 1 : 0, // Initially hidden
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
        evented: false,
        opacity: areGuidelinesEnabled ? 1 : 0, // Initially hidden
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
    if (!areGuidelinesEnabled) return;

    const objectLeft = object.left;
    const objectTop = object.top;

    let snapped = false;

    // Snap to the closest vertical line
    verticalLines.forEach((line) => {
      const lineX = line.get("x1");
      const diff = Math.abs(objectLeft - lineX);
      if (diff <= snapThreshold) {
        object.set("left", lineX);
        snapped = true;
      }
    });

    // Snap to the closest horizontal line
    horizontalLines.forEach((line) => {
      const lineY = line.get("y1");
      const diff = Math.abs(objectTop - lineY);
      if (diff <= snapThreshold) {
        object.set("top", lineY);
        snapped = true;
      }
    });

    if (snapped) {
      canvas.renderAll();
    }
  };

  // Add event listener to handle snapping when object is moved
  useEffect(() => {
    if (canvas) {
      canvas.on("object:moving", (e) => {
        const object = e.target;
        snapToGuidelines(object);
      });
    }

    return () => {
      if (canvas) {
        canvas.off("object:moving");
      }
    };
  }, [canvas, verticalLines, horizontalLines, areGuidelinesEnabled]);

  // Create grid lines once when the canvas is available or changes
  useEffect(() => {
    if (canvas) {
      canvas.on("after:render", () => {
        // if (!areGridLinesPresent()) {
        createGuidelines();
        // }
      });
      createGuidelines();
      const anyGuidelineVisible = [...verticalLines, ...horizontalLines].some(
        (line) => line.opacity === 1
      );
      setAreGuidelinesEnabled(anyGuidelineVisible);
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

// import React, { useState, useEffect, useRef } from "react";
// import * as fabric from "fabric";

// const Guidelines = ({ canvas, gridSize = 20, snapThreshold = 5 }) => {
//   const [areGuidelinesEnabled, setAreGuidelinesEnabled] = useState(false);
//   const [verticalLines, setVerticalLines] = useState([]);
//   const [horizontalLines, setHorizontalLines] = useState([]);
//   const observerRef = useRef(null); // Reference for the ResizeObserver

//   // Function to create grid lines (vertical and horizontal)
//   const createGuidelines = () => {
//     if (!canvas) return;

//     // Remove existing guidelines
//     canvas.getObjects().forEach((obj) => {
//       if (obj.customType === "guideline") {
//         canvas.remove(obj);
//       }
//     });

//     const width = canvas.getWidth();
//     const height = canvas.getHeight();

//     const newVerticalLines = [];
//     const newHorizontalLines = [];

//     // Create vertical lines
//     for (let i = 0; i < width; i += gridSize) {
//       const line = new fabric.Line([i, 0, i, height], {
//         stroke: "gray",
//         strokeDashArray: [1, 1],
//         selectable: false,
//         excludeFromExport: true,
//         evented: false,
//         opacity: areGuidelinesEnabled ? 1 : 0,
//       });
//       line.customType = "guideline";
//       newVerticalLines.push(line);
//       canvas.add(line);
//     }

//     // Create horizontal lines
//     for (let j = 0; j < height; j += gridSize) {
//       const line = new fabric.Line([0, j, width, j], {
//         stroke: "gray",
//         strokeDashArray: [1, 1],
//         selectable: false,
//         excludeFromExport: true,
//         evented: false,
//         opacity: areGuidelinesEnabled ? 1 : 0,
//       });
//       line.customType = "guideline";
//       newHorizontalLines.push(line);
//       canvas.add(line);
//     }

//     setVerticalLines(newVerticalLines);
//     setHorizontalLines(newHorizontalLines);

//     canvas.renderAll(); // Re-render the canvas after adding guidelines
//   };

//   // Toggle guidelines visibility
//   const enableGuidelines = () => {
//     if (!canvas) return;

//     const newVisibility = !areGuidelinesEnabled;
//     setAreGuidelinesEnabled(newVisibility);

//     verticalLines.forEach((line) => line.set("opacity", newVisibility ? 1 : 0));
//     horizontalLines.forEach((line) =>
//       line.set("opacity", newVisibility ? 1 : 0)
//     );

//     canvas.renderAll();
//   };

//   // Observe parent resize and adjust canvas
//   useEffect(() => {
//     if (!canvas) return;

//     const parentElement = canvas.getElement().parentNode;

//     // ResizeObserver callback
//     const resizeObserver = new ResizeObserver(() => {
//       const parentWidth = parentElement.offsetWidth;
//       const parentHeight = parentElement.offsetHeight;

//       // Update canvas dimensions
//       canvas.setDimensions({
//         width: parentWidth,
//         height: parentHeight,
//       });

//       // Recreate guidelines after resizing
//       createGuidelines();
//     });

//     // Observe the parent element for resizing
//     resizeObserver.observe(parentElement);

//     // Cleanup observer on unmount
//     return () => {
//       resizeObserver.disconnect();
//     };
//   }, [canvas, areGuidelinesEnabled]);

//   // Create guidelines initially when canvas is available

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
