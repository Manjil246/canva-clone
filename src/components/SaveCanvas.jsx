// import React, { useState } from "react";
// import { Canvas } from "fabric";

// function SaveCanvas({ canvas }) {
//   // Function to handle downloading the canvas state as a JSON file
//   const handleSaveCanvas = () => {
//     if (!canvas) return;

//     const canvasState = JSON.stringify(canvas.toJSON());
//     const blob = new Blob([canvasState], { type: "application/json" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "canvas-state.json";
//     link.click();
//   };

//   // Function to handle loading the canvas from a JSON file
//   const handleLoadCanvas = (event) => {
//     if (!canvas) return;

//     const file = event.target.files[0]; // Get the selected file
//     if (file) {
//       const reader = new FileReader();

//       reader.onload = () => {
//         try {
//           const canvasState = JSON.parse(reader.result);
//           // Load the canvas state from the imported JSON file
//           canvas.loadFromJSON(canvasState, () => {
//             canvas.requestRenderAll();
//           });
//           alert("Canvas loaded successfully!");
//         } catch (error) {
//           alert(
//             "Error loading the canvas. Please ensure the file is a valid JSON."
//           );
//         }
//       };
//       reader.readAsText(file);
//     }
//   };

//   return (
//     <div>
//       {/* Button to save the canvas */}
//       <button onClick={handleSaveCanvas} className="btn-save">
//         Save Canvas
//       </button>

//       {/* File input to import a canvas from a JSON file */}
//       <div>
//         <label htmlFor="import-file" className="btn-load">
//           Import Canvas
//         </label>
//         <input
//           type="file"
//           id="import-file"
//           accept=".json"
//           onChange={handleLoadCanvas}
//           style={{ display: "none" }} // Hide the file input element
//         />
//       </div>
//     </div>
//   );
// }

// export default SaveCanvas;

// import React from "react";
// import jsPDF from "jspdf";
// import PptxGenJS from "pptxgenjs";

// const SaveCanvas = ({ pages, canvasesRef }) => {
//   const handleExportJSON = () => {
//     const pageData = pages.map((page) => {
//       const canvas = canvasesRef.current[page.id];
//       return canvas?.toJSON(); // Export canvas as JSON
//     });

//     const jsonBlob = new Blob([JSON.stringify(pageData)], {
//       type: "application/json",
//     });
//     const jsonUrl = URL.createObjectURL(jsonBlob);
//     const link = document.createElement("a");
//     link.href = jsonUrl;
//     link.download = "template.json";
//     link.click();
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF();

//     pages.forEach((page, index) => {
//       const canvas = canvasesRef.current[page.id];
//       if (canvas) {
//         // Get base64 image from canvas
//         const imgData = canvas.toDataURL("image/png");
//         if (index > 0) doc.addPage(); // Add page after the first
//         doc.addImage(imgData, "PNG", 10, 10, 180, 160); // Adjust dimensions if needed
//       }
//     });

//     doc.save("template.pdf");
//   };

//   const handleExportPPT = () => {
//     const pptx = new PptxGenJS();

//     pages.forEach((page) => {
//       const canvas = canvasesRef.current[page.id];
//       if (canvas) {
//         const imgData = canvas.toDataURL("image/png");

//         const slide = pptx.addSlide();
//         slide.addImage({ data: imgData, x: 0.5, y: 0.5, w: 8, h: 6 }); // Adjust positioning
//       }
//     });

//     pptx.writeFile({ fileName: "template.pptx" });
//   };

//   return (
//     <div>
//       <button
//         onClick={handleExportJSON}
//         className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
//       >
//         Export as JSON
//       </button>
//       <button
//         onClick={handleExportPDF}
//         className="bg-green-500 text-white px-4 py-2 rounded mx-2"
//       >
//         Export as PDF
//       </button>
//       <button
//         onClick={handleExportPPT}
//         className="bg-purple-500 text-white px-4 py-2 rounded mx-2"
//       >
//         Export as PPT
//       </button>
//     </div>
//   );
// };

// export default SaveCanvas;

import React from "react";
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";
import "svg2pdf.js";

