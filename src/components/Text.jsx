import React, { useState, useEffect } from "react";
import * as fabric from "fabric";

const Text = ({ canvas }) => {
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [textValue, setTextValue] = useState("Sample Text");
  const [fontSize, setFontSize] = useState(20);
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [listType, setListType] = useState("");

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      setIsTextSelected(activeObject && activeObject.type === "textbox");
    };

    const handleModified = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        const effectiveFontSize =
          Math.ceil(
            activeObject.fontSize *
              Math.min(activeObject.scaleY, activeObject.scaleX)
          ) || 20;
        setTextValue(activeObject.text || "");
        setFontSize(effectiveFontSize);
        setFontWeight(activeObject.fontWeight || "normal");
        setFontStyle(activeObject.fontStyle || "normal");
        setTextDecoration(activeObject.underline ? "underline" : "");
        setFontFamily(activeObject.fontFamily || "Arial");
        setTextColor(activeObject.fill || "#000000");
        activeObject.set({
          scaleX: 1,
          scaleY: 1,
          fontSize: effectiveFontSize,
        });
        canvas.requestRenderAll();
      }
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setIsTextSelected(false));
    canvas.on("object:modified", handleModified);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared");
      canvas.off("object:modified", handleModified);
    };
  }, [canvas]);

  const addText = (type) => {
    if (canvas) {
      const text = new fabric.Textbox(
        type === "Heading" ? "Heading Text" : "Normal Text",
        {
          left: 100,
          top: 100,
          fontSize: type === "Heading" ? 30 : 20,
          fontWeight: type === "Heading" ? "bold" : "normal",
          fontStyle,
          underline: textDecoration === "underline",
          lineHeight,
          fontFamily,
          fill: textColor,
          editable: true,
        }
      );
      canvas.add(text);
      canvas.setActiveObject(text);
      if (listType) {
        text.on("changed", handleListBehavior);
      }
    }
  };

  const updateActiveText = (property, value) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set(property, value);
      canvas.renderAll();
    }
  };

  const handleListBehavior = (e) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      const textLines = activeObject.text.split("\n");
      const updatedLines = textLines.map((line, index) => {
        if (listType === "bullet") {
          return line.startsWith("• ") ? line : `• ${line.trim()}`;
        }
        if (listType === "number") {
          return line.match(/^\d+\./) ? line : `${index + 1}. ${line.trim()}`;
        }
        return line;
      });

      activeObject.text = updatedLines.join("\n");
      canvas.renderAll();
    }
  };

  const enableListType = (type) => {
    setListType((prev) => (prev === type ? "" : type));
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      const textLines = activeObject.text.split("\n");
      const updatedLines = textLines.map((line, index) => {
        if (type === "bullet") {
          return `• ${line.trim()}`;
        }
        if (type === "number") {
          return `${index + 1}. ${line.trim()}`;
        }
        return line;
      });

      activeObject.text = updatedLines.join("\n");
      canvas.renderAll();
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h3 className="text-lg font-semibold mb-2">Add and Edit Text</h3>

      {/* Add Text/Heading Buttons */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
          onClick={() => addText("Normal")}
        >
          Add Text
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => addText("Heading")}
        >
          Add Heading
        </button>
      </div>

      {/* Formatting Options (Only visible if text is selected) */}
      {isTextSelected && (
        <>
          <label className="block mb-2">
            Text:
            <input
              type="text"
              value={textValue}
              onChange={(e) => {
                setTextValue(e.target.value);
                updateActiveText("text", e.target.value);
              }}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
            />
          </label>

          <label className="block mb-2">
            Font Family:
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                updateActiveText("fontFamily", e.target.value);
              }}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
            </select>
          </label>

          <label className="block mb-2">
            Font Size:
            <input
              type="number"
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value);
                updateActiveText("fontSize", parseInt(e.target.value, 10));
              }}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
            />
          </label>

          <label className="block mb-2">
            Line Height:
            <input
              type="number"
              value={lineHeight}
              step={0.1}
              onChange={(e) => {
                setLineHeight(e.target.value);
                updateActiveText("lineHeight", parseFloat(e.target.value));
              }}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
            />
          </label>

          <button
            className={`px-4 py-2 border rounded mr-2 ${
              fontWeight === "bold" ? "bg-gray-300" : ""
            }`}
            onClick={() => {
              const newWeight = fontWeight === "bold" ? "normal" : "bold";
              setFontWeight(newWeight);
              updateActiveText("fontWeight", newWeight);
            }}
          >
            Bold
          </button>

          <button
            className={`px-4 py-2 border rounded mr-2 ${
              fontStyle === "italic" ? "bg-gray-300" : ""
            }`}
            onClick={() => {
              const newStyle = fontStyle === "italic" ? "normal" : "italic";
              setFontStyle(newStyle);
              updateActiveText("fontStyle", newStyle);
            }}
          >
            Italic
          </button>

          <button
            className={`px-4 py-2 border rounded mr-2 ${
              textDecoration === "underline" ? "bg-gray-300" : ""
            }`}
            onClick={() => {
              const isUnderline = textDecoration === "underline";
              setTextDecoration(isUnderline ? "" : "underline");
              updateActiveText("underline", !isUnderline);
            }}
          >
            Underline
          </button>

          <label className="block mb-2">
            Text Color:
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                updateActiveText("fill", e.target.value);
              }}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
            />
          </label>

          {isTextSelected && (
            <>
              <button
                className={`px-4 py-2 border rounded mr-2 ${
                  listType === "bullet" ? "bg-gray-300" : ""
                }`}
                onClick={() => enableListType("bullet")}
              >
                Bullets
              </button>
              <button
                className={`px-4 py-2 border rounded mr-2 ${
                  listType === "number" ? "bg-gray-300" : ""
                }`}
                onClick={() => enableListType("number")}
              >
                Numbering
              </button>

              <label className="block mb-2">
                Text Color:
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="ml-2 border border-gray-300 rounded px-2 py-1"
                />
              </label>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Text;
