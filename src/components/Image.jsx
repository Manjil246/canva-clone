import React, { useRef, useEffect } from "react";
import * as fabric from "fabric";

const Image = ({ canvas }) => {
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (canvas) {
      const handlePaste = (event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
              event.preventDefault();
              const blob = items[i].getAsFile();
              const reader = new FileReader();
              reader.onload = (e) => addImageToCanvas(e.target.result);
              reader.readAsDataURL(blob);
            }
          }
        }
      };

      window.addEventListener("paste", handlePaste);

      return () => {
        window.removeEventListener("paste", handlePaste);
      };
    }
  }, [canvas]);

  const addImageToCanvas = (src) => {
    const imageElement = document.createElement("img");
    imageElement.src = src;
    imageElement.onload = () => {
      const width = 200;
      const height =
        (imageElement.naturalHeight / imageElement.naturalWidth) * width;
      let image = new fabric.Image(imageElement, {
        left: 200,
        top: 200,
        originX: "center",
        originY: "center",
      });
      image.set({
        scaleX: width / imageElement.naturalWidth,
        scaleY: height / imageElement.naturalHeight,
      });
      canvas.add(image);
      canvas.centerObject(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    };
    imageElement.onerror = () => {
      console.error("Failed to load image:", src);
    };
    fileInputRef.current.value = "";
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => addImageToCanvas(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy"; // Indicate that the file can be copied
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => addImageToCanvas(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div
      className="border border-gray-300 rounded text-center text-xs"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3 className="text-lg font-semibold">Add Image</h3>
      <button
        className="px-2 py-1 bg-blue-600 text-white rounded-lg"
        onClick={() => fileInputRef.current.click()}
      >
        Upload Image
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <p className="text-sm text-gray-500">
        Drag & drop, copy-paste,
        <br /> or upload an image.
      </p>
    </div>
  );
};

export default Image;
