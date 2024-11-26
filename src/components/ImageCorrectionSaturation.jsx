import React, { useState, useEffect } from "react";
import { filters } from "fabric";

const ImageCorrectionFilters = ({ canvas }) => {
  const [currentFilter, setCurrentFilter] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [filterParams, setFilterParams] = useState({
    brightness: 0,
    contrast: 0,
    blur: 0,
  });

  const selectableFilters = [
    { name: "None", value: null },
    { name: "Sepia", value: "sepia" },
    { name: "Vintage", value: "vintage" },
    { name: "Invert", value: "invert" },
    { name: "Polaroid", value: "polaroid" },
    { name: "Grayscale", value: "grayscale" },
    { name: "Technicolor", value: "technicolor" },
    { name: "Kodachrome", value: "kodachrome" },
    { name: "Noise", value: "noise" },
    { name: "Brownie", value: "brownie" },
    { name: "BlackWhite", value: "blackwhite" },
    { name: "Vibrance", value: "vibrance" },
  ];

  const getSelectedFilter = (filterType) => {
    switch (filterType) {
      case "sepia":
        return new filters.Sepia();
      case "vintage":
        return new filters.Vintage();
      case "invert":
        return new filters.Invert();
      case "polaroid":
        return new filters.Polaroid();
      case "grayscale":
        return new filters.Grayscale();
      case "technicolor":
        return new filters.Technicolor();
      case "kodachrome":
        return new filters.Kodachrome();
      case "noise":
        return new filters.Noise();
      case "brownie":
        return new filters.Brownie();
      case "blackwhite":
        return new filters.BlackWhite();
      case "vibrance":
        return new filters.Vibrance();
      default:
        return null;
    }
  };

  const getAdjustableFilter = (filterType, value) => {
    switch (filterType) {
      case "brightness":
        return new filters.Brightness({ brightness: value });
      case "contrast":
        return new filters.Contrast({ contrast: value });
      case "blur":
        return new filters.Blur({ blur: value });
      default:
        return null;
    }
  };

  const applyFilters = () => {
    if (!activeImage) return;

    // Apply adjustable filters
    const adjustableFilters = [
      getAdjustableFilter("brightness", filterParams.brightness),
      getAdjustableFilter("contrast", filterParams.contrast),
      getAdjustableFilter("blur", filterParams.blur),
    ];

    // Apply selectable filter
    const selectedFilter = getSelectedFilter(currentFilter);

    activeImage.filters = [
      ...adjustableFilters.filter(Boolean),
      ...(selectedFilter ? [selectedFilter] : []),
    ];

    activeImage.applyFilters();
    canvas.renderAll();
  };

  const handleParameterChange = (filterType, value) => {
    setFilterParams((prev) => {
      const updatedParams = { ...prev, [filterType]: value };
      if (activeImage) activeImage.set(`filterParams`, updatedParams);
      return updatedParams;
    });
  };

  const handleFilterChange = (event) => {
    setCurrentFilter(event.target.value);
    if (activeImage) activeImage.set(`currentFilter`, event.target.value);
  };

  useEffect(() => {
    if (!canvas) return;

    const handleSelectionChange = () => {
      const selectedObject = canvas.getActiveObject();

      if (selectedObject && selectedObject.isType("image")) {
        setIsImageSelected(true);
        setActiveImage(selectedObject);

        // Load previously stored filters or initialize new ones
        const storedParams = selectedObject.get(`filterParams`) || {
          brightness: 0,
          contrast: 0,
          blur: 0,
        };
        const storedFilter = selectedObject.get(`currentFilter`) || null;

        setFilterParams(storedParams);
        setCurrentFilter(storedFilter);
      } else {
        setIsImageSelected(false);
        setActiveImage(null);
      }
    };

    canvas.on("selection:created", handleSelectionChange);
    canvas.on("selection:updated", handleSelectionChange);
    canvas.on("selection:cleared", handleSelectionChange);

    return () => {
      canvas.off("selection:created", handleSelectionChange);
      canvas.off("selection:updated", handleSelectionChange);
      canvas.off("selection:cleared", handleSelectionChange);
    };
  }, [canvas]);

  useEffect(() => {
    applyFilters();
  }, [filterParams, currentFilter, activeImage]);

  const clearAllFilters = () => {
    if (!activeImage) return;

    // Reset all filters and parameters
    activeImage.filters = [];
    activeImage.set("filterParams", {
      brightness: 0,
      contrast: 0,
      blur: 0,
    });
    activeImage.set("currentFilter", null);

    // Update local states
    setFilterParams({
      brightness: 0,
      contrast: 0,
      blur: 0,
    });
    setCurrentFilter(null);

    // Apply and render changes
    activeImage.applyFilters();
    canvas.renderAll();
  };

  return (
    <div className="image-correction-container">
      {isImageSelected && (
        <>
          <h3>Apply Filters</h3>
          <select onChange={handleFilterChange} value={currentFilter || ""}>
            {selectableFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.name}
              </option>
            ))}
          </select>

          <div>
            <label>Brightness:</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={filterParams.brightness}
              onChange={(e) =>
                handleParameterChange("brightness", parseFloat(e.target.value))
              }
            />
          </div>
          <div>
            <label>Contrast:</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={filterParams.contrast}
              onChange={(e) =>
                handleParameterChange("contrast", parseFloat(e.target.value))
              }
            />
          </div>
          <div>
            <label>Blur:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={filterParams.blur}
              onChange={(e) =>
                handleParameterChange("blur", parseFloat(e.target.value))
              }
            />
          </div>
          <button
            onClick={() => clearAllFilters()}
            className="clear-all-button"
          >
            Clear All
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCorrectionFilters;
