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

  // List of holidays and observances based off of LewisU academic calendar
  const holidays = [
    //Fall 2024
    {date: '2024-08-26', name: 'Full Day of Classes for the 16-Week and First 8-Week Session'},
    {date: '2024-09-02', name: 'Labor Day: No Classes'},
    {startDate: '2024-10-10', endDate: '2024-10-11', name: 'Fall Break: No classes for 16-Week Courses'},
    {date: '2024-10-19', name: 'Last Day of Classes for First 8-Week Session'},
    {date: '2024-10-21', name: 'Beginning of Second 8-Week Session'},
    {date: '2024-11-27', name: 'Thanksgiving Holiday Recess Begins: No Classes'},
    {date: '2024-12-02', name: 'Classes Resume'},
    {date: '2024-12-07', name: 'Final Day of Classes for 16-Week Term'},
    {startDate: '2024-12-09', endDate: '2024-12-14', name: 'Final Exams'},
    {startDate: '2024-12-13', endDate: '2024-12-14', name: 'Commencement Weekend'},
    {date: '2024-12-14', name: 'Final Day of Second 8-Week Session'},
    {date: '2024-12-20', name: 'Fall Term Degree Conferral Date'},
    //Spring 2025
    {startDate: '2025-01-06', endDate: '2025-01-17', name: 'January Term'},
    {date: '2025-01-20', name: 'Birthday of Martin Luther King Jr.'},
    {date: '2025-01-21', name: 'Full Day of Classes for the 16-Week Term and First 8-Week Session'},
    {date: '2025-03-15', name: 'Last Day of Classes for First 8-Week Session'},
    {startDate: '2025-03-17', endDate: '2025-03-22', name: 'Spring Break: No Classes'},
    {date: '2025-03-24', name: 'Classes Resume for 16-Week Term and Start Second 8-Week Session'},
    {startDate: '2025-04-17', endDate:'2025-04-21', name: 'Easter Holiday Recess: No Classes'},
    {date: '2025-05-10', name: 'Final Day of Classes for 16-Week Term'},
    {startDate: '2025-05-12', endDate: '2025-05-17', name: 'Final Exams for 16-Week Term'},
    {date: '2025-05-17', name: 'Last Day of Classes for the Second 8-Week Session'},
    {startDate: '2025-05-16', endDate: '2025-05-17', name: 'Commencement Weekend'},
    {date: '2025-05-23', name: 'Spring Term Degree Conferral Date'},
    //Summer 2025
    {date: '2025-05-19', name: 'Start First 7-Week Session'},
    {date: '2025-05-19', name: 'Standard 4-Week Session (dates may vary, standard end date June 15)'},
    {date: '2025-05-19', name: 'Standard 10-Week Session (dates may vary, standard end date July 19)'},
    {date: '2025-05-19', name: 'Start Standard 14-Week Session'},
    {date: '2025-06-02', name: 'Standard 6-Week Session (dates may vary, standard end July 13)'},
    {date: '2025-06-02', name: 'Standard 8-Week Session (dates may vary, standard end July 26)'},
    {date:'2025-06-19', name: 'Juneteenth Observed: No Classes'},
    {startDate: '2025-07-03', endDate: '2025-07-04', name: 'Independence Day Holiday: No Classes'},
    {date: '2025-07-05', name: 'End First 7-Week Session'},
    {date: '2025-07-07', name: 'Start Second 7-Week Session'},
    {date: '2025-08-23', name: 'End of 14-Week Term and Second 7-Week Term'},
    {date: '2025-08-29', name: 'Summer Term Degree Conferral Date'},
  ];

  // Filter holidays and observances that fall within the current month
  const holidaysThisMonth = holidays.filter((holiday) => {
    if (holiday.date) {
      // Single-day holiday/observance
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getMonth() === currentMonth &&
        holidayDate.getFullYear() === currentYear
      );
    } else if (holiday.startDate && holiday.endDate) {
      // Multi-day holiday/observance
      const start = new Date(holiday.startDate);
      const end = new Date(holiday.endDate);
      return (
        (start.getMonth() === currentMonth && start.getFullYear() === currentYear) ||
        (end.getMonth() === currentMonth && end.getFullYear() === currentYear)
      );
    }
    return false;
  });

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
      {/* Holidays Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-white mb-2"> Holidays and Observances</h3>
        <ul className="list-disc pl-5 text-white">
          {holidaysThisMonth.map((holiday) => (
            <li key={holiday.date || holiday.startDate}>
              <span className="font-bold">{holiday.name}</span> - {' '}
              {holiday.date
              ? new Date(holiday.date).toLocaleDateString()
              : `${new Date(holiday.startDate).toLocaleDateString()} to ${new Date(holiday.endDate).toLocaleDateString()}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalendarPage;
