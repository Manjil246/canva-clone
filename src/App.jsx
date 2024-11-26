// import { useRef, useState, useEffect } from "react";
// import "./App.css";
// import { Canvas } from "fabric";
// import Settings from "./components/Settings";
// import Image from "./components/Image";
// import Text from "./components/Text";
// import Shapes from "./components/Shapes";
// import Line from "./components/Line";
// import Guidelines from "./components/Guidelines";
// import AspectRatio from "./components/AspectRatio";
// // import Pages from "./components/Pages";
// import SaveCanvas from "./components/SaveCanvas";
// import Shadow from "./components/Shadow";
// import Border from "./components/Border";
// import Group from "./components/Group";
// import Layer from "./components/Layer";
// import ImageCorrectionSaturation from "./components/ImageCorrectionSaturation";
// import Pages from "./components/Pages";

// function App() {
//   const canvasRef = useRef(null);

//   const [canvas, setCanvas] = useState(null);

//   useEffect(() => {
//     if (canvasRef.current) {
//       const initCanvas = new Canvas(canvasRef.current, {
//         width: 500,
//         height: 500,
//       });

//       initCanvas.backgroundColor = "#ffffff";
//       initCanvas.renderAll();
//       setCanvas(initCanvas);

//       // Add keydown listener for delete functionality
//       const handleKeyDown = (e) => {
//         if (e.key === "Delete") {
//           const activeObjects = initCanvas.getActiveObjects();
//           if (activeObjects && activeObjects.length > 0) {
//             activeObjects.forEach((obj) => {
//               // Prevent deletion if the object is a Text and is in editing mode
//               if (obj.isEditing && obj.type === "textbox") {
//                 return;
//               }
//               initCanvas.remove(obj);
//             });
//             initCanvas.discardActiveObject(); // Clear the active selection
//             initCanvas.renderAll();
//           }
//         }
//       };

//       document.addEventListener("keydown", handleKeyDown);

//       // Cleanup event listener
//       return () => {
//         initCanvas.dispose();
//         document.removeEventListener("keydown", handleKeyDown);
//       };
//     }
//   }, []);

//   return (
//     <>
//       <div
//         className="font-serif text-center flex flex-col w-screen space-y-10  items-center px-24 py-4 bg-gray-500 min-h-screen h-full"
//         style={{ backgroundColor: "#B2CCFF" }}
//       >
//         <div className="flex justify-between w-full">
//           <div>
//             <Shapes canvas={canvas} />
//             <Shadow canvas={canvas} />
//             <Border canvas={canvas} />
//           </div>
//           <div className="mt-20">
//             <canvas id="canvas" ref={canvasRef}></canvas>
//             <Group canvas={canvas} />
//             <Layer canvas={canvas} />
//             <ImageCorrectionSaturation canvas={canvas} />
//            // <Pages canvas={canvas} />
//           </div>
//           <div>
//             <Settings canvas={canvas} />
//             <Image canvas={canvas} />
//             <Text canvas={canvas} />
//             <Line canvas={canvas} />
//             <Guidelines canvas={canvas} />
//             <AspectRatio canvas={canvas} />
//             <SaveCanvas canvas={canvas} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

// import { useState } from "react";
// import "./App.css";
// import Settings from "./components/Settings";
// import Image from "./components/Image";
// import Text from "./components/Text";
// import Shapes from "./components/Shapes";
// import Line from "./components/Line";
// import Guidelines from "./components/Guidelines";
// import AspectRatio from "./components/AspectRatio";
// import SaveCanvas from "./components/SaveCanvas";
// import Shadow from "./components/Shadow";
// import Border from "./components/Border";
// import Group from "./components/Group";
// import Layer from "./components/Layer";
// import ImageCorrectionSaturation from "./components/ImageCorrectionSaturation";
// import Pages from "./components/Pages";

// function App() {
//   const [currentCanvas, setCurrentCanvas] = useState(null);

//   return (
//     <>
//       <div
//         className="font-serif text-center flex flex-col w-screen space-y-10  items-center px-24 py-4 bg-gray-500 min-h-screen h-full"
//         style={{ backgroundColor: "#B2CCFF" }}
//       >
//         <div className="flex justify-between w-full">
//           <div>
//             <Shapes canvas={currentCanvas} />
//             <Shadow canvas={currentCanvas} />
//             <Border canvas={currentCanvas} />
//           </div>
//           <div className="mt-20">
//             {/* Pages Component handles multiple canvases */}
//             <Pages setCurrentCanvas={setCurrentCanvas} />
//             <Group canvas={currentCanvas} />
//             <Layer canvas={currentCanvas} />
//             <ImageCorrectionSaturation canvas={currentCanvas} />
//           </div>
//           <div>
//             <Settings canvas={currentCanvas} />
//             <Image canvas={currentCanvas} />
//             <Text canvas={currentCanvas} />
//             <Line canvas={currentCanvas} />
//             <Guidelines canvas={currentCanvas} />
//             <AspectRatio canvas={currentCanvas} />
//             <SaveCanvas canvas={currentCanvas} />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Settings from "./components/Settings";
import Image from "./components/Image";
import Text from "./components/Text";
import Shapes from "./components/Shapes";
import Line from "./components/Line";
import Guidelines from "./components/Guidelines";
import AspectRatio from "./components/AspectRatio";
import SaveCanvas from "./components/SaveCanvas";
import Shadow from "./components/Shadow";
import Border from "./components/Border";
import Group from "./components/Group";
import Layer from "./components/Layer";
import ImageCorrectionSaturation from "./components/ImageCorrectionSaturation";
import * as fabric from "fabric";

