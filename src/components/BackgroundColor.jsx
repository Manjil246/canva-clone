const BackgroundColor = ({ canvas, setBgColor }) => {
  const handleColorChange = (e) => {
    const value = e.target.value;

    if (canvas) {
      canvas.backgroundColor = value;
      setBgColor(value);
      canvas.renderAll();
      canvas.requestRenderAll();
    }
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
