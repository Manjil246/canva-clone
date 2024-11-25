// import React, { useEffect, useState } from "react";
// import * as fabric from "fabric";

// const Group = ({ canvas }) => {
//   const [showGroupButton, setShowGroupButton] = useState(false);
//   const [showUngroupButton, setShowUngroupButton] = useState(false);

//   useEffect(() => {
//     if (!canvas) return;

//     const handleSelection = () => {
//       const activeObjects = canvas.getActiveObjects();
//       if (activeObjects.length > 1) {
//         setShowGroupButton(true);
//         setShowUngroupButton(false);
//       } else if (
//         activeObjects.length === 1 &&
//         activeObjects[0].type === "group"
//       ) {
//         setShowGroupButton(false);
//         setShowUngroupButton(true);
//       } else {
//         setShowGroupButton(false);
//         setShowUngroupButton(false);
//       }
//     };

//     canvas.on("selection:updated", handleSelection);
//     canvas.on("selection:created", handleSelection);
//     canvas.on("selection:cleared", () => {
//       setShowGroupButton(false);
//       setShowUngroupButton(false);
//     });

//     return () => {
//       canvas.off("selection:updated", handleSelection);
//       canvas.off("selection:created", handleSelection);
//       canvas.off("selection:cleared");
//     };
//   }, [canvas]);

//   const groupObjects = () => {
//     const activeObjects = canvas.getActiveObjects();
//     if (activeObjects.length > 1) {
//       const group = new fabric.Group(activeObjects);
//       canvas.discardActiveObject();
//       activeObjects.forEach((obj) => canvas.remove(obj));
//       canvas.add(group);
//       canvas.setActiveObject(group);
//       canvas.renderAll();
//     }
//   };

//   const ungroupObjects = () => {
//     const activeObject = canvas.getActiveObject();
//     if (activeObject && activeObject.type === "group") {
//       const items = activeObject._objects; // Access objects within the group
//       activeObject._restoreObjectsState(); // Restore the individual object states
//       canvas.remove(activeObject); // Remove the group object from the canvas

//       // Add each item back to the canvas
//       items.forEach((item) => {
//         item.canvas = canvas; // Ensure each item has a reference to the canvas
//         canvas.add(item);
//       });

//       canvas.renderAll(); // Re-render the canvas
//     }
//   };

//   return (
//     <div className="space-y-2 text-center">
//       {showGroupButton && (
//         <button
//           onClick={groupObjects}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Group
//         </button>
//       )}
//       {showUngroupButton && (
//         <button
//           onClick={ungroupObjects}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           Ungroup
//         </button>
//       )}
//     </div>
//   );
// };

// export default Group;

// import React, { useEffect, useState } from "react";
// import * as fabric from "fabric";

// const Group = ({ canvas }) => {
//   const [showGroupButton, setShowGroupButton] = useState(false);
//   const [showUngroupButton, setShowUngroupButton] = useState(false);

//   useEffect(() => {
//     if (!canvas) return;

//     const handleSelection = () => {
//       const activeObjects = canvas.getActiveObjects();
//       if (activeObjects.length > 1) {
//         setShowGroupButton(true);
//         setShowUngroupButton(false);
//       } else if (
//         activeObjects.length === 1 &&
//         activeObjects[0].type === "group"
//       ) {
//         setShowGroupButton(false);
//         setShowUngroupButton(true);
//       } else {
//         setShowGroupButton(false);
//         setShowUngroupButton(false);
//       }
//     };

//     canvas.on("selection:updated", handleSelection);
//     canvas.on("selection:created", handleSelection);
//     canvas.on("selection:cleared", () => {
//       setShowGroupButton(false);
//       setShowUngroupButton(false);
//     });

//     return () => {
//       canvas.off("selection:updated", handleSelection);
//       canvas.off("selection:created", handleSelection);
//       canvas.off("selection:cleared");
//     };
//   }, [canvas]);

//   const groupObjects = () => {
//     const activeObjects = canvas.getActiveObjects();
//     if (activeObjects.length > 1) {
//       const group = new fabric.Group(activeObjects);
//       canvas.discardActiveObject();
//       activeObjects.forEach((obj) => canvas.remove(obj));
//       canvas.add(group);
//       canvas.setActiveObject(group);
//       canvas.renderAll();
//     }
//   };

//   const ungroupObjects = () => {
//     const activeObject = canvas.getActiveObject();

//     if (activeObject && activeObject.type === "group") {
//       const items = activeObject.getObjects(); // Get objects in the group
//       canvas.remove(activeObject); // Remove the group from the canvas

//       // Add each item back to the canvas
//       items.forEach((item) => {
//         item.set("active", false); // Clear active state for each item
//         canvas.add(item);
//       });

//       canvas.renderAll(); // Refresh canvas to reflect changes
//       canvas.discardActiveObject(); // Clear any lingering selection
//     }
//   };

//   return (
//     <div className="space-y-2 text-center">
//       {showGroupButton && (
//         <button
//           onClick={groupObjects}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Group
//         </button>
//       )}
//       {showUngroupButton && (
//         <button
//           onClick={ungroupObjects}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           Ungroup
//         </button>
//       )}
//     </div>
//   );
// };

// export default Group;
