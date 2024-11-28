import React, { useState, useEffect } from "react";

const Shadow = ({ canvas }) => {
  const [shadowColor, setShadowColor] = useState("#000000");
  const [shadowBlur, setShadowBlur] = useState(10);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(0);
  const [isObjectSelected, setIsObjectSelected] = useState(false);

  useEffect(() => {
    if (!canvas) return;

    // Check if an object is selected and update state
    const handleObjectSelection = () => {
      const activeObject = canvas.getActiveObject();
      setIsObjectSelected(!!activeObject);
    };

    canvas.on("selection:created", handleObjectSelection);
    canvas.on("selection:updated", handleObjectSelection);
    canvas.on("selection:cleared", handleObjectSelection);

    return () => {
      canvas.off("selection:created", handleObjectSelection);
      canvas.off("selection:updated", handleObjectSelection);
      canvas.off("selection:cleared", handleObjectSelection);
    };
  }, [canvas]);

  // Update shadow properties in real-time
  useEffect(() => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("shadow", {
        color: shadowColor,
        blur: shadowBlur,
        offsetX: shadowOffsetX,
        offsetY: shadowOffsetY,
      });
      canvas.renderAll();
    }
  }, [shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY, canvas]);

  const resetShadow = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (!activeObject) {
      alert("Please select an object to reset shadow.");
      return;
    }

    activeObject.set({ shadow: null });
    canvas.renderAll();

    // Reset shadow state values
    setShadowColor("#000000");
    setShadowBlur(10);
    setShadowOffsetX(0);
    setShadowOffsetY(0);
  };

  if (!isObjectSelected) {
    return (
      <div className="text-gray-500">
        Select an object to modify shadow settings.
      </div>
    );
  }

  return (
    <div className="shadow-settings bg-white rounded shadow-lg text-xs">
      <h3 className="text-lg font-bold">Shadow Settings</h3>

      <div>
        <label className="block text-sm font-medium mb-1">Shadow Blur</label>
        <input
          type="range"
          min="0"
          max="50"
          value={shadowBlur}
          onChange={(e) => setShadowBlur(Number(e.target.value))}
          className="w-fit text-center"
        />
        <span className="text-sm">{shadowBlur}</span>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Shadow Offset X
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          value={shadowOffsetX}
          onChange={(e) => setShadowOffsetX(Number(e.target.value))}
          className="w-fit text-center"
        />
        <span className="text-sm">{shadowOffsetX}</span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Shadow Offset Y
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          value={shadowOffsetY}
          onChange={(e) => setShadowOffsetY(Number(e.target.value))}
          className="w-fit text-center"
        />
        <span className="text-sm">{shadowOffsetY}</span>
      </div>
      <div className="flex flex-col">
        <div>
          <label className="block text-sm font-medium mb-1">Shadow Color</label>
          <input
            type="color"
            value={shadowColor}
            onChange={(e) => setShadowColor(e.target.value)}
          />
        </div>
        <button
          onClick={resetShadow}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 h-fit w-fit"
        >
          Reset Shadow
        </button>
      </div>
    </div>
  );
};

export default Shadow;
