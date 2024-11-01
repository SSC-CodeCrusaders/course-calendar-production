import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { academicCalendar } from "../../utils/academicCalendar";
import { generateSchedule } from "../../utils/scheduleGenerator";
import { generateICS } from "../../utils/icsGenerator";

const UserInputForm = ({ currentIndex, calendars, setCalendars }) => {
  const defaultCalendar = {
    firstDay: "",
    lastDay: "",
    classTime: "",
    daysOfClass: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    instructorName: "",
    className: "",
    location: "",
    academicTerm: "fall2024",
  };

  const currentCalendar = calendars[currentIndex] || defaultCalendar;
  const [academicTerm, setAcademicTerm] = useState(currentCalendar.academicTerm);

  const updateCurrentCalendar = (key, value) => {
    const updatedCalendars = calendars.map((calendar, index) =>
      index === currentIndex ? { ...calendar, [key]: value } : calendar
    );
    setCalendars(updatedCalendars);
  };

  useEffect(() => {
    updateCurrentCalendar("academicTerm", academicTerm);
  }, [academicTerm]);

  const handleDayChange = (day) => {
    const updatedDays = {
      ...currentCalendar.daysOfClass,
      [day]: !currentCalendar.daysOfClass[day],
    };
    updateCurrentCalendar("daysOfClass", updatedDays);
  };

  const onSubmit = () => {
    try {
      // Validate dates
      const startDate = new Date(currentCalendar.firstDay);
      const endDate = new Date(currentCalendar.lastDay);
      if (startDate > endDate) {
        toast.error("Start date must be before end date.");
        return;
      }

      // Generate schedule events and holidays
      const scheduleEvents = generateSchedule(currentCalendar);
      const termHolidays = academicCalendar[currentCalendar.academicTerm]?.holidays || [];
      const holidayEvents = termHolidays.map((holiday) => ({
        name: holiday.name,
        date: new Date(holiday.date),
      }));

      // Generate ICS
      generateICS(scheduleEvents, holidayEvents, currentCalendar.className);
      toast.success("Schedule saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save schedule.");
    }
  };

  return (
    <div className="bg-lewisRed min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Class Schedule Creator</h1>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center">
        {/* Academic Term */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="academicTerm" className="mr-4">Academic Term:</label>
          <select
            id="academicTerm"
            value={academicTerm}
            onChange={(e) => setAcademicTerm(e.target.value)}
            className="p-2 border rounded text-center"
          >
            {Object.keys(academicCalendar).map((term) => (
              <option key={term} value={term}>
                {term.charAt(0).toUpperCase() + term.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="start-date" className="mr-4">Start of Course Date:</label>
          <input
            id="start-date"
            type="date"
            value={currentCalendar.firstDay || ""}
            onChange={(e) => updateCurrentCalendar("firstDay", e.target.value)}
            className="p-2 border rounded text-center"
          />
        </div>

        {/* End Date */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="end-date" className="mr-4">End of Course Date:</label>
          <input
            id="end-date"
            type="date"
            value={currentCalendar.lastDay || ""}
            onChange={(e) => updateCurrentCalendar("lastDay", e.target.value)}
            className="p-2 border rounded text-center"
          />
        </div>

        {/* Class Time */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="class-time" className="mr-4">Class Time (24h format):</label>
          <input
            id="class-time"
            type="time"
            value={currentCalendar.classTime || ""}
            onChange={(e) => updateCurrentCalendar("classTime", e.target.value)}
            className="p-2 border rounded text-center"
          />
        </div>

        {/* Days of Class */}
        <h2 className="text-center mb-4">Course Days:</h2>
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
          <label htmlFor="instructor-name" className="mr-4">Instructor Name:</label>
          <input
            id="instructor-name"
            type="text"
            value={currentCalendar.instructorName || ""}
            onChange={(e) => updateCurrentCalendar("instructorName", e.target.value)}
            className="p-2 border rounded text-center w-full max-w-md"
          />
        </div>

        {/* Class Name */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="class-name" className="mr-4">Course Name:</label>
          <input
            id="class-name"
            type="text"
            value={currentCalendar.className || ""}
            onChange={(e) => updateCurrentCalendar("className", e.target.value)}
            className="p-2 border rounded text-center w-full max-w-md"
          />
        </div>

        {/* Location */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="location" className="mr-4">Course Location:</label>
          <input
            id="location"
            type="text"
            value={currentCalendar.location || ""}
            onChange={(e) => updateCurrentCalendar("location", e.target.value)}
            className="p-2 border rounded text-center w-full max-w-md"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="mt-4 bg-lewisRed text-white px-4 py-2 rounded">
          Save Schedule & Generate ICS
        </button>
      </form>
    </div>
  );
};

UserInputForm.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  calendars: PropTypes.array.isRequired,
  setCalendars: PropTypes.func.isRequired,
};

export default UserInputForm;
