import React, { useState, useEffect } from 'react';
import UserInputForm from './UserInputForm';

const Sidebar = () => {
  const defaultCalendar = {
    firstDay: '',
    lastDay: '',
    classTime: '',
    daysOfClass: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    instructorName: '',
    className: '',
    location: '',
  };

  // Load calendars from localStorage or initialize with one default calendar
  const [calendars, setCalendars] = useState(() => {
    const storedCalendars = localStorage.getItem('calendars');
    return storedCalendars ? JSON.parse(storedCalendars) : [defaultCalendar];
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const storedIndex = localStorage.getItem('currentIndex');
    return storedIndex ? JSON.parse(storedIndex) : 0;
  });

  // Save the calendars array to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calendars', JSON.stringify(calendars));
  }, [calendars]);

  // Save the current index to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentIndex', JSON.stringify(currentIndex));
  }, [currentIndex]);

  // Toggle function to open/close the sidebar
  const [isOpen, setIsOpen] = useState(true); // Initialize sidebar open/close state

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Set the current index and switch the displayed calendar
  const selectCalendar = (index) => {
    setCurrentIndex(index); // Update the current calendar index
  };

  // Create a new calendar
  const createNewCal = () => {
    const updatedCalendars = [...calendars, defaultCalendar];
    setCalendars(updatedCalendars);
    setCurrentIndex(updatedCalendars.length - 1); // Automatically switch to the new calendar
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-900 p-5 shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <h2 className="text-white text-xl font-semibold mb-6">Your Calendars</h2>

        {/* List of Calendars */}
        <div className="flex flex-col gap-4">
          {calendars.length === 0 ? (
            <p className="text-white">No calendars available</p>
          ) : (
            calendars.map((calendar, index) => (
              <button
                key={index}
                className={`block w-full text-left text-white p-2 bg-gray-700 hover:bg-gray-600 rounded transition duration-200 ease-in-out ${
                  currentIndex === index ? 'bg-gray-600' : ''
                }`}
                onClick={() => selectCalendar(index)}
              >
                Calendar {index + 1}
              </button>
            ))
          )}
        </div>

        {/* Create Calendar Button */}
        <button
          className="mt-6 bg-green-600 hover:bg-green-500 text-white p-2 w-full rounded transition duration-200 ease-in-out"
          onClick={createNewCal}
        >
          + Create Calendar
        </button>
      </div>

      {/* Toggle Button */}
      <button
        className={`fixed top-1/2 transform -translate-y-1/2 ${
          isOpen ? 'translate-x-[16rem]' : 'translate-x-0'
        } transition-transform duration-300 bg-gray-900 text-white p-3 rounded-full shadow-lg z-50`}
        onClick={toggleSidebar}
      >
        {isOpen ? 'Close' : 'Open'}
      </button>

      {/* UserInputForm */}
      <div className="w-full">
        <UserInputForm currentIndex={currentIndex} calendars={calendars} setCalendars={setCalendars} />
      </div>
    </>
  );
};

export default Sidebar;
