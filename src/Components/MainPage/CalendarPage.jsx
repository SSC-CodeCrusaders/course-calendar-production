import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const CalendarPage = ({ currentCalendar }) => {
  const {
    firstDay,
    lastDay,
    daysOfClass,
    className,
    location,
    instructorName,
    startTime,
    endTime,
  } = currentCalendar;

  // Days of the week
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Months of the year
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // State to track the current month and year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Parse firstDay and lastDay into JavaScript Date objects
  const firstDayDate = new Date(firstDay);
  const lastDayDate = new Date(lastDay);

  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Calculate the first day of the month's index (0 = Sunday, 6 = Saturday)
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Generate the calendar grid
  const calendarDays = Array.from({ length: firstDayIndex + daysInMonth }, (_, i) =>
    i >= firstDayIndex ? i - firstDayIndex + 1 : null
  );

  // Change month handlers
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Helper function to check if a given day is within the firstDay and lastDay range
  const isWithinRange = (day) => {
    if (!day) return false;
    const currentDate = new Date(currentYear, currentMonth, day);
    return currentDate >= firstDayDate && currentDate <= lastDayDate;
  };

  return (
    <div className="flex flex-col bg-lewisRed text-white rounded-lg p-6">
      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePreviousMonth} className="p-2">
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>
        <h2 className="text-2xl font-bold">
          {months[currentMonth]} {currentYear}
        </h2>
        <button onClick={handleNextMonth} className="p-2">
          <ChevronRightIcon className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Days of the Week Header */}
      <div className="grid grid-cols-7 text-center font-semibold bg-white text-lewisRed rounded-lg p-2 mb-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dayOfWeek = daysOfWeek[index % 7].toLowerCase();
          const isClassDay = day && daysOfClass[dayOfWeek];
          const inRange = isWithinRange(day);

          return (
            <div
              key={index}
              className={`border rounded-lg p-4 text-center text-sm ${
                day && inRange
                  ? isClassDay
                    ? "bg-white text-lewisRed border-white"
                    : "bg-lewisRed text-white border-white"
                  : "bg-transparent"
              }`}
            >
              {day && (
                <>
                  <div className="text-lg font-bold mb-1">{day}</div>
                  {day && inRange && isClassDay ? (
                    <div className="text-xs">
                      <p>{startTime} - {endTime}</p>
                      <p>{className}</p>
                    </div>
                  ) : (
                    <div className="text-xs">{inRange ? "No events" : ""}</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;
