export const getHolidaysThisMonth = (holidays, currentMonth, currentYear) => {
    return holidays.filter(h => {
        if (h.date) {
            const eventDate = new Date(h.date);
            return (
                eventDate.getMonth() === currentMonth &&
                eventDate.getFullYear() === currentYear
            );
        } else if (h.startDate && h.endDate) {
            const start = new Date(h.startDate);
            const end = new Date(h.endDate);
            return (
                (start.getFullYear() < currentYear ||
                    (start.getFullYear() === currentYear && start.getMonth() <= currentMonth)) &&
                (end.getMonth() >= currentMonth && end.getFullYear() >= currentYear)
            );
        }
        return false;
    });
};

export const getGreyedOutDates = (currentMonth, currentYear, daysInMonth, holidaysThisMonth) => {
    const greyedOut = new Set();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        if (date.getDay() === 0 || date.getDay() === 6) {
            greyedOut.add(day);
        }
    }
    holidaysThisMonth.forEach(h => {
        if (h.name.includes("No Classes")) {
            if (h.date) {
                const holidayDate = new Date(h.date + 'T00:00:00');
                if (holidayDate.getMonth() === currentMonth && holidayDate.getFullYear() === currentYear) {
                    greyedOut.add(holidayDate.getDate());
                }
            } else if (h.startDate && h.endDate) {
                let currentDate = new Date(h.startDate + 'T00:00:00');
                const endDate = new Date(h.endDate + 'T00:00:00');
                while (currentDate <= endDate) {
                    if (currentDate.getMonth() === currentMonth && currentDate.getFullYear() === currentYear) {
                        greyedOut.add(currentDate.getDate());
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }
    });
    return greyedOut;
};

export const generateCalendarDays = (firstDayIndex, prevMonthDays, currentYear, currentMonth, daysInMonth, greyedOutDates) => {
    const prevDays = Array.from({ length: firstDayIndex }, (_, i) => {
        const day = prevMonthDays - firstDayIndex + i + 1;
        const date = new Date(currentYear, currentMonth - 1, day);
        return {
            day,
            month: date.getMonth(),
            year: date.getFullYear(),
            isPrevMonth: true,
            isGreyedOut: date.getDay() === 0 || date.getDay() === 6,
        };
    });
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentYear, currentMonth, i + 1);
        return {
            day: i + 1,
            month: currentMonth,
            year: currentYear,
            isPrevMonth: false,
            isNextMonth: false,
            isGreyedOut: greyedOutDates.has(i + 1),
        };
    });
    const totalDays = prevDays.length + currentDays.length;
    const nextDaysCount = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    const nextDays = Array.from({ length: nextDaysCount }, (_, i) => {
        const date = new Date(currentYear, currentMonth + 1, i + 1);
        return {
            day: i + 1,
            month: date.getMonth(),
            year: date.getFullYear(),
            isNextMonth: true,
            isGreyedOut: date.getDay() === 0 || date.getDay() === 6,
        };
    });
    return [...prevDays, ...currentDays, ...nextDays];
};