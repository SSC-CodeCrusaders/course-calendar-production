import React from "react";

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative flex items-center group">
      {/* Child element, e.g., a button */}
      {children}

      {/* Tooltip */}
      <div className="bg-red-900 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-700 text-white text-sm rounded-lg px-4 py-2 shadow-lg w-64">

        {text}
      </div>
    </div>
  );
};

export default Tooltip;
