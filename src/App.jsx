import { useRef, useState, useEffect } from "react";
import "./App.css";
import { Canvas } from "fabric";
import Settings from "./components/Settings";
import Image from "./components/Image";
import Text from "./components/Text";
import Shapes from "./components/Shapes";
import Line from "./components/Line";
import Guidelines from "./components/Guidelines";

function App() {
  const canvasRef = useRef(null);

  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
      });

      initCanvas.backgroundColor = "white";
      initCanvas.renderAll();
      setCanvas(initCanvas);

      // Add keydown listener for delete functionality
      const handleKeyDown = (e) => {
        if (e.key === "Delete") {
          const activeObject = initCanvas.getActiveObject();
          if (activeObject) {
            // Prevent deletion if the active object is a Text and is in editing mode
            if (activeObject.isEditing) {
              return;
            }
            initCanvas.remove(activeObject);
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      // Cleanup event listener
      return () => {
        initCanvas.dispose();
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  return (
    <>
      <div className="font-serif text-center flex justify-between items-center px-24 py-4 bg-gray-500 min-h-screen h-full">
        <Shapes canvas={canvas} />
        <canvas id="canvas" ref={canvasRef}></canvas>
        <div>
          <Settings canvas={canvas} />
          <Image canvas={canvas} />
          <Text canvas={canvas} />
          <Line canvas={canvas} />
          <Guidelines canvas={canvas} />
        </div>
      </div>
    </>
  );
}

export default App;
