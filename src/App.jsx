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
  const idRef = useRef(1);

  const createCanvas = (id) => {
    const canvasElement = document.getElementById(`canvas-${id}`);

    if (canvasElement) {
      // Dispose of the existing canvas instance if it exists
      if (canvasesRef.current[id]) {
        canvasesRef.current[id].dispose();
      }

      // Create a new canvas instance and store it
      const newCanvas = new fabric.Canvas(canvasElement, {
        width: 800,
        height: 500,
        backgroundColor: "#ffffff",
      });

      const handleKeyDown = (e) => {
        if (e.key === "Delete") {
          const activeObjects = newCanvas.getActiveObjects();
          if (activeObjects && activeObjects.length > 0) {
            activeObjects.forEach((obj) => {
              // Prevent deletion if the object is a Text and is in editing mode
              if (obj.isEditing && obj.type === "textbox") {
                return;
              }
              newCanvas.remove(obj);
            });
            newCanvas.discardActiveObject(); // Clear the active selection
            newCanvas.renderAll();
          }
        }
      };

      // Attach the event listener
      document.addEventListener("keydown", handleKeyDown);

      // Cleanup event listener when the canvas is disposed
      newCanvas.dispose = (() => {
        const originalDispose = newCanvas.dispose.bind(newCanvas);
        return () => {
          document.removeEventListener("keydown", handleKeyDown);
          originalDispose();
        };
      })();

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

  const onImportJSON = (jsonData) => {
    try {
      const parsedData = jsonData; // No need to parse it again as it is already parsed

      if (!parsedData || !Array.isArray(parsedData.pages)) {
        alert("Invalid JSON format.");
        return;
      }

      // Remove existing canvases
      Object.values(canvasesRef.current).forEach((canvas) => canvas.dispose());
      canvasesRef.current = {};
      setPages([]);
      idRef.current = 0;

      // Create new canvases from imported data
      parsedData.pages.forEach((pageData, index) => {
        const newPageId = index + 1;
        idRef.current = newPageId;

        setPages((prevPages) => [...prevPages, { id: newPageId }]);

        // Create canvas with page data
        setTimeout(() => {
          createCanvas(newPageId);

          // Restore canvas objects after the canvas is created
          setTimeout(() => {
            const canvas = canvasesRef.current[newPageId];
            canvas.loadFromJSON(pageData.canvasData, () => {
              canvas.renderAll();
            });
            canvas.setWidth(pageData.width || 500);
            canvas.setHeight(pageData.height || 500);
          }, 0);
        }, 0);
      });

      setActivePage(1);
      setCurrentCanvas(canvasesRef.current[1]);
    } catch (error) {
      console.error("Failed to import JSON:", error);
    }
  };

  const handleAddPage = () => {
    idRef.current += 1;
    const newPageId = idRef.current;
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
      className="font-serif min-h-screen h-full flex flex-col"
      style={{ background: "linear-gradient(to bottom, #B2CCFF, #ffffff)" }}
    >
      <div className="flex flex-col">
        {/* Top Toolbar */}
        <div className="flex flex-wrap justify-between p-2 bg-white shadow-md">
          <Shadow canvas={currentCanvas} />
          <div className="flex flex-col">
            <Border canvas={currentCanvas} />
            <Settings canvas={currentCanvas} />
          </div>
          <Text canvas={currentCanvas} />
          <div className="flex flex-col">
            <Image canvas={currentCanvas} />
            <AspectRatio canvas={currentCanvas} />
          </div>
          <div className="flex flex-col">
            <Line canvas={currentCanvas} />
            <SaveCanvas
              pages={pages}
              canvasesRef={canvasesRef}
              onImportJSON={onImportJSON}
            />
            <Shapes canvas={currentCanvas} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-around w-full p-10">
          {/* Page Controls */}
          <div className="flex flex-col items-center space-y-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md transition"
              onClick={handleAddPage}
            >
              Add Page
            </button>
            <div className="flex flex-col space-y-4 overflow-x-auto">
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  className={`cursor-pointer flex items-center px-4 py-2 border rounded shadow-md ${
                    activePage === page.id
                      ? "bg-gray-200 font-bold border-gray-400"
                      : "bg-white hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  <span onClick={() => handleSwitchPage(page.id)}>
                    Page {index + 1}
                  </span>
                  <button
                    className="ml-2 text-red-500 font-bold hover:text-red-600 transition"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas Section */}
          <div className="canvas-container mt-8 w-full flex justify-center">
            {pages.map((page) => (
              <div
                key={page.id}
                className={`${activePage === page.id ? "block" : "hidden"} `}
              >
                <canvas id={`canvas-${page.id}`}></canvas>
                <Guidelines canvas={canvasesRef.current[page.id]} />
              </div>
            ))}
          </div>

          {/* Additional Tools */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Group canvas={currentCanvas} />
            <Layer canvas={currentCanvas} />
            <ImageCorrectionSaturation canvas={currentCanvas} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

// import React, { useState, useEffect, useRef } from "react";
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
// import * as fabric from "fabric";

// function App() {
//   const [currentCanvas, setCurrentCanvas] = useState(null);
//   const [pages, setPages] = useState([{ id: 1 }]);
//   const [activePage, setActivePage] = useState(1);
//   const [thumbnails, setThumbnails] = useState({});
//   const canvasesRef = useRef({});
//   const idRef = useRef(1);

//   const createCanvas = (id) => {
//     const canvasElement = document.getElementById(`canvas-${id}`);

//     if (canvasElement) {
//       // Dispose of the existing canvas instance if it exists
//       if (canvasesRef.current[id]) {
//         canvasesRef.current[id].dispose();
//       }

//       // Create a new canvas instance and store it
//       const newCanvas = new fabric.Canvas(canvasElement, {
//         width: 500,
//         height: 500,
//         backgroundColor: "#ffffff",
//       });

//       // Update thumbnail whenever canvas changes
//       newCanvas.on("object:modified", () => updateThumbnail(id));
//       newCanvas.on("object:added", () => updateThumbnail(id));
//       newCanvas.on("object:removed", () => updateThumbnail(id));

//       canvasesRef.current[id] = newCanvas;
//       setCurrentCanvas(newCanvas); // Set the new canvas as the current canvas
//     }
//   };

//   useEffect(() => {
//     createCanvas(1); // Initialize the first canvas
//     return () => {
//       Object.values(canvasesRef.current).forEach((canvasInstance) => {
//         canvasInstance.dispose();
//       });
//     };
//   }, []);

//   // Update the thumbnail of the canvas
//   const updateThumbnail = (id) => {
//     const canvas = canvasesRef.current[id];
//     if (canvas) {
//       const thumbnailData = canvas.toDataURL({
//         format: "png",
//         quality: 0.5,
//       });
//       setThumbnails((prev) => ({ ...prev, [id]: thumbnailData }));
//     }
//   };

//   const handleAddPage = () => {
//     idRef.current += 1;
//     const newPageId = idRef.current;
//     setPages([...pages, { id: newPageId }]);
//     setTimeout(() => createCanvas(newPageId), 0); // Wait for DOM to update
//     setActivePage(newPageId);
//   };

//   const handleSwitchPage = (id) => {
//     setActivePage(id);
//     setCurrentCanvas(canvasesRef.current[id]);
//   };

//   const handleDeletePage = (id) => {
//     if (pages.length === 1) {
//       alert("You must have at least one page.");
//       return;
//     }

//     const updatedPages = pages.filter((page) => page.id !== id);
//     setPages(updatedPages);

//     // Dispose of the deleted canvas
//     if (canvasesRef.current[id]) {
//       canvasesRef.current[id].dispose();
//       delete canvasesRef.current[id];
//     }

//     // Update activePage to the first remaining page
//     const remainingPage = updatedPages[0]?.id || 1;
//     setActivePage(remainingPage);
//     setCurrentCanvas(canvasesRef.current[remainingPage]);
//   };

//   return (
//     <div
//       className="font-serif text-center flex flex-col w-screen space-y-10 items-center px-24 py-4 bg-gray-500 min-h-screen h-full"
//       style={{ backgroundColor: "#B2CCFF" }}
//     >
//       <div className="flex justify-between w-full">
//         <div>
//           <Shapes canvas={currentCanvas} />
//           <Shadow canvas={currentCanvas} />
//           <Border canvas={currentCanvas} />
//         </div>
//         <div className="mt-20">
//           <div className="page-controls flex justify-center mb-4">
//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
//               onClick={handleAddPage}
//             >
//               Add Page
//             </button>
//           </div>
//           <div className="page-list flex justify-center space-x-4">
//             {pages.map((page, index) => (
//               <div
//                 key={page.id}
//                 className={`cursor-pointer flex flex-col items-center justify-center p-2 border ${
//                   activePage === page.id
//                     ? "bg-gray-300 font-bold border-blue-500"
//                     : "bg-white"
//                 }`}
//                 style={{ width: 100, height: 120 }}
//                 onClick={() => handleSwitchPage(page.id)}
//               >
//                 {thumbnails[page.id] ? (
//                   <img
//                     src={thumbnails[page.id]}
//                     alt={`Page ${index + 1}`}
//                     className="rounded-lg"
//                     style={{ width: "100%", height: "80px", objectFit: "cover" }}
//                   />
//                 ) : (
//                   <div
//                     className="bg-gray-200 rounded-lg"
//                     style={{ width: "100%", height: "80px" }}
//                   />
//                 )}
//                 <span className="text-sm mt-2">Page {index + 1}</span>
//               </div>
//             ))}
//           </div>

//           <div className="canvas-container mt-4">
//             {pages.map((page) => (
//               <div
//                 key={page.id}
//                 className={`${activePage === page.id ? "block" : "hidden"}`}
//               >
//                 <canvas id={`canvas-${page.id}`}></canvas>
//                 <Guidelines canvas={canvasesRef.current[page.id]} />
//               </div>
//             ))}
//           </div>
//         </div>
//         <div>
//           <Settings canvas={currentCanvas} />
//           <Image canvas={currentCanvas} />
//           <Text canvas={currentCanvas} />
//           <Line canvas={currentCanvas} />
//           <AspectRatio canvas={currentCanvas} />
//           <SaveCanvas
//             pages={pages}
//             canvasesRef={canvasesRef}
//             onImportJSON={onImportJSON}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// <div
//   className="font-serif  min-h-screen h-full"
//   style={{ backgroundColor: "#B2CCFF" }}
// >
//   <div className="flex justify-between w-full flex-col">
//     <div className="flex h-fit">
//       <Shapes canvas={currentCanvas} />
//       <Shadow canvas={currentCanvas} />
//       <Border canvas={currentCanvas} />
//       <Settings canvas={currentCanvas} />
//       <Image canvas={currentCanvas} />
//       <Text canvas={currentCanvas} />
//       <Line canvas={currentCanvas} />
//       <AspectRatio canvas={currentCanvas} />
//       <SaveCanvas
//         pages={pages}
//         canvasesRef={canvasesRef}
//         onImportJSON={onImportJSON}
//       />
//     </div>
//     <div className="mt-20">
//       <div>
//         <div className="page-controls flex justify-center mb-4">
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
//             onClick={handleAddPage}
//           >
//             Add Page
//           </button>
//         </div>
//         <div className="page-list flex justify-center space-x-4">
//           {pages.map((page, index) => (
//             <div
//               key={page.id}
//               className={`cursor-pointer flex items-center px-4 py-2 border ${
//                 activePage === page.id
//                   ? "bg-gray-300 font-bold"
//                   : "bg-white"
//               }`}
//             >
//               <span onClick={() => handleSwitchPage(page.id)}>
//                 Page {index + 1}
//               </span>
//               <button
//                 className="ml-2 text-red-500 font-bold"
//                 onClick={() => handleDeletePage(page.id)}
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>
//         <div className="canvas-container mt-4">
//           {pages.map((page) => (
//             <div
//               key={page.id}
//               className={`${activePage === page.id ? "block" : "hidden"}`}
//             >
//               <canvas id={`canvas-${page.id}`}></canvas>
//               <Guidelines canvas={canvasesRef.current[page.id]} />
//             </div>
//           ))}
//         </div>
//       </div>
//       <Group canvas={currentCanvas} />
//       <Layer canvas={currentCanvas} />
//       <ImageCorrectionSaturation canvas={currentCanvas} />
//     </div>
//     <div></div>
//   </div>
// </div>
