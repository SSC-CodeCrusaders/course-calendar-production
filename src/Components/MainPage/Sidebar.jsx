// Sidebar.js
import React from 'react';

const Sidebar = ({ calendars, currentIndex, setCurrentIndex, createNewCalendar }) => (
  <aside className="w-64 bg-lewisred p-5 text-white h-screen overflow-y-auto">
    <h2 className="text-xl font-semibold mb-6">Your Calendars</h2>
    <div className="flex flex-col gap-4">
      {calendars.map((_, index) => (
        <button
          key={index}
          className={`block w-full text-left p-2 rounded transition duration-200 ease-in-out ${
            currentIndex === index ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setCurrentIndex(index)}
        >
          Calendar {index + 1}
        </button>
      ))}
    </div>
    <button
      className="mt-6 bg-green-600 hover:bg-green-500 text-white p-2 w-full rounded transition duration-200"
      onClick={createNewCalendar}
    >
      + Create Calendar
    </button>
  </aside>
);

export default Sidebar;
