import { Canvas } from "fabric";
import React, { useEffect, useState } from "react";

const Layer = ({ canvas }) => {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  let uniqueIdCounter = 0;

  const hideSelectedLayer = () => {
    if (!selectedLayer) return;

    const object = canvas
      .getObjects()
      .find((obj) => obj.id === selectedLayer.id);
    if (!object) return;

    if (object.opacity === 0) {
      object.opacity = object.prevOpacity || 1;
      object.prevOpacity = undefined;
    } else {
      object.prevOpacity = object.opacity || 1;
      object.opacity = 0;
    }
    canvas.renderAll();
    updateLayers();
    setSelectedLayer({ ...selectedLayer, opacity: object.opacity });
  };

  const moveSelectedLayer = (direction) => {
    if (!selectedLayer) return;

    const objects = canvas.getObjects();
    const object = objects.find((obj) => obj.id === selectedLayer.id);

    if (object) {
      if (direction === "up") {
        canvas.bringObjectForward(object);
      } else if (direction === "down") {
        canvas.sendObjectBackwards(object);
      }

      canvas.renderAll();
      updateLayers();
    }
  };

  const addIdToObject = (obj) => {
    if (!obj.id) {
      const timestamp = new Date().getTime();
      const randomComponent = Math.random().toString(36).substr(2, 5); // Add randomness
      uniqueIdCounter += 1; // Increment the counter
      obj.id = `${obj.type}-${timestamp}-${randomComponent}-${uniqueIdCounter}`;
    }
  };

  Canvas.prototype.updateZIndices = function () {
    const objects = this.getObjects();
    let count = 0;
    objects.forEach((obj) => {
      addIdToObject(obj);
      if (obj.customType !== "guideline") {
        obj.zIndex = count;
        count++;
      }
    });
  };

  const updateLayers = () => {
    if (canvas) {
      canvas.updateZIndices();
      const objects = canvas
        .getObjects()
        .filter(
          (obj) =>
            !(
              obj.id.startsWith("vertical-") ||
              obj.id.startsWith("horizontal-") ||
              obj.customType === "guideline"
            )
        )
        .map((obj) => {
          return {
            id: obj.id,
            zIndex: obj.zIndex,
            type: obj.type,
            opacity: obj.opacity,
            preview: obj.toDataURL({
              format: "png",
              scaleX: 0.4,
            }),
          };
        });
      setLayers([...objects].reverse());
    }
  };

  const handleObjectSelection = (e) => {
    const selectedObject = e.selected ? e.selected[0] : null;
    if (selectedObject) {
      setSelectedLayer({
        id: selectedObject.id,
        opacity: selectedObject.opacity,
      });
    } else {
      setSelectedLayer(null);
    }
  };

  const selectLayerInCanvas = (layerId) => {
    const object = canvas.getObjects().find((obj) => obj.id === layerId);
    if (object) {
      canvas.setActiveObject(object);
      canvas.renderAll();
      setSelectedLayer({
        id: object.id,
        opacity: object.opacity,
      });
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", updateLayers);
      canvas.on("object:removed", updateLayers);
      canvas.on("object:modified", updateLayers);

      canvas.on("selection:created", handleObjectSelection);
      canvas.on("selection:updated", handleObjectSelection);
      canvas.on("selection:cleared", () => {
        setSelectedLayer(null);
      });

      updateLayers();

      return () => {
        canvas.off("object:added", updateLayers);
        canvas.off("object:removed", updateLayers);
        canvas.off("object:modified", updateLayers);

        canvas.off("selection:created", handleObjectSelection);
        canvas.off("selection:updated", handleObjectSelection);
        canvas.off("selection:cleared", () => {
          setSelectedLayer(null);
        });
      };
    }
  }, [canvas]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => moveSelectedLayer("up")}
          disabled={!selectedLayer || selectedLayer?.id === layers[0]?.id}
        >
          Up
        </button>
        <button
          onClick={() => moveSelectedLayer("down")}
          disabled={
            !!selectedLayer &&
            selectedLayer?.id === layers[layers.length - 1]?.id
          }
        >
          Down
        </button>
        <button onClick={hideSelectedLayer} disabled={!selectedLayer}>
          {selectedLayer?.opacity === 0 ? "Show" : "Hide"}
        </button>
      </div>
      <ul className="transition-all duration-300 ease-in-out overflow-y-auto h-96">
        {layers.map((layer) => (
          <li
            key={layer.id}
            className={`p-2 rounded-lg transition-transform duration-300 ease-in-out ${
              layer.id === selectedLayer?.id ? "bg-gray-400" : ""
            }`}
            onClick={() => selectLayerInCanvas(layer.id)}
          >
            <img
              src={layer.preview}
              alt={layer.type}
              className="cover w-52 h-12 object-contain cursor-pointer"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Layer;
