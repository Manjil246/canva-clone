import { RedoRounded, UndoRounded } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";

const UndoRedo = ({ canvas, loaded, threshold = 5 }) => {
  const [undoStack, setUndoStack] = useState([]); // Stack to hold undo states
  const [redoStack, setRedoStack] = useState([]); // Stack to hold redo states
  const isUndoRedoAction = useRef(false); // Prevent state saving during undo/redo
  const initialRender = useRef(true);

  console.log("undoStack", undoStack);
  console.log("redoStack", redoStack);

  // console.log(loaded);

  const saveEvent = (e) => {
    if (e.target.customType === "guideline") return;
    saveState();
  };

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // Save the current state of the canvas to the undo stack
  const saveState = debounce(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    } // Avoid saving during undo/redo
    if (canvas) {
      const currentState = canvas.toJSON();
      if (!currentState.background) return;
      console.log("Saving...");
      setUndoStack((prev) => [...prev, currentState]);
      setRedoStack([]); // Clear redo stack whenever a new action is performed
    }
  }, 300);

  // Handle undo action
  const handleUndo = () => {
    if (undoStack.length > 1) {
      const redoState = undoStack[undoStack.length - 1];
      const stateToBeLoaded = undoStack[undoStack.length - 2];

      isUndoRedoAction.current = true; // Mark as undo/redo action
      setUndoStack((prev) => prev.slice(0, -1)); // Remove the last state from undo stack
      setRedoStack((prev) => [...prev, redoState]); // Push current state to redo stack

      loadCanvas(stateToBeLoaded);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault(); // Prevent default browser undo behavior
        handleUndo(); // Call undo function
      }
      if (e.ctrlKey && e.key === "y") {
        e.preventDefault(); // Prevent default browser redo behavior
        handleRedo(); // Call redo function
      }
    };

    // Add event listener for keydown events
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undoStack, redoStack]);

  // Handle redo action
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const undoState = redoStack[redoStack.length - 1];
      const stateToBeLoaded = redoStack[redoStack.length - 1];

      // disableCanvasEvents();

      isUndoRedoAction.current = true; // Mark as undo/redo action
      setUndoStack((prev) => [...prev, undoState]); // Push current state to undo stack
      setRedoStack((prev) => prev.slice(0, -1)); // Remove the first state from redo stack

      loadCanvas(stateToBeLoaded);
    }
  };

  const loadCanvas = (state) => {
    if (canvas) {
      // canvas.clear();

      canvas.loadFromJSON(
        state,
        () => {
          canvas.renderOnAddRemove = true;
          // canvas.renderAll(); // Ensure the canvas is fully rendered
          // enableCanvasEvents();
          requestAnimationFrame(() => canvas.renderAll());
        },
        (error) => {
          console.error("Error loading canvas state:", error);
        }
      );
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const saveEvent = (e) => {
      if (e?.target?.customType !== "guideline") saveState();
    };

    // Attach event listeners to save canvas state
    canvas.on("object:modified", saveEvent);
    canvas.on("object:added", saveEvent);
    canvas.on("object:removed", saveEvent);

    // Save initial state
    if (loaded) {
      setUndoStack([canvas.toJSON()]);
      setRedoStack([]);
    } else if (undoStack.length === 0) {
      setUndoStack([canvas.toJSON()]);
    }

    return () => {
      canvas.off("object:modified", saveEvent);
      canvas.off("object:added", saveEvent);
      canvas.off("object:removed", saveEvent);
    };
  }, [canvas, loaded]);

  return (
    <div className="flex justify-around w-20 bg-slate-500 p-2 rounded-lg mb-1">
      <button
        onClick={handleUndo}
        disabled={undoStack.length === 0}
        className="cursor-pointer"
      >
        <div className="rotate-[35deg]">
          <UndoRounded sx={{ color: "white" }} />
        </div>
      </button>
      <div className="w-[2px] h-6 bg-white"></div>
      <button
        onClick={handleRedo}
        disabled={redoStack.length === 0}
        className="cursor-pointer"
      >
        <div className="-rotate-[35deg]">
          <RedoRounded sx={{ color: "white" }} />
        </div>
      </button>
    </div>
  );
};

export default UndoRedo;
