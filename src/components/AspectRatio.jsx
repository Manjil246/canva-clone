import { useEffect, useState } from "react";

const AspectRatio = ({ pages, canvasesRef, setChanged }) => {
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);

  const handleAspectRatioChange = () => {
    pages.forEach((page) => {
      const canvas = canvasesRef.current[page.id];
      if (canvas) {
        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.requestRenderAll();
        setChanged(true);
      }
    });
  };

  useEffect(() => {
    if (pages.length > 0) {
      const firstCanvas = canvasesRef.current[pages[0]?.id];
      if (firstCanvas) {
        setWidth(firstCanvas.getWidth());
        setHeight(firstCanvas.getHeight());
      }
    }
  }, [pages, canvasesRef]);

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
            step={50}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="border px-2 py-1 rounded w-20"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium">
            Height
          </label>
          <input
            type="number"
            id="height"
            step={50}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="border px-2 py-1 rounded w-20"
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
