// src/Components/Sidebar.jsx
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import UserInputForm from './UserInputForm';
import ProgressBar from './ProgressBar';  // ProgressBar component
import DisplayDays from './CalendarPage';  // Step 2 component
import SummaryPage from './LinkPage';      // Step 3 component
import PropTypes from 'prop-types';

const Sidebar = ({ calendars, setCalendars, currentIndex, setCurrentIndex }) => {
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
    academicTerm: 'fall2024', // Ensure academicTerm is included
  };

  const navigate = useNavigate(); // To navigate to step1 after creating a new calendar

  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const selectCalendar = (index) => {
    setCurrentIndex(index);
    navigate('/step1'); // Navigate to step1 when a calendar is selected
  };

  const createNewCal = () => {
    const updatedCalendars = [...calendars, defaultCalendar];
    setCalendars(updatedCalendars);
    setCurrentIndex(updatedCalendars.length - 1);
    navigate('/step1'); // Navigate to step1 after creating a new calendar
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 p-5 shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="text-white text-xl font-semibold mb-6">Your Calendars</h2>

        {/* List of Calendars */}
        <div className="flex flex-col gap-4 overflow-y-auto">
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
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? '←' : '→'}
      </button>

      {/* Routes for Form Steps */}
      <div className={`ml-0 ${isOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300`}>
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

Sidebar.propTypes = {
  calendars: PropTypes.array.isRequired,
  setCalendars: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  setCurrentIndex: PropTypes.func.isRequired,
};

export default Sidebar;
