import React from "react";
import * as fabric from "fabric";

const ShapeImage = ({ canvas }) => {
  const applyShape = (shape) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "image") {
      let clipPath;
      if (shape === "Circle") {
        const radius = Math.min(activeObject.width, activeObject.height) / 2;
        clipPath = new fabric.Circle({
          radius,
          originX: "center",
          originY: "center",
        });
      } else if (shape === "Ellipse") {
        clipPath = new fabric.Ellipse({
          rx: activeObject.width / 3,
          ry: activeObject.height / 2,
          originX: "center",
          originY: "center",
        });
      } else if (
        shape === "Pentagon" ||
        shape === "Hexagon" ||
        shape === "Heptagon" ||
        shape === "Octagon"
      ) {
        const sides = {
          Pentagon: 5,
          Hexagon: 6,
          Heptagon: 7,
          Octagon: 8,
        }[shape];
        const radius = Math.min(activeObject.width, activeObject.height) / 2;
        const angle = (2 * Math.PI) / sides;
        const points = Array.from({ length: sides }, (_, i) => ({
          x: radius * Math.sin(i * angle),
          y: -radius * Math.cos(i * angle),
        }));
        clipPath = new fabric.Polygon(points, {
          originX: "center",
          originY: "center",
        });
      } else if (shape === "Star") {
        const points = 5;
        const outerRadius =
          Math.min(activeObject.width, activeObject.height) / 2;
        const innerRadius = outerRadius / 2.5;
        const angle = Math.PI / points;
        const starPoints = Array.from({ length: points * 2 }, (_, i) => {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          return {
            x: radius * Math.sin(i * angle),
            y: -radius * Math.cos(i * angle),
          };
        });
        clipPath = new fabric.Polygon(starPoints, {
          originX: "center",
          originY: "center",
        });
      } else if (shape === "RoundedRect") {
        clipPath = new fabric.Rect({
          width: activeObject.width,
          height: activeObject.height,
          rx: activeObject.width / 10,
          ry: activeObject.width / 10,
          originX: "center",
          originY: "center",
        });
      } else {
        clipPath = new fabric[shape]({
          width: activeObject.width,
          height: activeObject.height,
          originX: "center",
          originY: "center",
        });
      }
      activeObject.set({ clipPath });
      canvas.renderAll();
    }
  };

  return (
    <div className="flex flex-col">
      <select onChange={(e) => applyShape(e.target.value)} defaultValue="">
        <option value="" disabled>
          Select Shape
        </option>
        <option value="Circle">Circle</option>
        <option value="Rect">Square</option>
        <option value="Triangle">Triangle</option>
        <option value="Ellipse">Ellipse</option>
        <option value="Pentagon">Pentagon</option>
        <option value="Hexagon">Hexagon</option>
        <option value="Heptagon">Heptagon</option>
        <option value="Octagon">Octagon</option>
        <option value="Star">Star</option>
        <option value="RoundedRect">Rounded Square</option>
      </select>
    </div>
  );
};

export default ShapeImage;
