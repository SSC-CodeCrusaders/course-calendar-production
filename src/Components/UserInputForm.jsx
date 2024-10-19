import React from "react";

const UserInputForm = ({ currentIndex, calendars = [], setCalendars }) => {
  const currentCalendar = calendars[currentIndex] || {
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

  // Update the current calendar in the calendars array
  const updateCurrentCalendar = (updatedCalendar) => {
    const updatedCalendars = calendars.map((calendar, i) =>
      i === currentIndex ? updatedCalendar : calendar
    );
    setCalendars(updatedCalendars);
    localStorage.setItem('calendars', JSON.stringify(updatedCalendars));
  };

  // Handler to toggle day checkboxes
  const handleDayChange = (day) => {
    updateCurrentCalendar({
      ...currentCalendar,
      daysOfClass: {
        ...currentCalendar.daysOfClass,
        [day]: !currentCalendar.daysOfClass[day],
      },
    });
  };

  return (
    <div className="bg-lewisRed min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Class Schedule Creator</h1>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center">
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="calendar" className="mr-4">Start of Course Date: </label>
          <input
            type="date"
            value={currentCalendar.firstDay}
            onChange={(e) =>
              updateCurrentCalendar({
                ...currentCalendar,
                firstDay: e.target.value,
              })
            }
            className="p-2 border rounded text-center"
          />
        </div>
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="calendar" className="mr-4">End of Course Date:</label>
          <input
            type="date"
            value={currentCalendar.lastDay}
            onChange={(e) =>
              updateCurrentCalendar({
                ...currentCalendar,
                lastDay: e.target.value,
              })
            }
            className="p-2 border rounded text-center"
          />
        </div>
        <h2 className="text-center mb-4">Course Dates:</h2>
        <div className="mb-4 flex-wrap flex justify-center items-center">
          {Object.keys(currentCalendar.daysOfClass).map((day, index) => (
            <div key={index} className="mr-4 flex items-center">
              <label htmlFor={day} className="mr-2">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
              <input
                type="checkbox"
                id={day}
                checked={currentCalendar.daysOfClass[day]}
                onChange={() => handleDayChange(day)}
                className="form-checkbox"
              />
            </div>
          ))}
        </div>

        <br />
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="instructor_name" className="mr-4">Instructor Name: </label>
          <input
            type="text"
            value={currentCalendar.instructorName}
            onChange={(e) =>
              updateCurrentCalendar({
                ...currentCalendar,
                instructorName: e.target.value,
              })
            }
            className="p-2 border rounded text-center"
          />
        </div>

        <br />
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="class_name" className="mr-4">Course Name: </label>
          <input
            type="text"
            value={currentCalendar.className}
            onChange={(e) =>
              updateCurrentCalendar({
                ...currentCalendar,
                className: e.target.value,
              })
            }
            className="p-2 border rounded text-center"
          />
        </div>

        <br />
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="location" className="mr-4">Course Location: </label>
          <input
            type="text"
            value={currentCalendar.location}
            onChange={(e) =>
              updateCurrentCalendar({
                ...currentCalendar,
                location: e.target.value,
              })
            }
            className="p-2 border rounded text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default UserInputForm;
