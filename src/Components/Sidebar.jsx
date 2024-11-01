// src/Components/Sidebar.jsx

import { useState } from 'react';
import CalendarList from './CalendarList';
import { useUser } from '../contexts/UserContext';
import { navigate } from 'react-router-dom'; // Import Link for navigation
import Button from './Button';

const Sidebar = () => {
  const { state, dispatch } = useUser();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const selectCalendar = (index) => {
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index });
    // No need to navigate; assuming ICS Creator is on the main page
  };

  const handleCreateNewCalendar = () => {
    // Reset the selected calendar
    dispatch({ type: 'SET_CURRENT_INDEX', payload: null });
    // Navigate to the create calendar screen
    navigate('/create');
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
          calendars={state.calendars}
          currentIndex={state.current_index}
          selectCalendar={selectCalendar}
        />

        {/* Create Calendar Button */}
        <Button
          type="button"
          onClick={handleCreateNewCalendar}
          className="mt-6 bg-green-600 hover:bg-green-500 text-white p-2 w-full rounded transition duration-200 ease-in-out text-center block"
        >
          + Create Calendar
        </Button>
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

Sidebar.propTypes = {};

export default Sidebar;
