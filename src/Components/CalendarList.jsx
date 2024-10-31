// src/Components/CalendarList.jsx

import PropTypes from 'prop-types';
import { useUser } from '../contexts/UserContext';

const CalendarList = () => {
  const { state, dispatch } = useUser();

  const handleSelectCalendar = (index) => {
    dispatch({ type: 'SET_CURRENT_INDEX', payload: index });
  };

  return (
    <div className="overflow-y-auto">
      <ul>
        {state.calendars.map((calendar, index) => (
          <li
            key={calendar.id || index}
            className={`p-4 cursor-pointer ${
              state.current_index === index ? 'bg-lewisRed text-white' : 'hover:bg-gray-200'
            }`}
            onClick={() => handleSelectCalendar(index)}
          >
            {calendar.class_name || `Calendar ${index + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

CalendarList.propTypes = {};

export default CalendarList;
