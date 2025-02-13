import React from "react";
import { createTemplate } from "../utils/createTemplate";
import { dataForTemplateGeneration } from "../constants/dataForTemplateGeneration";
import { dataForTemplateGeneration2 } from "../constants/dataForTemplateGeneration2";

const CreateTemplate = ({ onImportJSON }) => {
  const createTemplateHandler = () => {
    const jsonData = createTemplate(dataForTemplateGeneration2);
    onImportJSON(jsonData);
  };

  return (
    <button
      className="px-2 py-1 rounded bg-gray-600 text-white text-xs font-bold"
      onClick={createTemplateHandler}
    >
      Create Template
    </button>
  );
};

export default CreateTemplate;
