import React from 'react';
import PropTypes from 'prop-types';

const CalendarList = ({ calendars, currentIndex, selectCalendar }) => {
  return (
    <ul>
      {calendars.map((calendar, index) => (
        <li
          key={index}
          onClick={() => selectCalendar(index)}
          className={`cursor-pointer p-2 mb-2 rounded ${
            index === currentIndex ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
          } hover:bg-blue-400 hover:text-white transition-colors duration-200`}
        >
          {calendar.className || `Calendar ${index + 1}`}
        </li>
      ))}
    </ul>
  );
};

CalendarList.propTypes = {
  calendars: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentIndex: PropTypes.number.isRequired,
  selectCalendar: PropTypes.func.isRequired,
};

export default CalendarList;
