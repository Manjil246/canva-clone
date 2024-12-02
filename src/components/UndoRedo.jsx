import { RedoRounded, UndoRounded } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";

const UndoRedo = ({ canvas }) => {
  const [undoStack, setUndoStack] = useState([]); // Stack to hold undo states
  const [redoStack, setRedoStack] = useState([]); // Stack to hold redo states
  const isUndoRedoAction = useRef(false); // Prevent state saving during undo/redo
  const initialRender = useRef(true);

  const saveEvent = (e) => saveState(e.target);

  const disableCanvasEvents = () => {
    if (canvas) {
      canvas.off("object:modified");
      canvas.off("object:added");
      canvas.off("object:removed");
    }
  };

  const enableCanvasEvents = () => {
    if (canvas) {
      canvas.on("object:modified", saveEvent);
      canvas.on("object:added", saveEvent);
      canvas.on("object:removed", saveEvent);
    }
  };

  // Save the current state of the canvas to the undo stack
  const saveState = (object) => {
    if (object.customType === "guideline") return;
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
  };

  // Handle undo action
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const currentState = canvas.toJSON();
      const previousState = undoStack[undoStack.length - 1];

      isUndoRedoAction.current = true; // Mark as undo/redo action
      setUndoStack((prev) => prev.slice(0, -1)); // Remove the last state from undo stack
      setRedoStack((prev) => [currentState, ...prev]); // Push current state to redo stack

      loadCanvas(previousState);
    }
  };

  const loadCanvas = (state) => {
    if (canvas) {
      disableCanvasEvents();
      canvas.clear();
      canvas.requestRenderAll();
      canvas.loadFromJSON(state, async () => {
        await canvas.requestRenderAll();
        enableCanvasEvents();
      });
    }
  };

  // Handle redo action
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const currentState = canvas.toJSON();
      const nextState = redoStack[0];

      disableCanvasEvents();

      isUndoRedoAction.current = true; // Mark as undo/redo action
      setRedoStack((prev) => prev.slice(1)); // Remove the first state from redo stack
      setUndoStack((prev) => [...prev, currentState]); // Push current state to undo stack

      loadCanvas(nextState);
    }
  };

  // Save the canvas state when an object is added, modified, or removed
  useEffect(() => {
    if (canvas && initialRender.current) {
      initialRender.current = false;

      canvas.on("object:modified", saveEvent);
      canvas.on("object:added", saveEvent);
      canvas.on("object:removed", saveEvent);
      saveState({ customType: "notGuideline" });

      return () => {
        canvas.off("object:modified", saveEvent);
        canvas.off("object:added", saveEvent);
        canvas.off("object:removed", saveEvent);
      };
    }
  }, [canvas]);

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

// const loadCanvas = async (state) => {
//   if (canvas) {
//     disableCanvasEvents();
//     canvas.clear();

//     try {
//       // Wait for the canvas to load the JSON state
//       await new Promise((resolve, reject) => {
//         canvas.loadFromJSON(
//           state,
//           () => {
//             resolve(); // Resolve the promise once the canvas has finished loading
//           },
//           (error) => reject(error)
//         );
//       });

//       await canvas.requestRenderAll(); // Render the canvas after it's fully loaded
//     } catch (error) {
//       console.error("Error loading canvas state:", error);
//     } finally {
//       enableCanvasEvents();
//       console.log("undoStack", undoStack);
//       console.log("redoStack", redoStack);
//     }
//   }
// };