function App() {
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [pages, setPages] = useState([{ id: 1 }]);
  const [activePage, setActivePage] = useState(1);
  const canvasesRef = useRef({});

  const createCanvas = (id) => {
    const canvasElement = document.getElementById(`canvas-${id}`);

    if (canvasElement) {
      // Dispose of the existing canvas instance if it exists
      if (canvasesRef.current[id]) {
        canvasesRef.current[id].dispose();
      }

      // Create a new canvas instance and store it
      const newCanvas = new fabric.Canvas(canvasElement, {
        width: 500,
        height: 500,
        backgroundColor: "#ffffff",
      });

      canvasesRef.current[id] = newCanvas;
      setCurrentCanvas(newCanvas); // Set the new canvas as the current canvas
    }
  };

  useEffect(() => {
    createCanvas(1); // Initialize the first canvas
    return () => {
      Object.values(canvasesRef.current).forEach((canvasInstance) => {
        canvasInstance.dispose();
      });
    };
  }, []);

  const handleAddPage = () => {
    const newPageId = pages.length + 1;
    setPages([...pages, { id: newPageId }]);
    setTimeout(() => createCanvas(newPageId), 0); // Wait for DOM to update
    setActivePage(newPageId);
  };

  const handleSwitchPage = (id) => {
    if (currentCanvas) {
      currentCanvas.discardActiveObject(); // Discard the selected object
      currentCanvas.renderAll(); // Re-render the canvas to reflect the changes
    }
    setActivePage(id);
    setCurrentCanvas(canvasesRef.current[id]); // Update the current canvas
  };

  const handleDeletePage = (id) => {
    if (pages.length === 1) {
      alert("You must have at least one page.");
      return;
    }

    const updatedPages = pages.filter((page) => page.id !== id);
    setPages(updatedPages);

    // Dispose of the deleted canvas
    if (canvasesRef.current[id]) {
      canvasesRef.current[id].dispose();
      delete canvasesRef.current[id];
    }

    // Update activePage to the first remaining page
    const remainingPage = updatedPages[0]?.id || 1;
    setActivePage(remainingPage);
    setCurrentCanvas(canvasesRef.current[remainingPage]);
  };

  return (
    <div
      className="font-serif text-center flex flex-col w-screen space-y-10 items-center px-24 py-4 bg-gray-500 min-h-screen h-full"
      style={{ backgroundColor: "#B2CCFF" }}
    >
      <div className="flex justify-between w-full">
        <div>
          <Shapes canvas={currentCanvas} />
          <Shadow canvas={currentCanvas} />
          <Border canvas={currentCanvas} />
        </div>
        <div className="mt-20">
          <div>
            <div className="page-controls flex justify-center mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
                onClick={handleAddPage}
              >
                Add Page
              </button>
            </div>
            <div className="page-list flex justify-center space-x-4">
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  className={`cursor-pointer flex items-center px-4 py-2 border ${
                    activePage === page.id
                      ? "bg-gray-300 font-bold"
                      : "bg-white"
                  }`}
                >
                  <span onClick={() => handleSwitchPage(page.id)}>
                    Page {index + 1}
                  </span>
                  <button
                    className="ml-2 text-red-500 font-bold"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="canvas-container mt-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`${activePage === page.id ? "block" : "hidden"}`}
                >
                  <canvas id={`canvas-${page.id}`}></canvas>
                </div>
              ))}
            </div>
          </div>
          <Group canvas={currentCanvas} />
          <Layer canvas={currentCanvas} />
          <ImageCorrectionSaturation canvas={currentCanvas} />
        </div>
        <div>
          <Settings canvas={currentCanvas} />
          <Image canvas={currentCanvas} />
          <Text canvas={currentCanvas} />
          <Line canvas={currentCanvas} />
          <Guidelines canvas={currentCanvas} />
          <AspectRatio canvas={currentCanvas} />
          <SaveCanvas canvas={currentCanvas} />
        </div>
      </div>
    </div>
  );
}

export default App;
