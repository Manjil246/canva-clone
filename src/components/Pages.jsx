import React, { useState } from "react";

const Pages = ({ canvas }) => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const addPage = () => {
    if (canvas) {
      // Create a new page (empty Fabric canvas JSON)
      const newPage = canvas.toJSON();
      setPages([...pages, newPage]);

      // Clear the current canvas for the new page
      canvas.clear();
      canvas.backgroundColor = "white";
      canvas.renderAll();

      // Set the new page as the current page
      setCurrentPage(pages.length);
    }
  };

  const switchPage = (index) => {
    if (canvas && pages[index]) {
      // Save the current page
      const updatedPages = [...pages];
      updatedPages[currentPage] = canvas.toJSON();
      setPages(updatedPages);

      // Load the selected page into the canvas
      canvas.loadFromJSON(pages[index], () => {
        canvas.renderAll();
      });

      setCurrentPage(index);
    }
  };

  return (
    <div className="bg-gray-200 p-4 border-t border-gray-300">
      <div className="flex justify-between mb-4">
        <button
          onClick={addPage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Page
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto">
        {pages.map((page, index) => (
          <div
            key={index}
            onClick={() => switchPage(index)}
            className={`flex justify-center items-center w-24 h-20 border-2 rounded cursor-pointer ${
              index === currentPage
                ? "border-blue-500"
                : "border-gray-300 hover:border-blue-300"
            }`}
          >
            <canvas
              id={`thumbnail-${index}`}
              width="100"
              height="80"
              className="bg-white"
            ></canvas>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pages;
