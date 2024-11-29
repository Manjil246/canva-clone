import React, { useState } from "react";

const UndoRedo = ({ canvas }) => {
  // Keep track of undo and redo stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Save the current state of the canvas to the undo stack
  const saveState = () => {
    const currentState = canvas.toJSON();
    setUndoStack((prevState) => [...prevState, currentState]);
    setRedoStack([]); // Clear redo stack when a new action is performed
  };

  // Undo the last action
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const lastState = undoStack[undoStack.length - 1];
    canvas.loadFromJSON(lastState, () => {
      canvas.renderAll();
      setRedoStack((prevState) => [...prevState, lastState]); // Push the undone state to redo stack
      setUndoStack((prevState) => prevState.slice(0, -1)); // Remove the last state from undo stack
    });
  };

  // Redo the last undone action
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const lastUndoneState = redoStack[redoStack.length - 1];
    canvas.loadFromJSON(lastUndoneState, () => {
      canvas.renderAll();
      setUndoStack((prevState) => [...prevState, lastUndoneState]); // Push the redone state to undo stack
      setRedoStack((prevState) => prevState.slice(0, -1)); // Remove the last undone state from redo stack
    });
  };

  return (
    <div className="flex justify-around w-52">
      <button
        onClick={handleUndo}
        disabled={undoStack.length === 0}
        className="cursor-pointer"
      >
        Undo
      </button>
      <button
        onClick={handleRedo}
        disabled={redoStack.length === 0}
        className="cursor-pointer"
      >
        Redo
      </button>
    </div>
  );
};

export default UndoRedo;
