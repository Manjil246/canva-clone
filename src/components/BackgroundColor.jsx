const BackgroundColor = ({ canvas }) => {
  const handleColorChange = (e) => {
    const value = e.target.value;
    if (canvas) {
      console.log("value----", value);
      canvas.backgroundColor = value;
      canvas.requestRenderAll();
    }
    // Update the canvas background color using Fabric.js
    // canvas.setBackgroundColor(value, canvas.renderAll.bind(canvas));
  };

  return (
    <div className="flex flex-col ">
      <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md cursor-pointer transition">
        Apply Bg color
        <input
          type="color"
          onChange={handleColorChange}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
};

export default BackgroundColor;
