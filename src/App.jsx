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
import UndoRedo from "./components/UndoRedo";
import UploadImageS3 from "./components/UploadImageS3";
import { CopyAll } from "@mui/icons-material";
import CopyPaste from "./components/CopyPaste";
import BackgroundRemove from "./components/BackgroundRemove";

function App() {
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [pages, setPages] = useState([{ id: 1 }]);
  const [activePage, setActivePage] = useState(1);
  const canvasesRef = useRef({});
  const idRef = useRef(1);
  const [loaded, setLoaded] = useState(false);
  const [changed, setChanged] = useState(false);

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  useEffect(() => {
    if (changed) {
      setTimeout(() => {
        setChanged(false);
      }, 100);
    }
  }, []);

  const createCanvas = (id) => {
    const canvasElement = document.getElementById(`canvas-${id}`);

    if (canvasElement) {
      // Dispose of the existing canvas instance if it exists
      if (canvasesRef.current[id]) {
        canvasesRef.current[id].dispose();
      }

      // Create a new canvas instance and store it
      const newCanvas = new fabric.Canvas(canvasElement, {
        width: canvasesRef.current[pages[0]?.id]?.width || 800,
        height: canvasesRef.current[pages[0]?.id]?.height || 500,
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

      const updatePreview = debounce(() => {
        const dataUrl = newCanvas.toDataURL({
          format: "png",
          multiplier: 0.2, // Scale down for smaller thumbnails
        });
        setPages((prevPages) =>
          prevPages.map((page) =>
            page.id === id ? { ...page, preview: dataUrl } : page
          )
        );
      }, 500);

      // Attach the event listener
      document.addEventListener("keydown", handleKeyDown);

      // Attach event listeners for real-time updates
      newCanvas.on("object:modified", updatePreview);
      newCanvas.on("object:added", updatePreview);
      newCanvas.on("canvas:render", updatePreview);
      newCanvas.on("object:removed", updatePreview);

      // Generate the initial preview
      updatePreview();

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
              canvas.requestRenderAll();
              if (index === parsedData.pages.length - 1) {
                setLoaded(true); // Trigger loaded after the last canvas is done
              }
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

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        setLoaded(false);
      }, 500);
    }
  }, [loaded]);

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

  return (
    <div
      className="font-serif min-h-screen h-full flex flex-col"
      style={{ background: "linear-gradient(to bottom, #B2CCFF, #ffffff)" }}
    >
      <div className="flex flex-col">
        {/* Top Toolbar */}
        <div className="flex flex-wrap justify-between p-2 bg-white shadow-md">
          {/* <CopyPaste canvas={currentCanvas} /> */}
          <Shadow canvas={currentCanvas} />
          <div className="flex flex-col">
            <Border canvas={currentCanvas} />
            <Settings canvas={currentCanvas} />
          </div>
          <Text canvas={currentCanvas} />
          <div className="flex flex-col">
            <Image canvas={currentCanvas} />
            <AspectRatio
              canvasesRef={canvasesRef}
              pages={pages}
              setChanged={setChanged}
            />
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
        <div className="flex w-full px-10 ">
          {/* Page Controls */}
          <div className="flex flex-col items-center space-y-4 mt-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md transition"
              onClick={handleAddPage}
            >
              Add Page
            </button>
            <div className="flex flex-col space-y-4 overflow-auto max-h-[50vh] scroller">
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  className={`relative border rounded-md cursor-pointer ${
                    activePage === page.id
                      ? "border-blue-500"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                  onClick={() => handleSwitchPage(page.id)}
                >
                  {/* Thumbnail Preview */}
                  <img
                    src={page.preview}
                    alt={`Page ${index + 1}`}
                    className="w-52 h-20 object-contain bg-white rounded-t-md"
                  />
                  <div className="flex items-center justify-between px-2 py-1 bg-gray-100 rounded-b-md">
                    <span>Page {index + 1}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* <BackgroundRemove canvas={currentCanvas} /> */}
          </div>

          {/* Canvas Section */}
          <div className="canvas-container mt-8 w-full flex justify-center">
            {pages.map((page) => (
              <div
                key={page.id}
                className={`${activePage === page.id ? "block" : "hidden"} `}
              >
                <UndoRedo
                  canvas={canvasesRef.current[page.id]}
                  loaded={loaded}
                />
                <canvas
                  id={`canvas-${page.id}`}
                  className="border border-black"
                ></canvas>
                <Guidelines
                  canvas={canvasesRef.current[page.id]}
                  changed={changed}
                />
              </div>
            ))}
          </div>

          {/* Additional Tools */}
          <div className="flex flex-col justify-start gap-4 mt-8">
            <UploadImageS3 canvas={currentCanvas} />
            <Layer canvas={currentCanvas} />
            <ImageCorrectionSaturation canvas={currentCanvas} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
