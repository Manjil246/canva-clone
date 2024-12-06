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

function App() {
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [pages, setPages] = useState([{ id: 1 }]);
  const [activePage, setActivePage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1); // Added zoom state
  const canvasesRef = useRef({});
  const idRef = useRef(1);

  const zoomStep = 0.1; // Increment for zooming in/out
  const minZoom = 0.5; // Minimum zoom level
  const maxZoom = 3; // Maximum zoom level

  const [isPanning, setIsPanning] = useState(false);
  const [lastPosX, setLastPosX] = useState(0);
  const [lastPosY, setLastPosY] = useState(0);

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const handleMouseWheelZoom = (canvas) => {
    const maxZoom = 3; // Maximum zoom level
    const minZoom = 0.5; // Minimum zoom level
    const zoomStep = 0.1; // Step for zooming in/out

    canvas.on("mouse:wheel", (opt) => {
      const event = opt.e;
      const delta = event.deltaY; // Get the scroll direction
      let zoom = canvas.getZoom(); // Get the current zoom level

      // Update the zoom level based on scroll direction
      zoom = delta > 0 ? zoom - zoomStep : zoom + zoomStep;

      // Clamp the zoom level between minZoom and maxZoom
      zoom = Math.max(minZoom, Math.min(maxZoom, zoom));

      // Get the pointer position to zoom into
      const pointer = canvas.getPointer(event);

      // Zoom to the pointer position
      canvas.zoomToPoint({ x: pointer.x, y: pointer.y }, zoom);

      // Prevent default scrolling behavior
      event.preventDefault();
      event.stopPropagation();
    });
  };

  const enablePanning = (canvas) => {
    let isDragging = false;
    let lastPosX, lastPosY;

    canvas.on("mouse:down", (event) => {
      isDragging = true;
      const pointer = canvas.getPointer(event.e);
      lastPosX = pointer.x;
      lastPosY = pointer.y;
      canvas.setCursor("grab");
    });

    canvas.on("mouse:move", (event) => {
      if (!isDragging) return;

      const pointer = canvas.getPointer(event.e);
      const deltaX = pointer.x - lastPosX;
      const deltaY = pointer.y - lastPosY;

      canvas.relativePan({ x: deltaX, y: deltaY });

      lastPosX = pointer.x;
      lastPosY = pointer.y;
    });

    canvas.on("mouse:up", () => {
      isDragging = false;
      canvas.setCursor("default");
    });

    // Prevent interaction with objects during panning
    canvas.on("mouse:down", (event) => {
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      isDragging = false; // Disable panning if an object is active
    });
  };

  const createCanvas = (id) => {
    const canvasElement = document.getElementById(`canvas-${id}`);
    if (canvasElement) {
      if (canvasesRef.current[id]) {
        canvasesRef.current[id].dispose();
      }

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
              if (obj.isEditing && obj.type === "textbox") {
                return;
              }
              newCanvas.remove(obj);
            });
            newCanvas.discardActiveObject();
            newCanvas.renderAll();
          }
        }
      };

      const updatePreview = debounce(() => {
        const dataUrl = newCanvas.toDataURL({ format: "png", multiplier: 0.2 });
        setPages((prevPages) =>
          prevPages.map((page) =>
            page.id === id ? { ...page, preview: dataUrl } : page
          )
        );
      }, 500);

      document.addEventListener("keydown", handleKeyDown);

      newCanvas.on("object:modified", updatePreview);
      newCanvas.on("object:added", updatePreview);
      newCanvas.on("canvas:render", updatePreview);
      newCanvas.on("object:removed", updatePreview);

      updatePreview();

      newCanvas.dispose = (() => {
        const originalDispose = newCanvas.dispose.bind(newCanvas);
        return () => {
          document.removeEventListener("keydown", handleKeyDown);
          originalDispose();
        };
      })();

      // Attach mouse wheel zoom functionality
      // handleMouseWheelZoom(newCanvas);

      canvasesRef.current[id] = newCanvas;
      setCurrentCanvas(newCanvas);

      enablePanning(newCanvas);
    }
  };

  const zoomToObject = (canvas, object) => {
    // Skip zooming if the clicked object is an image
    if (object && object.type === "image") {
      return;
    }

    // Get the zoom level and center the canvas around the clicked object
    const zoom = Math.min(maxZoom, canvas.getZoom() + zoomStep); // Increment zoom level
    setZoomLevel(zoom);

    // Get the object's center point
    const objCenter = object.getCenterPoint();

    // Zoom to the object's center point
    canvas.zoomToPoint(objCenter, zoom);

    // Adjust the canvas container's scroll position
    const canvasContainer = document.querySelector(".canvas-container");
    const containerRect = canvasContainer.getBoundingClientRect();

    // Calculate the zoomed canvas dimensions
    const zoomedWidth = canvas.width * zoom;
    const zoomedHeight = canvas.height * zoom;

    // Ensure the canvas doesn't go out of the container's bounds
    const scrollLeft = Math.max(
      0,
      objCenter.x * zoom - containerRect.width / 2
    );
    const scrollTop = Math.max(
      0,
      objCenter.y * zoom - containerRect.height / 2
    );

    // Allow scrolling but make sure it doesn't go beyond the zoomed content
    canvasContainer.scrollLeft = Math.min(
      scrollLeft,
      zoomedWidth - containerRect.width
    );
    canvasContainer.scrollTop = Math.min(
      scrollTop,
      zoomedHeight - containerRect.height
    );
  };

  useEffect(() => {
    createCanvas(1); // Initialize the first canvas
    return () => {
      Object.values(canvasesRef.current).forEach((canvasInstance) => {
        canvasInstance.dispose();
      });
    };
  }, []);

  const handleZoom = (direction) => {
    if (!currentCanvas) return;

    let zoom = currentCanvas.getZoom();

    // Calculate new zoom level
    if (direction === "in") {
      zoom = Math.min(maxZoom, zoom + zoomStep);
    } else if (direction === "out") {
      zoom = Math.max(minZoom, zoom - zoomStep);
    }

    setZoomLevel(zoom);

    // Get the original dimensions
    const originalWidth = currentCanvas.originalWidth || currentCanvas.width;
    const originalHeight = currentCanvas.originalHeight || currentCanvas.height;

    // Calculate new dimensions
    const newWidth = originalWidth * zoom;
    const newHeight = originalHeight * zoom;

    // Update canvas dimensions
    currentCanvas.setWidth(newWidth);
    currentCanvas.setHeight(newHeight);

    // Set the zoom level for fabric.js objects
    currentCanvas.setZoom(zoom);

    // Ensure the canvas container allows scrolling
    const canvasContainer = document.querySelector(".canvas-container-wrapper");
    if (canvasContainer) {
      canvasContainer.style.overflow = "auto"; // Enable scrollbars
      canvasContainer.style.width = `${newWidth}px`;
      canvasContainer.style.height = `${newHeight}px`;

      // Adjust scroll position to center
      canvasContainer.scrollLeft = (newWidth - canvasContainer.offsetWidth) / 2;
      canvasContainer.scrollTop =
        (newHeight - canvasContainer.offsetHeight) / 2;
    }

    // Ensure all changes are rendered
    currentCanvas.requestRenderAll();
  };

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
    setZoomLevel(1); // Reset zoom level for the new page
  };

  useEffect(() => {
    createCanvas(1); // Initialize the first canvas
    return () => {
      // Cleanup all canvases on component unmount
      Object.values(canvasesRef.current).forEach((canvasInstance) => {
        canvasInstance.dispose();
      });
    };
  }, []);

  return (
    <div
      className="font-serif min-h-screen h-full flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #B2CCFF, #ffffff)",
      }}
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
            <AspectRatio canvasesRef={canvasesRef} pages={pages} />
          </div>
          <div className="flex flex-col">
            <Line canvas={currentCanvas} />
            <SaveCanvas
              pages={pages}
              canvasesRef={canvasesRef}
              onImportJSON={onImportJSON}
            />
            <Shapes canvas={currentCanvas} />
            <div className="zoom-toolbar">
              <button onClick={() => handleZoom("in")}>Zoom In</button>
              <button onClick={() => handleZoom("out")}>Zoom Out</button>
              <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
            </div>
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
            <div className="flex flex-col space-y-4 overflow-auto h-[50vh] scroller">
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
          </div>

          {/* Canvas Section */}
          <div className="canvas-container mt-8 w-full flex justify-center">
            {pages.map((page) => (
              <div
                key={page.id}
                className={`${activePage === page.id ? "block" : "hidden"} `}
                style={{
                  position: "relative",
                }}
              >
                <div
                  className="canvas-container-wrapper"
                  id={`canvas-wrapper-${page.id}`}
                  style={{
                    width: canvasesRef.current[page.id]?.width || "800px",
                    height: canvasesRef.current[page.id]?.height || "500px",
                  }}
                >
                  {/* <UndoRedo canvas={canvasesRef.current[page.id]} /> */}
                  <canvas
                    id={`canvas-${page.id}`}
                    style={{
                      position: "relative",
                      transformOrigin: "0 0",
                      transform: `scale(${zoomLevel})`,
                    }}
                  ></canvas>
                  <Guidelines canvas={canvasesRef.current[page.id]} />
                </div>
              </div>
            ))}
          </div>

          {/* Additional Tools */}
          <div className="flex flex-col justify-start gap-4 mt-8">
            <Layer canvas={currentCanvas} />
            <ImageCorrectionSaturation canvas={currentCanvas} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
