import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';  // Use only Routes and Route, no Router here
import UserInputForm from './UserInputForm';
import ProgressBar from './ProgressBar';  // ProgressBar component
import DisplayDays from './CalendarPage';  // Step 2 component
import SummaryPage from './LinkPage';      // Step 3 component

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

  const [calendars, setCalendars] = useState(() => {
    const storedCalendars = localStorage.getItem('calendars');
    return storedCalendars ? JSON.parse(storedCalendars) : [defaultCalendar];
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const storedIndex = localStorage.getItem('currentIndex');
    return storedIndex ? JSON.parse(storedIndex) : 0;
  });

  useEffect(() => {
    localStorage.setItem('calendars', JSON.stringify(calendars));
  }, [calendars]);

  useEffect(() => {
    localStorage.setItem('currentIndex', JSON.stringify(currentIndex));
  }, [currentIndex]);

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const selectCalendar = (index) => {
    setCurrentIndex(index);
  };

  const createNewCal = () => {
    const updatedCalendars = [...calendars, defaultCalendar];
    setCalendars(updatedCalendars);
    setCurrentIndex(updatedCalendars.length - 1);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-gray-900 p-5 shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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

      {/* Routes for Form Steps */}
      <div className="w-full">
        <Routes>  {/* Define routes for each step */}
          <Route
            path="/step1"
            element={<UserInputForm currentIndex={currentIndex} calendars={calendars} setCalendars={setCalendars} />}
          />
          <Route path="/step2" element={<DisplayDays />} />
          <Route path="/step3" element={<SummaryPage />} />
        </Routes>

        {/* ProgressBar */}
        <ProgressBar />
      </div>
    </>
  );
};

export default Sidebar;
