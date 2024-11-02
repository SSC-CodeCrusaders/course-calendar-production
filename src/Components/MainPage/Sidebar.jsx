// src/Components/Sidebar.jsx

import { useState } from 'react';
import CalendarList from '../CalendarList';
import { useUser } from '../../contexts/UserContext';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const { state, dispatch } = useUser();
  const [isOpen] = useState(true);

  const selectCalendar = (index) => {
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index });
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
        <Link
          to="/create"
          className="mt-6 bg-green-600 hover:bg-green-500 text-white p-2 w-full rounded transition duration-200 ease-in-out text-center block"
        >
          + Create Calendar
        </Link>
      </div>
    </>
  );
};

Sidebar.propTypes = {};

export default Sidebar;