const SaveCanvas = ({ pages, canvasesRef, onImportJSON }) => {
  // Helper function to create a lightweight JSON structure
  const generateExportJSON = () => {
    return {
      pages: pages.map((page) => {
        const canvas = canvasesRef.current[page.id];
        return {
          id: page.id,
          canvasData: canvas?.toJSON([
            "left",
            "top",
            "width",
            "height",
            "fill",
            "stroke",
            "type",
            "text",
            "fontSize",
            "fontFamily",
            "angle",
          ]),
          width: canvas?.width || 500,
          height: canvas?.height || 500,
        };
      }),
    };
  };

  const handleExportJSON = () => {
    const jsonData = generateExportJSON();

    const jsonBlob = new Blob([JSON.stringify(jsonData)], {
      type: "application/json",
    });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const link = document.createElement("a");
    link.href = jsonUrl;
    link.download = "template.json";
    link.click();
  };

  const handleExportPDF = () => {
    if (pages.length === 0) {
      alert("Please create at least one canvas.");
      return;
    }

    const firstCanvas = canvasesRef.current[pages[0].id]; // Get the first canvas to check dimensions
    if (!firstCanvas) {
      alert("Please create a canvas first.");
      return;
    }

    // Get the dimensions of the first canvas
    const canvasWidth = firstCanvas.width; // Canvas width in pixels
    const canvasHeight = firstCanvas.height; // Canvas height in pixels

    // Create a new jsPDF instance with the dimensions of the canvas
    const doc = new jsPDF({
      orientation: canvasWidth > canvasHeight ? "landscape" : "portrait",
      unit: "px", // Use pixel units to match the canvas size
      format: [canvasWidth, canvasHeight], // Set PDF size to match canvas
    });

    // Process each page and add it to the PDF
    const processPage = (index) => {
      if (index >= pages.length) {
        // Once all pages are processed, save the PDF
        doc.save("template.pdf");
        return;
      }

      const page = pages[index];
      const fabricCanvas = canvasesRef.current[page.id];

      if (fabricCanvas) {
        // Generate the SVG string for the current canvas
        const svgString = fabricCanvas.toSVG();

        // Parse the SVG string into a DOM element
        const parser = new DOMParser();
        const svgElement = parser.parseFromString(
          svgString,
          "image/svg+xml"
        ).documentElement;

        // Convert SVG to PDF
        doc
          .svg(svgElement, {
            x: 0,
            y: 0,
            width: canvasWidth, // Match the canvas width
            height: canvasHeight, // Match the canvas height
          })
          .then(() => {
            // Add a new page for the next canvas (except the last page)
            if (index < pages.length - 1) {
              doc.addPage();
            }
            // Process the next page
            processPage(index + 1);
          })
          .catch((error) => {
            console.error(`Error converting page ${index + 1} to PDF:`, error);
          });
      } else {
        console.error(`Canvas for page ${index + 1} not found.`);
        processPage(index + 1); // Continue to the next page
      }
    };

    // Start processing pages from the first one
    processPage(0);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result); // Parse JSON from file content
          onImportJSON(importedData); // Pass parsed JSON data to App
        } catch (error) {
          console.error("Invalid JSON file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col space-y-2 items-center mt-2 text-xs">
      {/* <div>
        <label
          htmlFor="import-file"
          className="bg-purple-500 text-white px-2 py-1 rounded mx-2 cursor-pointer"
        >
          Import Canvas as JSON
        </label>
        <input
          type="file"
          id="import-file"
          accept=".json"
          className="hidden"
          onChange={handleImportJSON}
        />
      </div>
      <button
        onClick={handleExportJSON}
        className="bg-red-500 text-white px-4 py-2 rounded mx-2 w-fit"
      >
        Export as JSON
      </button> */}
      <button
        onClick={handleExportPDF}
        className="bg-green-500 text-white px-4 py-2 rounded mx-2 w-fit"
      >
        Export as PDF
      </button>
      {/*<button
        onClick={handleExportPPT}
        className="bg-purple-500 text-white px-4 py-2 rounded mx-2"
      >
        Export as PPT
      </button>*/}
    </div>
  );
};

export default SaveCanvas;
