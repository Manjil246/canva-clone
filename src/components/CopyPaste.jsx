import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

const CopyPaste = ({ canvas, clipboardRef }) => {
  const handleCopy = () => {
    if (canvas) {
      canvas
        .getActiveObject()
        .clone()
        .then((cloned) => {
          clipboardRef.current = cloned;
          console.log("Copied object:", cloned);
        });
    }
  };

  const handlePaste = async () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.isEditing) {
      // Return early if the active object is a Textbox and is being edited
      return;
    }

    if (!clipboardRef.current) {
      console.error("No object to paste");
      return;
    }

    const clonedObj = await clipboardRef.current.clone();
    canvas.discardActiveObject();
    clonedObj.set({
      left: clonedObj.left + 10,
      top: clonedObj.top + 10,
      evented: true,
    });

    if (clonedObj instanceof fabric.ActiveSelection) {
      clonedObj.canvas = canvas;
      clonedObj.forEachObject((obj) => {
        canvas.add(obj);
      });
      clonedObj.setCoords();
    } else {
      canvas.add(clonedObj);
    }

    clipboardRef.current.top += 10;
    clipboardRef.current.left += 10;
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
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
      }

      if (pasteKeyPressed) {
        handlePaste();
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
