import React, { useState, useMemo, useContext, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import UserInputForm from "./UserInputForm";
import LinkPage from "./LinkPage";
import { AuthContext } from "../../Context/AuthProvider";
import { getHolidaysThisMonth, getGreyedOutDates, generateCalendarDays } from "../../utils/calendarUtils";
import { academicCalendar } from "../../utils/academicCalendar";

const CalendarPage = ({ currentCalendar, currentIndex, calendars, setCalendars }) => {
  const { user } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [expandedDay, setExpandedDay] = useState ({ day: null, month: null, year: null });
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({
    monday: new Set(),
    tuesday: new Set(),
    wednesday: new Set(),
    thursday: new Set(),
    friday: new Set(),
  });
  const [selectedTerm, setSelectedTerm] = useState(currentCalendar.academicTerm || "SP2025");
  const termStart = new Date(academicCalendar[selectedTerm]?.termStart);
  const termEnd = new Date(academicCalendar[selectedTerm]?.termEnd);

  useEffect(() => {
    const selectedTimeSlotsObject = {};
    Object.keys(selectedTimeSlots).forEach((day) => {
      selectedTimeSlotsObject[day] = Array.from(selectedTimeSlots[day]);
    });

    const newStart = new Date(academicCalendar[selectedTerm]?.termStart);
    setCurrentMonth(newStart.getMonth());
    setCurrentYear(newStart.getFullYear());

    const updatedCalendars = calendars.map((calendar, index) =>
    index === currentIndex
      ? { ...calendar, selectedTimeSlots: selectedTimeSlotsObject, academicTerm: selectedTerm || "SP2025" }
      : calendar
    );
    setCalendars(updatedCalendars);
  }, [selectedTimeSlots, selectedTerm]);

  const holidays = academicCalendar[selectedTerm]?.holidays || [];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (offset) => {
    setCurrentMonth((prevMonth) => {
      let newMonth = prevMonth + offset;
      if (newMonth < 0) {
        setCurrentYear(currentYear - 1);
        newMonth = 11;
      } else if (newMonth > 11) {
        newMonth = 0;
        setCurrentYear(currentYear + 1);
      }
      return newMonth;
    });
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const holidaysThisMonth = useMemo(() => getHolidaysThisMonth(holidays, currentMonth, currentYear), [currentMonth, currentYear]);
  const greyedOutDates = useMemo(() => getGreyedOutDates(currentMonth, currentYear, daysInMonth, holidaysThisMonth), [currentMonth, currentYear, daysInMonth, holidaysThisMonth]);
  const calendarDays = useMemo(() => generateCalendarDays(firstDayIndex, prevMonthDays, currentYear, currentMonth, daysInMonth, greyedOutDates), 
    [firstDayIndex, prevMonthDays, currentYear, currentMonth, daysInMonth, greyedOutDates]);

  const mwf = ["8:00AM - 8:50AM", "9:00AM - 9:50AM", "10:00AM - 10:50AM", "11:00AM - 11:50AM", "12:00PM - 12:50PM", "1:00PM - 1:50PM", "2:00PM - 2:50PM", "3:00PM - 3:50PM"];
  const tr = ["8:00AM - 9:15AM", "9:30AM - 10:45AM", "11:00AM - 12:15PM", "12:30PM - 1:45PM", "2:00PM - 3:15PM", "3:30PM - 4:45PM"];
  const timeSlots = { monday: mwf, tuesday: tr, wednesday: mwf, thursday: tr, friday: mwf };

  const toggleTimeSlot = (dayOfWeek, slot, event) => {
    event.stopPropagation();
    setSelectedTimeSlots((prev) => {
      const updated = { ...prev };
      const updatedSlots = new Set(updated[dayOfWeek] || []);
      if (updatedSlots.has(slot)) {
        updatedSlots.delete(slot);
      } else {
        updatedSlots.add(slot);
      }
      if (updatedSlots.size === 0) {
        delete updated[dayOfWeek];
      } else {
        updated[dayOfWeek] = updatedSlots;
      }
      return updated;
    });
  };

  return (
    <div className="flex flex-col bg-white text-black rounded-lg p-6 w-full max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => changeMonth(-1)} 
          className="p-2 disabled:opacity-20"
          disabled={new Date(currentYear, currentMonth - 1, 1) < new Date(termStart.getFullYear(), termStart.getMonth(), 1)}
        >
          <ChevronLeftIcon className="h-6 w-6 text-black" />
        </button>
        <div className="flex flex-row gap-4">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="p-2 font-semibold border rounded text-sm"
          >
            {Object.keys(academicCalendar).map((termKey) => (
              <option key={termKey} value={termKey}>{termKey}</option>
            ))}
          </select>
          <h2 className="text-2xl text-black font-bold">{months[currentMonth]}</h2>
        </div>
        <button 
          onClick={() => changeMonth(1)} 
          className="p-2 disabled:opacity-20"
          disabled={new Date(currentYear, currentMonth + 1, 1) > new Date(termEnd.getFullYear(), termEnd.getMonth(), 1)}
        >
          <ChevronRightIcon className="h-6 w-6 text-black" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold bg-lewisRedDarker text-white rounded-t-lg p-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2 px-3">{day.slice(0, 3)}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((dayObj, index) => {
          const { day, isPrevMonth, isNextMonth } = dayObj;
          const date = new Date(dayObj.year, dayObj.month, dayObj.day);
          const dayOfWeek = daysOfWeek[date.getDay()].toLowerCase();
          const isCurrentMonth = !isPrevMonth && !isNextMonth;
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isHoliday = isCurrentMonth && greyedOutDates.has(day);
          const isBeforeTerm = date < termStart;
          const isAfterTerm = date > termEnd;
          const isGreyedOut = isWeekend || isHoliday || isBeforeTerm || isAfterTerm;
          const isExpanded = expandedDay.day === dayObj.day && 
            expandedDay.month === dayObj.month &&
            expandedDay.year === dayObj.year;
          const isSelectedDay = !dayObj.isGreyedOut && 
            !dayObj.isPrevMonth && 
            !dayObj.isNextMonth && 
            selectedTimeSlots[dayOfWeek]?.size > 0;
          return (
            <div 
              key={index} 
              className={`p-2 border text-center text-sm cursor-pointer ${
                isGreyedOut 
                ? 'bg-gray text-slate-500 cursor-not-allowed' 
                : isSelectedDay
                  ? 'bg-lewisRed text-white cursor-pointer' 
                  : 'bg-white cursor-pointer'
              }`}
              onClick={() => {
                if (!isGreyedOut && timeSlots[dayOfWeek]) {
                  setExpandedDay(
                    isExpanded 
                      ? { day: null, month: null, year: null } 
                      : { day, month: dayObj.month, year: dayObj.year }
                  );
                }
              }}
            >
              <div className="text-lg font-bold mb-1">{day}</div>
              {isExpanded && timeSlots[dayOfWeek] && timeSlots[dayOfWeek].map((slot, idx) => {
                const isSelected = selectedTimeSlots[dayOfWeek]?.has(slot);
                return (
                  <div
                    key={idx}
                    onClick={(e) => toggleTimeSlot(dayOfWeek, slot, e)}
                    className={`text-xs px-3 py-1 my-1 transition duration-150 ease-in-out cursor-pointer 
                      ${isSelected ? 'bg-green-300' : ''}`}
                  >
                    {slot}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-black mb-2">Holidays and Observances</h3>
        <ul className="list-disc pl-5 text-black">
          {holidaysThisMonth.map((holiday, index) => (
            <li key={index}>
              <span className="font-bold">{holiday.name}</span> - {holiday.date || `${holiday.startDate} to ${holiday.endDate}`}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-white p-4 rounded-lg">
        <UserInputForm
          currentIndex={currentIndex}
          calendars={calendars}
          setCalendars={setCalendars}
        />
      </div>

      <div className="bg-white p-4 rounded-lg">
        <LinkPage currentCalendar={currentCalendar} />
      </div>
    </div>
  );
};

export default CalendarPage;
