import { Canvas } from "fabric";
import React, { useEffect, useState } from "react";

const Layer = ({ canvas }) => {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);

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
      const currentIndex = objects.indexOf(object);
      if (direction === "up" && currentIndex < objects.length - 1) {
        const temp = objects[currentIndex];
        objects[currentIndex] = objects[currentIndex + 1];
        objects[currentIndex + 1] = temp;
      } else if (direction === "down" && currentIndex > 0) {
        const temp = objects[currentIndex];
        objects[currentIndex] = objects[currentIndex - 1];
        objects[currentIndex - 1] = temp;
      }
      const backgroundColor = canvas.backgroundColor;
      canvas.clear();
      objects.forEach((obj) => {
        canvas.add(obj);
      });
      canvas.backgroundColor = backgroundColor;
      canvas.renderAll();
      objects.forEach((obj, index) => {
        obj.zIndex = index;
      });
      canvas.setActiveObject(object);
      canvas.renderAll();
      updateLayers();
    }
  };

  const addIdToObject = (obj) => {
    if (!obj.id) {
      const timestamp = new Date().getTime();
      obj.id = `${obj.type}-${timestamp}`;
    }
  };

  Canvas.prototype.updateZIndices = function () {
    const objects = this.getObjects();
    objects.forEach((obj, index) => {
      addIdToObject(obj);
      obj.zIndex = index;
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
              obj.id.startsWith("line-")
            )
        )
        .map((obj) => ({
          id: obj.id,
          zIndex: obj.zIndex,
          type: obj.type,
          opacity: obj.opacity,
        }));
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
          disabled={!selectedLayer || selectedLayer.id === layers[0].id}
        >
          Up
        </button>
        <button
          onClick={() => moveSelectedLayer("down")}
          disabled={
            !selectedLayer || selectedLayer.id === layers[layers.length - 1].id
          }
        >
          Down
        </button>
        <button onClick={hideSelectedLayer} disabled={!selectedLayer}>
          {selectedLayer?.opacity === 0 ? "Show" : "Hide"}
        </button>
      </div>
      <ul>
        {layers.map((layer) => (
          <li
            key={layer.id}
            className={`${layer.id === selectedLayer?.id ? "bg-gray-200" : ""}`}
            onClick={() => selectLayerInCanvas(layer.id)}
          >
            {layer.type}({layer.zIndex})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Layer;
