import * as fabric from "fabric";

export class GrammarTextbox extends fabric.Textbox {
  constructor(text, options) {
    super(text, options);
    this.errors = []; // Array to store error data: { startIndex, endIndex, message }
  }

  setErrors(errors) {
    this.errors = errors;
    this.dirty = true; // Mark object for re-rendering
  }

  _render(ctx) {
    super._render(ctx);

    if (!this.errors || this.errors.length === 0) return;

    const textLines = this.text.split("\n");
    const lineHeight = this.lineHeight * this.fontSize;
    const charWidth = this.fontSize / 2; // Approximation for width of each character

    ctx.save();
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)"; // Highlight color
    ctx.strokeStyle = "red"; // Underline color
    ctx.lineWidth = 1;

    this.errors.forEach((error) => {
      const startIndex = error.startIndex;
      const endIndex = error.endIndex;

      let charIndex = 0;
      textLines.forEach((line, lineIndex) => {
        const lineStart = charIndex;
        const lineEnd = charIndex + line.length;

        if (endIndex >= lineStart && startIndex <= lineEnd) {
          const highlightStart = Math.max(startIndex - lineStart, 0);
          const highlightEnd = Math.min(endIndex - lineStart, line.length);

          const xStart = highlightStart * charWidth;
          const xEnd = highlightEnd * charWidth;
          const y = lineIndex * lineHeight;

          // Draw red underline
          ctx.beginPath();
          ctx.moveTo(xStart, y + lineHeight - 2); // Adjust underline position
          ctx.lineTo(xEnd, y + lineHeight - 2);
          ctx.stroke();

          // Optional: Highlight the text
          ctx.fillRect(xStart, y, xEnd - xStart, lineHeight);
        }

        charIndex += line.length + 1; // +1 for the newline character
      });
    });

    ctx.restore();
  }
}
