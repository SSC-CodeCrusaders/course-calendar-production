import { academicCalendar } from "./academicCalendar";

function normalizeDate(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isHolidayNoClasses(date, holidays) {
  const normDate = normalizeDate(date);
  return holidays.some((holiday) => {
    const nameContainsNoClasses =
      holiday.name && holiday.name.toLowerCase().includes("no classes");
    if (!nameContainsNoClasses) {
      return false;
    }
    if (holiday.date) {
      const holidayDate = normalizeDate(new Date(holiday.date));
      return normDate.getTime() === holidayDate.getTime();
    } 
    if (holiday.startDate && holiday.endDate) {
      const start = normalizeDate(new Date(holiday.startDate));
      const end = normalizeDate(new Date(holiday.endDate));
      return normDate >= start && normDate <= end;
    }
    return false;
  });
}

const dayToIndex = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  };

  function parseTimeRange(slot) {
   try {
    const [startStr, endStr] = slot.split(" - ");
    const parse = (timeString) => {
      const safeTime = timeString.replace(/([APap][Mm])$/, ' $1');
      const d = new Date(`January 1, 2000 ${safeTime}`);
      if (isNaN(d)) throw new Error("Invalid time: " + t);
      return [d.getHours(), d.getMinutes()];
    };
    const [sh, sm] = parse(startStr);
    const [eh, em] = parse(endStr);
    return [sh, sm, eh, em];
   } catch (err) {
    console.error("Invalid slot time:", slot);
    return [NaN, NaN, NaN, NaN];
   }
  }

  export const generateSchedule = ({
    firstDay,
    lastDay,
    selectedTimeSlots,
    instructorName,
    className,
    location,
    academicTerm,
    notes,
    reminderMinutes,
  }) => {
  const holidays = academicCalendar[academicTerm]?.holidays || [];
  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);
  const events = [];

  const current = new Date(startDate);

  while(current <= endDate) {
    const dayName = current.toLocaleString("en-US", { weekday: "long" }).toLowerCase();
    const slots = selectedTimeSlots[dayName];

    const normalized = new Date(current.getFullYear(), current.getMonth(), current.getDate());
    const isHoliday = isHolidayNoClasses(normalized, holidays);
    console.log(`[DEBUG] Date: ${normalized.toISOString()}`);
    console.log(` Day: ${dayName}`);
    console.log(` Slots:`, slots);
    console.log(` Is Holiday (No Classes):`, isHoliday);
    if (slots && slots.length > 0 && !isHoliday) {
    
      for (const slot of slots) {
        const [sh, sm, eh, em] = parseTimeRange(slot);
        const durationHours = eh - sh + (em - sm < 0 ? -1 : 0);
        const durationMinutes = (em - sm + 60) % 60;

        events.push ({
          className,
          instructorName,
          location,
          notes,
          reminderMinutes,
          slotLabel: slot,
          start: new Date(
            current.getFullYear(),
            current.getMonth(),
            current.getDate(),
            sh,
            sm
          ),
          startTime: `${sh}:${sm}`,
          endTime: `${eh}:${em}`,
          duration: {
            hours: durationHours,
            minutes: durationMinutes,
          },
        });
      }
    }
    current.setDate(current.getDate() + 1);
  }
  return events;
};