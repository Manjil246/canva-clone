import React, { useState, useEffect, useRef } from "react";
import * as fabric from "fabric";
import axios from "axios";
import WebFont from "webfontloader";
import TextWithEdits from "./TextWithEdits";
import Dialog from "../utils/Dialog";
import { googleFonts } from "../constants/googleFonts";

const Text = ({ canvas }) => {
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [textValue, setTextValue] = useState("Normal Text");
  const [fontSize, setFontSize] = useState(20);
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("");
  const [lineHeight, setLineHeight] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0.2);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textAlign, setTextAlign] = useState("center");
  const [fonts, setFonts] = useState([]);
  const [listStyle, setListStyle] = useState("none");
  const [previousListStyle, setPreviousListStyle] = useState("none");
  const [edits, setEdits] = useState([]);
  const [rephraseOptions, setRephraseOptions] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [grammarlyDialog, setGrammarlyDialog] = useState(false);
  const [hasBackground, setHasBackground] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGrammarlyClose = () => setGrammarlyDialog(false);

  const handleBlur = (e) => {
    setTextValue(e.target.value); // Update state when the user leaves the textarea
    updateActiveText("text", e.target.value); // Send the value to the parent or canvas
  };

  const handleCloseDialog = () => setDialog(false);
  const editableDivRef = useRef(null);

  useEffect(() => {
    if (grammarlyDialog && editableDivRef.current) {
      editableDivRef.current.focus(); // Programmatically focus the editable div
    }
  }, [grammarlyDialog]);

  const fetchFonts = async () => {
    try {
      // Load Google Fonts using Web Font Loader
      setLoading(true);
      const loadBatch = (fonts, index) => {
        return new Promise((resolve, reject) => {
          WebFont.load({
            google: {
              families: fonts,
            },
            active: () => {
              console.log("Batch loaded successfully:", index);
              resolve();
            },
            inactive: (error) => {
              console.error("Batch loading failed:", error);
              reject(error);
            },
          });
        });
      };

      // Split fonts into batches
      const batch1 = googleFonts.slice(0, 600);
      const batch2 = googleFonts.slice(600, 1200);
      const batch3 = googleFonts.slice(1200);

      // Load batches in series
      await loadBatch(batch1, 1);
      // await loadBatch(batch2, 2);
      // await loadBatch(batch3, 3);

      // Add custom fonts after Google Fonts
      const customFonts = [
        "Times New Roman",
        "Arial",
        "Assistant",
        "Avenir",
        "Bahnschrift",
        "Baskerville",
        "Bodoni",
        "Bookman Old Style",
        "Calibri",
        "Century Gothic",
        "Covington",
        "Franklin Gothic",
        "Garamond",
        "Georgia",
        "Gill Sans MT",
        "Harrington",
        "Impact",
        "Khand",
        "Kunstler Script",
        "Lato",
        "Lucida Fax",
        "Malgun Gothic",
        "Palatino Linotype",
        "Perpetua",
        "Nirmala UI",
        "Rockwell",
        "Segoe UI",
        "Sitka Banner",
        "Stencil",
        "Tahoma",
        "Yu Gothic",
        "Playfair Display",
        "Montserrat",
        "Roboto",
        "Merriweather",
        "Spectral",
        "Lexend",
        "Lora",
        "Nunito",
        "Oswald",
        "Verdana",
        "Madina",
        "Parisienne",
        "Darleston",
        "Caviar Dreams",
        "Gontserrat",
        "Ragna",
        "Code",
      ];

      const allFonts = [...googleFonts.slice(0, 600), ...customFonts].sort();
      console.log("All fonts loaded successfully.");
      setFonts(allFonts);

      //Getting fonts from s3 bucket
      // const fontStyle = document.createElement('style');
      // fontStyle.textContent = `
      //   @font-face {
      //     font-family: 'PlaywriteIEGuides-Regular';
      //     src: url('https://d1til5nimponbk.cloudfront.net/fonts/PlaywriteIEGuides-Regular.ttf') format('truetype');
      //   }
      // `;
      // document.head.appendChild(fontStyle);

      // setFonts(["Times New Roman","PlaywriteIEGuides-Regular"]);
    } catch (error) {
      console.error("Error loading fonts:", error);
    } finally {
      console.log("Setting loading to false.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  const applyBoldToRange = (textObject, start, end) => {
    if (!textObject || !textObject.styles) return;

    const lines = textObject.text.split("\n");
    let charIndex = 0;

    lines.forEach((line, lineIndex) => {
      for (let i = 0; i < line.length; i++) {
        if (charIndex >= start && charIndex < end) {
          textObject.styles[lineIndex] = textObject.styles[lineIndex] || {};
          textObject.styles[lineIndex][i] = {
            ...textObject.styles[lineIndex][i],
            fontWeight: "bold",
          };
        }
        charIndex++;
      }
      charIndex++; // Account for the newline character
    });

    textObject.set("dirty", true);
    textObject.setCoords();
    canvas.requestRenderAll();
  };

  const applyUnboldToRange = (textObject, start, end) => {
    if (!textObject || !textObject.styles) return;

    const lines = textObject.text.split("\n");
    let charIndex = 0;

    lines.forEach((line, lineIndex) => {
      for (let i = 0; i < line.length; i++) {
        if (charIndex >= start && charIndex < end) {
          textObject.styles[lineIndex] = textObject.styles[lineIndex] || {};
          textObject.styles[lineIndex][i] = {
            ...textObject.styles[lineIndex][i],
            fontWeight: "normal",
          };
        }
        charIndex++;
      }
      charIndex++; // Account for the newline character
    });

    textObject.set("dirty", true);
    textObject.setCoords();
    canvas.requestRenderAll();
  };

  const applyItalicToRange = (textObject, start, end) => {
    if (!textObject || !textObject.styles) return;

    const lines = textObject.text.split("\n");
    let charIndex = 0;

    lines.forEach((line, lineIndex) => {
      for (let i = 0; i < line.length; i++) {
        if (charIndex >= start && charIndex < end) {
          textObject.styles[lineIndex] = textObject.styles[lineIndex] || {};
          textObject.styles[lineIndex][i] = {
            ...textObject.styles[lineIndex][i],
            fontStyle: "italic",
          };
        }
        charIndex++;
      }
      charIndex++; // Account for the newline character
    });

    textObject.set("dirty", true);
    textObject.setCoords();
    canvas.requestRenderAll();
  };

  const applyUnitalicToRange = (textObject, start, end) => {
    if (!textObject || !textObject.styles) return;

    const lines = textObject.text.split("\n");
    let charIndex = 0;

    lines.forEach((line, lineIndex) => {
      for (let i = 0; i < line.length; i++) {
        if (charIndex >= start && charIndex < end) {
          textObject.styles[lineIndex] = textObject.styles[lineIndex] || {};
          textObject.styles[lineIndex][i] = {
            ...textObject.styles[lineIndex][i],
            fontStyle: "normal",
          };
        }
        charIndex++;
      }
      charIndex++; // Account for the newline character
    });

    textObject.set("dirty", true);
    textObject.setCoords();
    canvas.requestRenderAll();
  };

  const applyUnderlineToRange = (textObject, start, end) => {
    if (!textObject || !textObject.styles) return;

    const lines = textObject.text.split("\n");
    let charIndex = 0;

    lines.forEach((line, lineIndex) => {
      for (let i = 0; i < line.length; i++) {
        if (charIndex >= start && charIndex < end) {
          textObject.styles[lineIndex] = textObject.styles[lineIndex] || {};
          textObject.styles[lineIndex][i] = {
            ...textObject.styles[lineIndex][i],
            underline: true,
          };
        }
        charIndex++;
      }
      charIndex++; // Account for the newline character
    });

    textObject.set("dirty", true);
    textObject.setCoords();
    canvas.requestRenderAll();
  };

  const applyNonUnderlineToRange = (textObject, start, end) => {
    if (!textObject || !textObject.styles) return;

    const lines = textObject.text.split("\n");
    let charIndex = 0;

    lines.forEach((line, lineIndex) => {
      for (let i = 0; i < line.length; i++) {
        if (charIndex >= start && charIndex < end) {
          textObject.styles[lineIndex] = textObject.styles[lineIndex] || {};
          textObject.styles[lineIndex][i] = {
            ...textObject.styles[lineIndex][i],
            underline: false,
          };
        }
        charIndex++;
      }
      charIndex++; // Account for the newline character
    });

    textObject.set("dirty", true);
    textObject.setCoords();
    canvas.requestRenderAll();
  };

  const updateActiveText = (property, value) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      const selectionStart = activeObject.selectionStart;
      const selectionEnd = activeObject.selectionEnd;
      if (selectionStart !== selectionEnd) {
        if (property === "fontWeight") {
          if (fontWeight === "bold") {
            applyUnboldToRange(activeObject, selectionStart, selectionEnd);
          } else {
            applyBoldToRange(activeObject, selectionStart, selectionEnd);
          }
        } else if (property === "fontStyle") {
          if (fontStyle === "italic") {
            applyUnitalicToRange(activeObject, selectionStart, selectionEnd);
          } else {
            applyItalicToRange(activeObject, selectionStart, selectionEnd);
          }
        } else if (property === "underline") {
          if (textDecoration === "underline") {
            applyNonUnderlineToRange(
              activeObject,
              selectionStart,
              selectionEnd
            );
          } else {
            applyUnderlineToRange(activeObject, selectionStart, selectionEnd);
          }
        } else {
          const styles = activeObject.styles || {};
          for (let i = selectionStart; i < selectionEnd; i++) {
            styles[0] = styles[0] || {};
            styles[0][i] = styles[0][i] || {};
            styles[0][i][property] = value;
          }
          activeObject.set("styles", styles);
        }
      } else {
        activeObject.set(property, value);
      }
      activeObject.setCoords(); // Update the coordinates
      activeObject.set({
        width: activeObject.calcTextWidth() + 1, // Adjust width to fit text
        height: activeObject.calcTextHeight() + 1, // Adjust height to fit text
      });
      canvas.requestRenderAll();
    }
    if (property === "letterSpacing") {
      activeObject.set("charSpacing", value * 1000);
    }
  };

  const detectTextStyles = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      const selectionStart = activeObject.selectionStart;
      const selectionEnd = activeObject.selectionEnd;
      if (selectionStart !== selectionEnd) {
        const styles = activeObject.styles || {};
        let isBold = false;
        let isItalic = false;
        let isUnderline = false;

        const lines = activeObject.text.split("\n");
        let charIndex = 0;

        lines.forEach((line, lineIndex) => {
          for (let i = 0; i < line.length; i++) {
            if (charIndex >= selectionStart && charIndex < selectionEnd) {
              const charStyle =
                styles[lineIndex] && styles[lineIndex][i]
                  ? styles[lineIndex][i]
                  : {};
              if (charStyle.fontWeight === "bold") isBold = true;
              if (charStyle.fontStyle === "italic") isItalic = true;
              if (charStyle.underline) isUnderline = true;
            }
            charIndex++;
          }
          charIndex++; // Account for the newline character
        });

        setFontWeight(isBold ? "bold" : "normal");
        setFontStyle(isItalic ? "italic" : "normal");
        setTextDecoration(isUnderline ? "underline" : "");
      }
    }
  };

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject.type === "textbox") handleModified();
      setIsTextSelected(activeObject && activeObject.type === "textbox");
      detectTextStyles();
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
        detectTextStyles();
      }
    };

    const handleSelectionChanged = () => {
      detectTextStyles();
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setIsTextSelected(false));
    canvas.on("object:modified", handleModified);
    canvas.on("text:changed", handleModified);
    canvas.on("text:selection:changed", handleSelectionChanged);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", () => setIsTextSelected(false));
      canvas.off("object:modified", handleModified);
      canvas.off("text:changed", handleModified);
      canvas.off("text:selection:changed", handleSelectionChanged);
    };
  }, [canvas]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "b":
          case "B":
            e.preventDefault();
            const newWeight = fontWeight === "bold" ? "normal" : "bold";
            setFontWeight(newWeight);
            updateActiveText("fontWeight", newWeight);
            break;
          case "i":
          case "I":
            e.preventDefault();
            const newStyle = fontStyle === "italic" ? "normal" : "italic";
            setFontStyle(newStyle);
            updateActiveText("fontStyle", newStyle);
            break;
          case "u":
          case "U":
            e.preventDefault();
            const isUnderline = textDecoration === "underline";
            setTextDecoration(isUnderline ? "" : "underline");
            updateActiveText("underline", !isUnderline);
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [fontWeight, fontStyle, textDecoration, canvas]);

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
        letterSpacing,
        fontFamily,
        fill: textColor,
        editable: true,
        textAlign: "center",
        backgroundColor: hasBackground ? backgroundColor : null,
        styles: {},
      });
      canvas.add(text);
      canvas.setActiveObject(text);
    }
  };

  useEffect(() => {
    if (canvas) {
      if (hasBackground) {
        updateActiveText("backgroundColor", null);
      } else {
        updateActiveText("backgroundColor", backgroundColor);
      }
    }
  }, [hasBackground]);

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
      // console.log(JSON.stringify(data, null, 2));
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
      // console.log(JSON.stringify(data, null, 2));
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

  if (loading) {
    return (
      <div className="border border-gray-300 rounded text-xs w-[400px] text-center">
        <h3 className="text-xs font-semibold mb-2">Loading fonts...</h3>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded text-xs w-[400px] text-center">
      <h3 className="text-xs font-semibold mb-2">Add and Edit Text</h3>

      {/* Add Text Buttons */}
      <div>
        <button
          className="px-2 py-1 bg-blue-600 text-white rounded-lg text-sx mr-2"
          onClick={addText}
        >
          Add Text
        </button>
      </div>

      {/* Formatting Options (Only visible if text is selected) */}
      {isTextSelected && (
        <div className="flex flex-col items-center">
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
                style={{ fontFamily: fontFamily }}
                className="ml-2 border border-gray-300 rounded px-2 py-1"
              >
                {fonts.map((font, index) => (
                  <option key={index} value={font} style={{ fontFamily: font }}>
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
            Letter Spacing:
            <input
              type="number"
              value={letterSpacing}
              step={0.05}
              onChange={(e) => {
                const spacingValue = parseFloat(e.target.value);
                setLetterSpacing(spacingValue);
                updateActiveText("letterSpacing", spacingValue);
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

          <div className="flex">
            <button
              className={`px-4 py-2 border rounded mr-2 font-bold ${
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
              className={`px-4 py-2 border rounded mr-2 italic ${
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
              className={`px-4 py-2 border rounded mr-2 underline ${
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
          </div>

          <div className="flex">
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
          </div>
          <div className="flex">
            <label className="block mb-2">
              Text Alignment:
              <select
                value={textAlign}
                onChange={(e) => {
                  setTextAlign(e.target.value);
                  updateActiveText("textAlign", e.target.value);
                }}
              >
                <option value="center">Center</option>
                <option value="left">Left</option>
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
            <button
              onClick={() => setHasBackground(!hasBackground)}
              className=" bg-blue-600 text-white rounded-lg w-fit m-auto"
            >
              Toggle Background
            </button>
          </div>
        </div>
      )}

      {canvas &&
        canvas.getActiveObject() &&
        canvas.getActiveObject().type === "textbox" && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-2"
            onClick={() => setDialog(true)}
          >
            Apply Sapling Edits
          </button>
        )}
      {canvas &&
        canvas.getActiveObject() &&
        canvas.getActiveObject().type === "textbox" && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-2"
            onClick={() => setGrammarlyDialog(true)}
          >
            Apply Grammarly Extension
          </button>
        )}
      {dialog && (
        <Dialog onClose={handleCloseDialog}>
          <>
            <TextWithEdits text={textValue} edits={edits} />
            {rephraseOptions && rephraseOptions.length > 0 && (
              <>
                <div className="text-lg font-bold">
                  Select a rephrase option:
                </div>
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
        </Dialog>
      )}
      {grammarlyDialog && (
        <Dialog onClose={handleGrammarlyClose}>
          <div
            ref={editableDivRef} // Attach ref to the editable div
            contentEditable={true}
            suppressContentEditableWarning={true} // Suppress React warning for contentEditable
            onInput={(e) => setTextValue(e.currentTarget.textContent)} // Update textValue dynamically
            className="p-2 border border-gray-300 rounded"
          >
            {textValue}
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Text;
