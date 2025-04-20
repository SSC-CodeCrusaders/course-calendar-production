import React, { useCallback, useState, useMemo, useContext, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import UserInputForm from "./UserInputForm";
import LinkPage from "./LinkPage";
import { AuthContext } from "../../Context/AuthProvider";
import { getHolidaysThisMonth, getGreyedOutDates, generateCalendarDays } from "../../utils/calendarUtils";
import { academicCalendar } from "../../utils/academicCalendar";
import { motion, AnimatePresence } from 'framer-motion';

const CalendarPage = ({ currentCalendar, currentIndex, calendars, setCalendars }) => {
  const { user } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [expandedDay, setExpandedDay] = useState ({ day: null, month: null, year: null });
  
  const makeSets = slotsObj => {
    const result = {};
    Object.entries(slotsObj || {}).forEach(([day, arr]) => {
      result[day] = new Set(arr);
    });
    return result;
  };
  const [selectedTimeSlots, setSelectedTimeSlots] = useState(
    makeSets(currentCalendar.selectedTimeSlots)
  );

  useEffect(() => {
    setSelectedTimeSlots(makeSets(currentCalendar.selectedTimeSlots));
    setExpandedDay({ day: null, month: null, year: null });
  }, [currentIndex]);

  const determineCurrentTerm = () => {
    const today = new Date();
    for (const termKey of Object.keys(academicCalendar)) {
      const term = academicCalendar[termKey];
      const start = new Date(term.termStart);
      const end = new Date(term.termEnd);
      if (today >= start && today <= end) {
        return termKey;
      }
    }
    return "SP2025";
  };

  const [selectedTerm, setSelectedTerm] = useState(currentCalendar.academicTerm || determineCurrentTerm());
  const termStart = new Date(academicCalendar[selectedTerm]?.termStart);
  const termEnd = new Date(academicCalendar[selectedTerm]?.termEnd);

  useEffect(() => {
    const selectedTimeSlotsObject = {};
    Object.keys(selectedTimeSlots).forEach((day) => {
      selectedTimeSlotsObject[day] = Array.from(selectedTimeSlots[day]);
    });

    const updatedCalendars = calendars.map((calendar, index) =>
    index === currentIndex
      ? { ...calendar, selectedTimeSlots: selectedTimeSlotsObject, academicTerm: selectedTerm || "SP2025" }
      : calendar
    );
    setCalendars(updatedCalendars);
  }, [selectedTimeSlots]);

  useEffect(() => {
    const today = new Date();
    const newStart = new Date(academicCalendar[selectedTerm]?.termStart);
    const newEnd = new Date(academicCalendar[selectedTerm]?.termEnd);

    if (today >= newStart && today <= newEnd) {
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
    } else {
      setCurrentMonth(newStart.getMonth());
      setCurrentYear(newStart.getFullYear());
    }
    setExpandedDay({ day: null, month: null, year: null });
  }, [selectedTerm]);

  const holidays = academicCalendar[selectedTerm]?.holidays || [];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = useCallback((offset) => {
    setCurrentMonth((prevMonth) => {
      setCurrentYear((prevYear) => {
        const tentative = prevMonth + offset;
        if (tentative < 0) return prevYear - 1;
        if (tentative > 11) return prevYear + 1;
        return prevYear;
      });
      return (prevMonth + offset + 12) % 12;
    });
  }, []);

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
      updatedSlots.has(slot) ? updatedSlots.delete(slot) : updatedSlots.add(slot);
      if (updatedSlots) updated[dayOfWeek] = updatedSlots;
      else delete updated[dayOfWeek];
      return updated;
    });
  };
  
  const [showLinkPage, setShowLinkPage] = useState(true);

  return (
    <div className="relative flex flex-col bg-white text-black rounded-lg p-6 w-full max-w-7xl mx-auto min-h-screen">
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

      <div className="w-full grid grid-cols-7 text-center font-bold bg-lewisRedDarker text-white rounded-t-lg">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2 px-3 divide-x-4 divide-white">{day.slice(0, 3)}</div>
        ))}
      </div>
      <div className="w-full overflow-visible z-0">
        <div className="relative grid grid-cols-7 border-r border-b z-40 overflow-visible">
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
            const isSelectedDay = selectedTimeSlots[dayOfWeek]?.size > 0;
            const isToday =
              date.getFullYear() === new Date().getFullYear() &&
              date.getMonth() === new Date().getMonth() &&
              date.getDate() === new Date().getDate();
            return (
              <div 
                key={index} 
                className={`p-3 border-t border-l text-center sm:text-sm cursor-pointer relative
                  ${isGreyedOut 
                    ? 'bg-gray text-slate-500 cursor-not-allowed z-0' 
                    : isSelectedDay
                      ? 'bg-lewisRed text-white cursor-pointer z-0' 
                      : 'bg-white cursor-pointer z-0'}
                  ${isToday ? 'ring-2 ring-red-500 z-10' : ''}
                  ${isExpanded ? 'z-50' : ''}
                `}
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
                <div className="relative text-lg font-bold mb-1">{day}</div>
                <AnimatePresence initial={false}>
                    {isExpanded && (
                    <motion.div
                      key="dropdown"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="absolute aria-expanded left-0 w-full z-50 overflow-hidden bg-white border-lrb rounded-b-lg shadow-xl p-2 space-y-1"
                    >
                      {timeSlots[dayOfWeek]?.map((slot, idx) => {
                        const isSelected = selectedTimeSlots[dayOfWeek]?.has(slot);
                        return (
                          <div
                            key={idx}
                            onClick={(e) => toggleTimeSlot(dayOfWeek, slot, e)}
                            className={`text-[6px] sm:text-xs px-3 py-1 rounded-md border font-medium cursor-pointer transition text-center break-words whitespace-normal
                              ${isSelected 
                                ? 'bg-red-500 text-white border-black' 
                                : 'bg-white text-black border-gray hover:bg-gray'}`}
                          >
                            {slot}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
{/*
      <div className="flex items-center mt-1">
        <input
          id="customRange"
          type="checkbox"
          className="mr-2"
          checked={currentCalendar.useSelectedStartDay || false}
          onChange={() => {
            const updated = [...calendars];
            const selectedDate = expandedDay;
            if (selectedDate && selectedDate.day !== null) {
              const dateObj = new Date(selectedDate.year, selectedDate.month, selectedDate.day);
              updated[currentIndex].customStartDate = dateObj.toISOString();
              updated[currentIndex].useSelectedStartDay = !currentCalendar.useSelectedStartDay;
              setCalendars(updated);
            } else {
              alert("Please select a day first.")
            }
          }}
        />
        <label htmlFor="customRange" className="text-sm font-medium">Custom Date Range</label>
      </div>
*/}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-black mb-2">Holidays and Observances</h3>
        <ul className="list-disc pl-5 text-black">
          {holidaysThisMonth.map((holiday, index) => {
            const single = holiday.date instanceof Date
              ? holiday.date.toLocaleDateString()
              : null;
            const range = !single && holiday.startDate instanceof Date && holiday.endDate instanceof Date
              ? `${holiday.startDate.toLocaleDateString()} to ${holiday.endDate.toLocaleDateString()}`
              : null;
            return (
              <li key={index}>
                <span className="font-bold">{holiday.name}</span> - {single || range}
              </li>
            );
          })}
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
        {showLinkPage && (
          <LinkPage
            currentCalendar={{
              ...currentCalendar,
              firstDay:
                currentCalendar.firstDay instanceof Date
                  ? currentCalendar.firstDay
                  : currentCalendar.firstDay?.toDate?.() ?? new Date(),
              lastDay:
                currentCalendar.lastDay instanceof Date
                  ? currentCalendar.lastDay
                  : currentCalendar.lastDay?.toDate?.() ?? new Date(),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
