import React, { useEffect, useState } from "react";
import * as fabric from "fabric";

const Group = ({ canvas }) => {
  const [showGroupButton, setShowGroupButton] = useState(false);
  const [showUngroupButton, setShowUngroupButton] = useState(false);

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length > 1) {
        setShowGroupButton(true);
        setShowUngroupButton(false);
      } else if (
        activeObjects.length === 1 &&
        activeObjects[0].type === "group"
      ) {
        setShowGroupButton(false);
        setShowUngroupButton(true);
      } else {
        setShowGroupButton(false);
        setShowUngroupButton(false);
      }
    };

    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:cleared", () => {
      setShowGroupButton(false);
      setShowUngroupButton(false);
    });

    return () => {
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:cleared");
    };
  }, [canvas]);

  const groupObjects = () => {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 1) {
      const group = new fabric.Group(activeObjects, {
        isErasable: true, // Set isErasable property to true for the group
      });
      canvas.discardActiveObject();
      activeObjects.forEach((obj) => canvas.remove(obj));
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.requestRenderAll();
    }
  };

  // const ungroupObjects = () => {
  //   const activeObject = canvas.getActiveObject();
  //   if (activeObject && activeObject.type === "group") {
  //     const objects = activeObject.getObjects();
  //     canvas.remove(activeObject);

  //     objects.forEach((obj) => {
  //       // Restore original properties and ensure visibility and selectability
  //       obj.set({
  //         left: obj.left,
  //         top: obj.top,
  //         angle: obj.angle,
  //         visible: true,
  //         selectable: true,
  //         opacity: 1,
  //       });
  //       canvas.add(obj);
  //     });

  //     // Ensure canvas is updated after modifications
  //     canvas.renderAll();
  //   }
  // };

  return (
    <div className="space-y-2 text-center">
      {showGroupButton && (
        <button
          onClick={groupObjects}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Group
        </button>
      )}
      {/* {showUngroupButton && (
        <button
          onClick={ungroupObjects}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Ungroup
        </button>
      )} */}
    </div>
  );
};

export default Group;
