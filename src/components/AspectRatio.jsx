import { useState } from "react";

const AspectRatio = ({ canvas }) => {
  const [width, setWidth] = useState(1300);
  const [height, setHeight] = useState(1100);

  const handleAspectRatioChange = () => {
    if (canvas) {
      canvas.setDimensions({ width, height });
      canvas.renderAll();
    }
  };

  return (
    <div className="aspect-ratio-control">
      <h3 className="font-bold mb-2">Change Aspect Ratio</h3>
      <div className="flex gap-2 mb-4">
        <div>
          <label htmlFor="width" className="block text-sm font-medium">
            Width
          </label>
          <input
            type="number"
            id="width"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium">
            Height
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>
      <button
        onClick={handleAspectRatioChange}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update Canvas
      </button>
    </div>
  );
};

export default AspectRatio;
