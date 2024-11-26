import { useRef, useState, useEffect } from "react";
import "./App.css";
import { Canvas } from "fabric";
import Settings from "./components/Settings";
import Image from "./components/Image";
import Text from "./components/Text";
import Shapes from "./components/Shapes";
import Line from "./components/Line";
import Guidelines from "./components/Guidelines";
import AspectRatio from "./components/AspectRatio";
// import Pages from "./components/Pages";
import SaveCanvas from "./components/SaveCanvas";
import Shadow from "./components/Shadow";
import Border from "./components/Border";
import Group from "./components/Group";
import Layer from "./components/Layer";
import ImageCorrectionSaturation from "./components/ImageCorrectionSaturation";

function App() {
  const canvasRef = useRef(null);

  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });

      initCanvas.backgroundColor = "#ffffff";
      initCanvas.renderAll();
      setCanvas(initCanvas);

      // Add keydown listener for delete functionality
      const handleKeyDown = (e) => {
        if (e.key === "Delete") {
          const activeObjects = initCanvas.getActiveObjects();
          if (activeObjects && activeObjects.length > 0) {
            activeObjects.forEach((obj) => {
              // Prevent deletion if the object is a Text and is in editing mode
              if (obj.isEditing && obj.type === "textbox") {
                return;
              }
              initCanvas.remove(obj);
            });
            initCanvas.discardActiveObject(); // Clear the active selection
            initCanvas.renderAll();
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
      <div
        className="font-serif text-center flex flex-col w-screen space-y-10  items-center px-24 py-4 bg-gray-500 min-h-screen h-full"
        style={{ backgroundColor: "#B2CCFF" }}
      >
        <div className="flex justify-between w-full">
          <div>
            <Shapes canvas={canvas} />
            <Shadow canvas={canvas} />
            <Border canvas={canvas} />
          </div>
          <div className="mt-20">
            <canvas id="canvas" ref={canvasRef}></canvas>
            <Group canvas={canvas} />
            <Layer canvas={canvas} />
            <ImageCorrectionSaturation canvas={canvas} />
          </div>
          <div>
            <Settings canvas={canvas} />
            <Image canvas={canvas} />
            <Text canvas={canvas} />
            <Line canvas={canvas} />
            <Guidelines canvas={canvas} />
            <AspectRatio canvas={canvas} />
            <SaveCanvas canvas={canvas} />
          </div>
        </div>
        {/* <Pages canvas={canvas} /> */}
      </div>
    </>
  );
}

export default App;
