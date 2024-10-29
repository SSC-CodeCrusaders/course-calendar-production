// src/Components/Sidebar.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarList from './CalendarList';
import { useUser } from '../contexts/UserContext';

const Sidebar = () => {
  const { calendars, setCalendars, currentIndex, setCurrentIndex } = useUser();
  const defaultCalendar = {
    firstDay: '',
    lastDay: '',
    startTime: '',
    endTime: '',
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

  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const selectCalendar = (index) => {
    setCurrentIndex(index);
    navigate('/'); // Redirect to the main creator page when selecting a calendar
  };

  const createNewCal = () => {
    const updatedCalendars = [...calendars, { ...defaultCalendar }];
    setCalendars(updatedCalendars);
    setCurrentIndex(updatedCalendars.length - 1);
    navigate('/'); // Redirect to the main creator page when creating a new calendar
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-full w-64 bg-gray-900 p-5 shadow-lg transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="text-white text-xl font-semibold mb-6">Your Calendars</h2>

        {/* Calendar List */}
        <CalendarList
          calendars={calendars}
          currentIndex={currentIndex}
          selectCalendar={selectCalendar}
        />

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
        className={`fixed top-16 transform -translate-y-1/2 ${
          isOpen ? 'translate-x-[16rem]' : 'translate-x-0'
        } transition-transform duration-300 bg-gray-900 text-white p-3 rounded-full shadow-lg z-50`}
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
      >
        {isOpen ? 'Close' : 'Open'}
      </button>
    </>
  );
};

export default Sidebar;
