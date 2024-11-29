import React, { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";

const Pages = ({ setCurrentCanvas }) => {
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
    setActivePage(id);
    setCurrentCanvas(canvasesRef.current[id]); // Update the current canvas
  };

  return (
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
        {pages.map((page) => (
          <div
            key={page.id}
            className={`cursor-pointer px-4 py-2 border ${
              activePage === page.id ? "bg-gray-300 font-bold" : "bg-white"
            }`}
            onClick={() => handleSwitchPage(page.id)}
          >
            Page {page.id}
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
  );
};

export default Pages;

