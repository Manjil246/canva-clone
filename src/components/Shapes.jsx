import React from "react";
import { Rect, Circle, Triangle, Text } from "fabric";

const Shapes = ({ canvas }) => {
  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 100,
        width: 100,
        height: 100,
        fill: "#af4511",
      });

      canvas.add(rect);
    }
  };

  const addTriangle = () => {
    if (canvas) {
      const triangle = new Triangle({
        top: 100,
        left: 100,
        width: 100,
        height: 100,
        fill: "#af6591",
      });

      canvas.add(triangle);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        top: 100,
        left: 100,
        radius: 50,
        fill: "#765498",
      });

      canvas.add(circle);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        className="px-4 py-2 bg-green-700 text-white rounded-2xl border border-white m-5"
        onClick={addRectangle}
      >
        Add Rectangle
      </button>
      <button
        className="px-4 py-2 bg-green-700 text-white rounded-2xl border border-white m-5"
        onClick={addCircle}
      >
        Add Circle
      </button>
      <button
        className="px-4 py-2 bg-green-700 text-white rounded-2xl border border-white m-5"
        onClick={addTriangle}
      >
        Add Triangle
      </button>
    </div>
  );
};

export default Shapes;
