// src/Components/CalendarList.jsx

import PropTypes from 'prop-types';
import { useUser } from '../contexts/UserContext';

const CalendarList = () => {
  const { state, dispatch } = useUser();

  const handleSelectCalendar = (index) => {
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4">Your Calendars</h2>
      <div className="overflow-y-auto max-h-96">
        <ul>
          {state.calendars.map((calendar, index) => (
            <li
              key={calendar.id}
              className={`p-4 cursor-pointer rounded-md mb-2 ${
                state.current_index === index
                  ? 'bg-lewisRed text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleSelectCalendar(index)}
            >
              <div className="flex justify-between items-center">
                <span>{calendar.class_name || `Calendar ${index + 1}`}</span>
                {state.current_index === index && (
                  <span className="text-sm">Selected</span>
                )}
              </div>
            </li>
          ))}
          {state.calendars.length === 0 && (
            <li className="text-gray-500">No calendars available. Create one!</li>
          )}
        </ul>
      </div>
    </div>
  );
};

CalendarList.propTypes = {};

export default CalendarList;
