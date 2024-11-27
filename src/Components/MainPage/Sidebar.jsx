import PropTypes from 'prop-types';
import React, { useState } from "react";

const Sidebar = ({ calendars, currentIndex, setCurrentIndex, createNewCalendar, updateCalendarName }) => {
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
    <aside className="w-64 bg-lewisRedDarker p-5 text-white flex flex-col">
      <h2 className="text-xl font-semibold mb-6">Your Calendars</h2>
      <div className="flex flex-col gap-4 flex-grow">
        {calendars.map((calendar, index) => (
          <div
            key={index}
            className={`relative w-full text-left p-2 rounded transition duration-200 ease-in-out ${currentIndex === index ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
          >
            {editingIndex === index ? (
              <div>
                <label
                  htmlFor={`calendar-input-${index}`}
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Edit Calendar Name
                </label>
                <input
                  type="text"
                  id={`calendar-input-${index}`}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={() => handleBlur(index)}
                  onKeyDown={(e) => handleKeyPress(e, index)}
                  autoFocus
                  style={{ color: 'black' }}
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs"
                />
              </div>
            ) : (
              <button
                className="w-full text-left"
                onClick={() => setCurrentIndex(index)}
                onDoubleClick={() => handleNameEdit(index, calendar.className)}
              >
                {calendar.className || `Calendar ${index + 1}`}
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        className="mt-6 bg-green-600 hover:bg-green-500 text-white p-2 w-full rounded transition duration-200"
        onClick={createNewCalendar}
      >
        + Create Calendar
      </button>
    </aside >
  );
};

Sidebar.propTypes = {
  calendars: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentIndex: PropTypes.number.isRequired,
  setCurrentIndex: PropTypes.func.isRequired,
  createNewCalendar: PropTypes.func.isRequired,
  updateCalendarName: PropTypes.func.isRequired,
};

export default Sidebar;
