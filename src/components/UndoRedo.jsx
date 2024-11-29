import { RedoRounded, UndoRounded } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";

const UndoRedo = ({ canvas }) => {
  // Stack to hold canvas states
  const [stack, setStack] = useState([]);
  const [index, setIndex] = useState(-1); // Track the current position in the stack
  const undoRedoRef = useRef(false);

  // useEffect(() => {
  //   if (canvas) {
  //     console.log("Stack", stack);
  //   }
  // }, [stack]);

  // Function to save the current state of the canvas to the stack
  const saveState = (e) => {
    if (e.customType === "guideline") return;
    if (undoRedoRef.current) {
      undoRedoRef.current = false;
      return;
    }
    if (canvas) {
      console.log("Saving state...");
      const currentState = canvas.toJSON(); // Get the current state of the canvas
      console.log("Current State", currentState);

      setStack((prevStack) => {
        const newStack = [...prevStack, currentState];
        console.log("Updated Stack", newStack);
        return newStack;
      });
      setIndex((prevIndex) => prevIndex + 1); // Update the current index
    }
  };

  // Handle undo action
  const handleUndo = () => {
    undoRedoRef.current = true;
    if (index > 0) {
      const previousState = stack[index - 1]; // Get the previous state
      canvas.loadFromJSON(previousState, () => {
        setIndex(index - 1); // Move the index backward
      });
    }
  };

  // Handle redo action
  const handleRedo = () => {
    undoRedoRef.current = true;
    if (index < stack.length - 1) {
      const nextState = stack[index + 1]; // Get the next state
      canvas.loadFromJSON(nextState, () => {
        setIndex(index + 1); // Move the index forward
      });
    }
  };

  // Save the canvas state when an object is added, modified, or removed
  useEffect(() => {
    if (canvas) {
      canvas.on("object:modified", (event) => {
        saveState(event.target);
      });
      canvas.on("object:added", (event) => {
        saveState(event.target);
      }); // Save state when an object is added
      canvas.on("object:removed", (event) => {
        saveState(event.target);
      });
      saveState({ customType: "notGuideline" });
      return () => {
        canvas.off("object:modified", saveState);
        canvas.off("object:added", saveState);
        canvas.off("object:removed", saveState);
      };
    }
  }, [canvas]);

  return (
    <div className="flex justify-around w-20 bg-slate-500 p-2 rounded-lg mb-1">
      <button
        onClick={handleUndo}
        disabled={index <= 0}
        className="cursor-pointer"
      >
        <div className="rotate-[35deg]">
          <UndoRounded sx={{ color: "white" }} />
        </div>
      </button>
      <div className="w-[2px] h-6 bg-white"></div>
      <button
        onClick={handleRedo}
        disabled={index >= stack.length - 1}
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
