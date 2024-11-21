import React from "react";

const TextWithEdits = ({ text, edits }) => {
  // Function to get the error part of the text
  const getHighlightedText = (text, edits) => {
    let lastIndex = 0;
    const segments = [];

    edits.forEach((edit) => {
      // Add text before the error part
      if (lastIndex < edit.start) {
        segments.push({
          text: text.slice(lastIndex, edit.start),
          isError: false,
        });
      }

      // Add the error part with red underline and suggestion on hover
      segments.push({
        text: text.slice(edit.start, edit.end),
        isError: true,
        suggestion: edit.replacement,
      });

      // Update the lastIndex
      lastIndex = edit.end;
    });

    // Add the remaining text after the last edit
    if (lastIndex < text.length) {
      segments.push({ text: text.slice(lastIndex), isError: false });
    }

    return segments;
  };

  // Render the highlighted text with error segments
  const renderText = () => {
    const highlightedSegments = getHighlightedText(text, edits);

    return highlightedSegments.map((segment, index) => (
      <span
        key={index}
        style={{
          textDecoration: segment.isError ? "underline" : "none",
          textDecorationColor: segment.isError ? "red" : "transparent",
          position: "relative",
          fontSize: "20px",
        }}
        title={segment.isError ? segment.suggestion : ""}
      >
        {segment.text}
      </span>
    ));
  };

  return <div>{renderText()}</div>;
};

export default TextWithEdits;
