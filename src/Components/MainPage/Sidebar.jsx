import PropTypes from 'prop-types';
import React, { useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/solid";

const Sidebar = ({ calendars, currentIndex, setCurrentIndex, createNewCalendar, updateCalendarName, isCollapsed, setIsCollapsed }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempName, setTempName] = useState("");

  const handleNameEdit = (index, name) => {
    setEditingIndex(index);
    setTempName(name || `Calendar ${index + 1}`);
  };

  const handleNameSave = (index) => {
    updateCalendarName(index, tempName);
    setEditingIndex(null);
  };

  const handleBlur = (index) => {
    handleNameSave(index);
  };

  const handleKeyPress = (e, index) => {
    if (e.key === "Enter") {
      handleNameSave(index);
    }
  };

  return (
    <aside className={`fixed left-0 h-[calc(100vh-80px)] bg-lewisRedDarker text-white flex flex-col
      transition-all duration-200 ${ isCollapsed ? "w-12" : "w-58" }`}>
      
      {/* Sidebar Title */}
      <div className="bg-accent flex justify-center">
        <CalendarIcon className="w-7 h-7"/>
        <h2 className={`flex text-xl font-semibold transition-all duration-200 ${isCollapsed ? "hidden" : "block"}`}>
          Your Calendars
        </h2>
      </div>

      {/* Create New Calendar Button */}
      <div className="font-semibold">
        <button onClick={createNewCalendar} className="w-full py-1 bg-accent transition text-white">
          {isCollapsed ? "+" : "+ Create Calendar"}
        </button>
      </div>

      {/* Calendar List */}
      <div className="flex flex-col flex-grow">
        {calendars.map((calendar, index) => (
          <div
            key={index}
            className={`flex p-2 items-center gap-2 transition duration-200 cursor-pointer
              ${currentIndex === index ? "bg-lewisRed" : "bg-lewisRedDarker"}`}
            onClick={() => setCurrentIndex(index)}
            onDoubleClick={() => handleNameEdit(index, calendar.className)}
            style={{ height: "40px" }}
          >
            {!isCollapsed && (
              editingIndex === index ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={() => handleBlur(index)}
                  onKeyDown={(e) => handleKeyPress(e, index)}
                  autoFocus
                  className="bg-gray-50 text-black p-2 w-full text-sm"
                />
              ) : (
                <span>{calendar.className || `Calendar ${index + 1}`}</span>
              )
            )}
          </div>
        ))}
      </div>

      {/* Sidebar Toggle */}
      <button onClick={() => setIsCollapsed(!isCollapsed)}
        className="text-white py-2 bg-accent transition w-full"
      >
        {isCollapsed ? "▶" : "◀"}
      </button>
    </aside>
  );
};

Sidebar.propTypes = {
  calendars: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentIndex: PropTypes.number.isRequired,
  setCurrentIndex: PropTypes.func.isRequired,
  createNewCalendar: PropTypes.func.isRequired,
  updateCalendarName: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default Sidebar;
