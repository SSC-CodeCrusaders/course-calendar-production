import React from 'react';

const UserInputForm = ({ currentIndex, calendars, setCalendars }) => {
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

  const currentCalendar = calendars[currentIndex] || defaultCalendar;

  const updateCurrentCalendar = (key, value) => {
    const updatedCalendars = calendars.map((calendar, index) =>
      index === currentIndex ? { ...calendar, [key]: value } : calendar
    );
    setCalendars(updatedCalendars);
  };

  const handleDayChange = (day) => {
    const updatedDays = {
      ...currentCalendar.daysOfClass,
      [day]: !currentCalendar.daysOfClass[day],
    };
    updateCurrentCalendar('daysOfClass', updatedDays);
  };

  return (
    <div className="bg-lewisRed h-full flex flex-col items-center justify-center overflow-y-auto">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Class Schedule Creator</h1>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center overflow-y-auto max-h-[80vh]">
        {/* Start Date */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="start-date" className="mr-4">Start of Course Date: </label>
          <input
            id="start-date"
            type="date"
            value={currentCalendar.firstDay || ''}
            onChange={(e) => updateCurrentCalendar('firstDay', e.target.value)}
            className="p-2 border rounded text-center"
          />
        </div>

        {/* End Date */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="end-date" className="mr-4">End of Course Date:</label>
          <input
            id="end-date"
            type="date"
            value={currentCalendar.lastDay || ''}
            onChange={(e) => updateCurrentCalendar('lastDay', e.target.value)}
            className="p-2 border rounded text-center"
          />
        </div>

        {/* Days of Class */}
        <h2 className="text-center mb-4">Course Dates:</h2>
        <div className="mb-4 flex-wrap flex justify-center items-center">
          {Object.keys(currentCalendar.daysOfClass || {}).map((day, index) => (
            <div key={index} className="mr-4 flex items-center">
              <label htmlFor={day} className="mr-2">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
              <input
                id={day}
                type="checkbox"
                checked={currentCalendar.daysOfClass[day] || false}
                onChange={() => handleDayChange(day)}
                className="form-checkbox"
              />
            </div>
          ))}
        </div>

        {/* Instructor Name */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="instructor-name" className="mr-4">Instructor Name: </label>
          <input
            id="instructor-name"
            type="text"
            value={currentCalendar.instructorName || ''}
            onChange={(e) => updateCurrentCalendar('instructorName', e.target.value)}
            className="p-2 border rounded text-center w-full max-w-md"
          />
        </div>

        {/* Class Name */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="class-name" className="mr-4">Course Name: </label>
          <input
            id="class-name"
            type="text"
            value={currentCalendar.className || ''}
            onChange={(e) => updateCurrentCalendar('className', e.target.value)}
            className="p-2 border rounded text-center w-full max-w-md"
          />
        </div>

        {/* Location */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="location" className="mr-4">Course Location: </label>
          <input
            id="location"
            type="text"
            value={currentCalendar.location || ''}
            onChange={(e) => updateCurrentCalendar('location', e.target.value)}
            className="p-2 border rounded text-center w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default UserInputForm;
