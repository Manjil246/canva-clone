import React, { useEffect } from "react";
import * as fabric from "fabric";
import { X } from "@mui/icons-material";

const CopyPaste = ({ canvas }) => {
  const handleCopy = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        const copiedObject = activeObject.toObject();
        navigator.clipboard.writeText(JSON.stringify(copiedObject)).then(() => {
          console.log("Copied object:", copiedObject);
        });
      }
    }
  };

  const addImageToCanvas = (objectData) => {
    const imageElement = document.createElement("img");
    imageElement.crossOrigin = "Anonymous";
    imageElement.src = objectData.src;
    imageElement.onload = () => {
      const width = objectData.width;
      const height =
        (imageElement.naturalHeight / imageElement.naturalWidth) * width;
      let image = new fabric.Image(imageElement, {
        left: objectData.left + 10,
        top: objectData.top + 10,
        scaleX: objectData.scaleX,
        scaleY: objectData.scaleY,
        angle: objectData.angle,
        flipX: objectData.flipX,
        flipY: objectData.flipY,
        opacity: objectData.opacity,
        originX: objectData.originX,
        originY: objectData.originY,
      });
      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    };
    imageElement.onerror = () => {
      console.error("Failed to load image:", objectData.src);
    };
  };

  const handlePaste = () => {
    console.log("handlePaste called");
    navigator.clipboard.readText().then((text) => {
      let objectData;
      try {
        objectData = JSON.parse(text);
      } catch (e) {
        console.error("Invalid JSON:", e);
        return;
      }

      if (!objectData.type) {
        console.error("Not a valid fabric object JSON");
        return;
      }

      console.log("Object data to paste:", objectData);

      let objectCopy;
      console.log("Object type:", objectData.type);
      switch (objectData.type.toLowerCase()) {
        case "rect":
        case "Rect":
          objectCopy = new fabric.Rect(objectData);
          break;
        case "circle":
        case "Circle":
          objectCopy = new fabric.Circle(objectData);
          break;
        case "triangle":
        case "Triangle":
          objectCopy = new fabric.Triangle(objectData);
          break;
        case "path":
        case "Path":
          objectCopy = new fabric.Path(objectData.path, objectData);
          break;
        case "image":
        case "Image":
          addImageToCanvas(objectData);
          return;
        case "line":
        case "Line":
          objectCopy = new fabric.Line(objectData.points, objectData);
          break;
        case "textbox":
        case "Textbox":
          objectCopy = objectData;
          return;
        default:
          console.error("Unsupported object type:", objectData.type);
          return;
      }

      if (objectCopy) {
        console.log("Object to paste:", objectCopy);
        objectCopy.set({
          left: objectCopy.left + 10,
          top: objectCopy.top + 10,
        });
        canvas.add(objectCopy);
        canvas.setActiveObject(objectCopy);
        canvas.renderAll();
      } else {
        console.error("Failed to paste object");
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const copyKeyPressed =
        (e.ctrlKey || (isMac && e.metaKey)) && (e.key === "c" || e.key === "C");
      const pasteKeyPressed =
        (e.ctrlKey || (isMac && e.metaKey)) && (e.key === "v" || e.key === "V");

      if (copyKeyPressed) {
        handleCopy();
        // e.preventDefault();
      }

      if (pasteKeyPressed) {
        handlePaste();
        // e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas]);

  return null;
};

export default CopyPaste;
