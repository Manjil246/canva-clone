import React from "react";
import {
  Square,
  Circle,
  PlayArrow,
  Rectangle,
  CircleRounded,
  PentagonRounded,
} from "@mui/icons-material";
import {
  Rect,
  Circle as FabricCircle,
  Triangle as FabricTriangle,
  Polygon,
  Ellipse,
} from "fabric";

const Shapes = ({ canvas }) => {
  // Add a rectangle shape
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

  // Add a triangle shape
  const addTriangle = () => {
    if (canvas) {
      const triangle = new FabricTriangle({
        top: 100,
        left: 100,
        width: 100,
        height: 100,
        fill: "#af6591",
      });
      canvas.add(triangle);
    }
  };

  // Add a circle shape
  const addCircle = () => {
    if (canvas) {
      const circle = new FabricCircle({
        top: 100,
        left: 100,
        radius: 50,
        fill: "#765498",
      });
      canvas.add(circle);
    }
  };

  // Add a hexagon shape
  const addRhombus = () => {
    if (canvas) {
      const hexagon = new Polygon(
        [
          { x: 0, y: 50 },
          { x: 43, y: 0 },
          { x: 86, y: 50 },
          { x: 43, y: 100 },
          { x: 0, y: 50 },
        ],
        {
          top: 100,
          left: 100,
          fill: "#67b7a1",
        }
      );
      canvas.add(hexagon);
    }
  };

  // Add a rectangle shape using a different approach
  const addAltRectangle = () => {
    if (canvas) {
      const altRect = new Rect({
        top: 150,
        left: 150,
        width: 120,
        height: 80,
        fill: "#3498db",
      });
      canvas.add(altRect);
    }
  };

  // Add an ellipse shape
  const addEllipse = () => {
    if (canvas) {
      const ellipse = new Ellipse({
        top: 100,
        left: 100,
        rx: 70,
        ry: 40,
        fill: "#9b59b6",
      });
      canvas.add(ellipse);
    }
  };

  // Add a shield shape
  const addShield = () => {
    if (canvas) {
      const shield = new Polygon(
        [
          { x: 50, y: 0 },
          { x: 100, y: 40 },
          { x: 75, y: 100 },
          { x: 25, y: 100 },
          { x: 0, y: 40 },
        ],
        {
          top: 100,
          left: 100,
          fill: "#1abc9c",
        }
      );
      canvas.add(shield);
    }
  };

  return (
    <div className="flex flex-wrap space-x-2 text-xs w-[200px]">
      <button
        className="px-2 py-1 bg-green-700 text-white rounded-2xl border border-white m-1"
        onClick={addRectangle}
      >
        <Square fontSize="small" />
      </button>
      <button
        className="px-2 py-1 bg-green-700 text-white rounded-2xl border border-white m-1"
        onClick={addCircle}
      >
        <Circle fontSize="small" />
      </button>
      <button
        className="px-2 py-1 bg-green-700 text-white rounded-2xl border border-white m-1"
        onClick={addTriangle}
      >
        <div className="-rotate-90">
          <PlayArrow fontSize="small" />
        </div>
      </button>
      <button
        className="px-2 py-1 bg-green-700 text-white rounded-2xl border border-white m-1"
        onClick={addRhombus}
      >
        <div className="rotate-45">
          <Square fontSize="small" />
        </div>
      </button>
      <button
        className="px-2 py-1 bg-green-700 text-white rounded-2xl border border-white m-1"
        onClick={addAltRectangle}
      >
        <Rectangle fontSize="small" />
      </button>
      <button
        className="px-2 py-1 bg-green-700 text-white rounded-2xl border border-white m-1"
        onClick={addEllipse}
      >
        <CircleRounded fontSize="small" />
      </button>
      <button
        className="px-2 py-1 bg-green-700 text-white rounded-2xl border border-white m-1"
        onClick={addShield}
      >
        <PentagonRounded fontSize="small" />
      </button>
    </div>
  );
};

export default Shapes;
