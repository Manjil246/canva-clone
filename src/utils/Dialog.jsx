import React from "react";

const Dialog = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-700"
        >
          &times;
        </button>
        {/* Dialog content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
