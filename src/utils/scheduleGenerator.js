import { academicCalendar } from "./academicCalendar";

/**
 * Checks if a given date is a holiday or within a holiday period.
 * @param {Date} date - The date to check.
 * @param {Array} holidays - Array of holiday objects.
 * @returns {boolean}
 */
const isHoliday = (date, holidays) => {
  return holidays.some((holiday) => {
    if (holiday.date) {
      const holidayDate = new Date(holiday.date);
      return (
        date.getFullYear() === holidayDate.getFullYear() &&
        date.getMonth() === holidayDate.getMonth() &&
        date.getDate() === holidayDate.getDate()
      );
    }
    if (holiday.start && holiday.end) {
      const start = new Date(holiday.start);
      const end = new Date(holiday.end);
      return date >= start && date <= end;
    }
    return false;
  });
};

/**
 * Generates a schedule of class events excluding holidays.
 * @param {Object} data - The form data containing schedule details.
 * @returns {Array} - Array of class events.
 */
export const generateSchedule = (data) => {
  const {
    firstDay,
    lastDay,
    daysOfClass,
    instructorName,
    className,
    location,
    academicTerm,
    startTime,
    endTime,
  } = data;

  const term = academicCalendar[academicTerm] || { holidays: [] };
  const holidays = term.holidays;

  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);

  if (isNaN(startDate) || isNaN(endDate)) {
    throw new Error("Invalid start or end date.");
  }

  const schedule = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayName = currentDate
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    if (daysOfClass[dayName] && !isHoliday(currentDate, holidays)) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const durationHours = endHour - startHour;
      const durationMinutes = endMinute - startMinute;

      schedule.push({
        title: className,
        start: [
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate(),
          startHour,
          startMinute,
        ],
        duration: {
          hours: durationHours,
          minutes: durationMinutes,
        },
        location: location,
        description: `Instructor: ${instructorName}`,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedule;
};