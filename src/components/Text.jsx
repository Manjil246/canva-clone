import React, { useState, useEffect } from "react";
import * as fabric from "fabric";
import axios from "axios";
import WebFont from "webfontloader";
import TextWithEdits from "./TextWithEdits";

const Text = ({ canvas }) => {
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [textValue, setTextValue] = useState("Normal Text");
  const [fontSize, setFontSize] = useState(20);
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textAlign, setTextAlign] = useState("left");
  const [fonts, setFonts] = useState([]);
  const [listStyle, setListStyle] = useState("none");
  const [previousListStyle, setPreviousListStyle] = useState("none");
  const [edits, setEdits] = useState([]);
  const [rephraseOptions, setRephraseOptions] = useState([]);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        // Example: Fetch Google Fonts or use a static list
        const response = await axios.get(
          "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyChVtk1O-m1sCVqnSBVrLBXh89H-bQCvvw"
        );

        const fontList = response.data.items.map((font) => font.family);
        setFonts(fontList);
      } catch (error) {
        console.error("Error fetching fonts:", error);
      }
    };

    fetchFonts();
  }, []);

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject.type === "textbox") handleModified();
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
    canvas.on("text:changed", handleModified);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared");
      canvas.off("object:modified", handleModified);
      canvas.on("text:changed", handleModified);
    };
  }, [canvas]);

  const addText = () => {
    if (canvas) {
      const text = new fabric.Textbox("Normal Text", {
        left: 100,
        top: 100,
        fontSize: 20,
        fontWeight: "normal",
        fontStyle,
        underline: textDecoration === "underline",
        lineHeight,
        fontFamily,
        fill: textColor,
        editable: true,
        textAlign: "left",
        backgroundColor: "#ffffff",
      });
      canvas.add(text);
      canvas.setActiveObject(text);
    }
  };

  const updateActiveText = (property, value) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      if (property === "fontFamily") {
        // Load the font using Web Font Loader
        WebFont.load({
          google: {
            families: [value], // Font family to load
          },
          active: () => {
            // Font is loaded, apply it to the canvas object
            activeObject.set(property, value);
            canvas.renderAll();
          },
          inactive: () => {
            console.error(`Failed to load the font: ${value}`);
          },
        });
      } else {
        activeObject.set(property, value);
        canvas.renderAll();
      }
    }
  };

  const formatListText = (text, style) => {
    let lines = text.split("\n");
    if (style === "bullets") {
      if (previousListStyle === "bullets") return text;
      if (previousListStyle === "numbered")
        lines = lines.map((line) => line.replace(/^[•\d.]+\s/, ""));
      return lines.map((line) => `• ${line}`).join("\n");
    } else if (style === "numbered") {
      if (previousListStyle === "numbered") return text;
      if (previousListStyle === "bullets")
        lines = lines.map((line) => line.replace(/^[•\d.]+\s/, ""));
      return lines.map((line, index) => `${index + 1}. ${line}`).join("\n");
    } else {
      return lines.map((line) => line.replace(/^[•\d.]+\s/, "")).join("\n");
    }
  };

  useEffect(() => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        const formattedText = formatListText(
          activeObject.text || "",
          listStyle
        );
        activeObject.set("text", formattedText);
        canvas.renderAll();
      }
    }
  }, [listStyle]);

  const handleListStyleChange = (style) => {
    setPreviousListStyle(listStyle);
    setListStyle(style);
  };

  const checkGrammar = async (text) => {
    try {
      const response = await axios.post(
        "https://api.sapling.ai/api/v1/edits", // Sapling API endpoint
        {
          key: "IQD4TFNJFM0OSRVE9KRIEDVPBE3WK76U",
          session_id: "test session",
          text,
          advanced_edits: { advanced_edits: true },
        }
      );
      const { data } = response;
      setEdits(data.edits);
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      const { msg } = err.response.data;
      console.error({ err: msg });
    }
  };
  const checkParaphase = async (text) => {
    try {
      const response = await axios.post(
        "https://api.sapling.ai/api/v1/paraphrase", // Sapling API endpoint
        {
          key: "IQD4TFNJFM0OSRVE9KRIEDVPBE3WK76U",
          session_id: "test session",
          text,
          advanced_edits: { advanced_edits: true },
        }
      );
      const { data } = response;
      setRephraseOptions(data.results);
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      const { msg } = err.response.data;
      console.error({ err: msg });
    }
  };

  useEffect(() => {
    if (textValue) {
      checkGrammar(textValue);
      checkParaphase(textValue);
    }
  }, [textValue]);

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h3 className="text-lg font-semibold mb-2">Add and Edit Text</h3>

      {/* Add Text Buttons */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
          onClick={addText}
        >
          Add Text
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

          {/* Font Selection */}
          {isTextSelected && (
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
                {fonts.map((font, index) => (
                  <option key={index} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </label>
          )}
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
          <label className="block mb-2">
            Background Color:
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => {
                setBackgroundColor(e.target.value);
                updateActiveText("backgroundColor", e.target.value);
              }}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
            />
          </label>
          <label className="block mb-2">
            Text Alignment:
            <select
              value={textAlign}
              onChange={(e) => {
                setTextAlign(e.target.value);
                updateActiveText("textAlign", e.target.value);
              }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>
          <label className="block mb-2">
            List Style:
            <select
              value={listStyle}
              onChange={(e) => handleListStyleChange(e.target.value)}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
            >
              <option value="none">None</option>
              <option value="bullets">Bullets</option>
              <option value="numbered">Numbered</option>
            </select>
          </label>
          <TextWithEdits text={textValue} edits={edits} />
          {rephraseOptions && rephraseOptions.length > 0 && (
            <>
              <div className="text-lg font-bold">Select a rephrase option:</div>
              <ul type="list-decimal pl-5 space-y-2">
                {rephraseOptions.map((option, index) => (
                  <li key={index} className="text-left text-lg">
                    + {option.replacement}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Text;
