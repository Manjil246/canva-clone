import React, { useEffect, useState } from "react";

const Settings = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [color, setColor] = useState("");
  const [diameter, setDiameter] = useState("");
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (event) => {
        handleObjectSelection(event.selected[0]);
      });
      canvas.on("selection:updated", (event) => {
        handleObjectSelection(event.selected[0]);
      });
      canvas.on("selection:cleared", () => {
        setSelectedObject(null);
        clearSettings();
      });
      canvas.on("object:modified", (event) => {
        handleObjectSelection(event.target);
      });
      canvas.on("object:scaling", (event) => {
        handleObjectSelection(event.target);
      });
    }
  }, [canvas]);

  const handleObjectSelection = (object) => {
    if (!object) return;

    setSelectedObject(object);
    setOpacity(object.opacity);
    

    if (object.type === "rect" || object.type === "triangle") {
      setWidth(Math.round(object.width * object.scaleX));
      setHeight(Math.round(object.height * object.scaleY));
      setColor(object.fill);
      setDiameter("");
    } else if (object.type === "circle") {
      setDiameter(Math.round(object.radius * 2 * object.scaleX));
      setColor(object.fill);
      setWidth("");
      setHeight("");
    }
  };

  const clearSettings = () => {
    setWidth("");
    setHeight("");
    setColor("");
    setDiameter("");
  };

  const handleWidthChange = (e) => {
    const width = e.target.value.replace("/,/g", "");
    const intValue = parseInt(width, 10);
    setWidth(intValue);

    if (
      selectedObject &&
      (selectedObject.type === "rect" || selectedObject.type === "triangle") &&
      intValue >= 0
    ) {
      selectedObject.set({ width: intValue / selectedObject.scaleX });
      canvas.renderAll();
    }
  };
  const handleHeightChange = (e) => {
    const height = e.target.value.replace("/,/g", "");
    const intValue = parseInt(height, 10);
    setHeight(intValue);

    if (
      selectedObject &&
      (selectedObject.type === "rect" || selectedObject.type === "triangle") &&
      intValue >= 0
    ) {
      selectedObject.set({ height: intValue / selectedObject.scaleY });
      canvas.renderAll();
    }
  };
  const handleDiameterChange = (e) => {
    const diameter = e.target.value.replace("/,/g", "");
    const intValue = parseInt(diameter, 10);
    setDiameter(intValue);

    if (selectedObject && selectedObject.type === "circle" && intValue >= 0) {
      selectedObject.set({ radius: intValue / 2 / selectedObject.scaleX });
      canvas.renderAll();
    }
  };
  const handleColorChange = (e) => {
    const value = e.target.value;
    setColor(value);

    if (selectedObject) {
      selectedObject.set({ fill: value });
      canvas.renderAll();
    }
  };
  const handleOpacityChange = (e) => {
    const value = e.target.value;
    setOpacity(value);

    if (selectedObject) {
      selectedObject.set({ opacity: value });
      canvas.renderAll();
    }
  };

  return (
    <div>
      {selectedObject &&
        (selectedObject.type === "rect" ||
          selectedObject.type === "triangle") && (
          <div className="flex flex-col">
            <input type="text" value={width} onChange={handleWidthChange} />
            <input type="text" value={height} onChange={handleHeightChange} />
            <input type="color" value={color} onChange={handleColorChange} />
          </div>
        )}
      {selectedObject && selectedObject.type === "circle" && (
        <div className="flex flex-col">
          <input type="text" value={diameter} onChange={handleDiameterChange} />
          <input type="color" value={color} onChange={handleColorChange} />
        </div>
      )}
      {selectedObject && (
        <div className="flex flex-col">
          <input
            type="text"
            step={0.01}
            value={opacity}
            onChange={handleOpacityChange}
          />
        </div>
      )}
    </div>
  );
};

export default Settings;
