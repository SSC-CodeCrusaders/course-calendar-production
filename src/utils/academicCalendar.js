function parseLocalDate(str) {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export const academicCalendar = {
    SP2025: {
      termStart: parseLocalDate("2025-01-21"),
      holidays: [
        {date: parseLocalDate('2025-01-20'), name: 'Birthday of Martin Luther King Jr.'},
        {date: parseLocalDate('2025-01-21'), name: 'Full Day of Classes for the 16-Week Term and First 8-Week Session'},
        {date: parseLocalDate('2025-03-15'), name: 'Last Day of Classes for First 8-Week Session'},
        {startDate: parseLocalDate('2025-03-17'), endDate: parseLocalDate('2025-03-22'), name: 'Spring Break: No Classes'},
        {date: parseLocalDate('2025-03-24'), name: 'Classes Resume for 16-Week Term and Start Second 8-Week Session'},
        {startDate: parseLocalDate('2025-04-17'), endDate: parseLocalDate('2025-04-21'), name: 'Easter Holiday Recess: No Classes'},
        {date: parseLocalDate('2025-05-10'), name: 'Final Day of Classes for 16-Week Term'},
        {startDate: parseLocalDate('2025-05-12'), endDate: parseLocalDate('2025-05-17'), name: 'Final Exams for 16-Week Term'},
        {date: parseLocalDate('2025-05-17'), name: 'Last Day of Classes for the Second 8-Week Session'},
        {startDate: parseLocalDate('2025-05-16'), endDate: parseLocalDate('2025-05-17'), name: 'Commencement Weekend'},
        {date: parseLocalDate('2025-05-23'), name: 'Spring Term Degree Conferral Date'},
      ],
      termEnd: parseLocalDate("2025-05-17"),
    },
    SU2025: {
      termStart: parseLocalDate("2025-05-19"),
      holidays: [
        {date: parseLocalDate('2025-05-19'), name: 'Start First 7-Week Session', id: '2025-05-19-1'},
        {date: parseLocalDate('2025-05-19'), name: 'Standard 4-Week Session (dates may vary, standard end date June 15)', id: '2025-05-19-2'},
        {date: parseLocalDate('2025-05-19'), name: 'Standard 10-Week Session (dates may vary, standard end date July 19)', id: '2025-05-19-3'},
        {date: parseLocalDate('2025-05-19'), name: 'Start Standard 14-Week Session', id: '2025-05-19-4'},
        {date: parseLocalDate('2025-06-02'), name: 'Standard 6-Week Session (dates may vary, standard end July 13)', id: '2025-06-02-1'},
        {date: parseLocalDate('2025-06-02'), name: 'Standard 8-Week Session (dates may vary, standard end July 26)', id: '2025-06-02-2'},
        {date: parseLocalDate('2025-06-19'), name: 'Juneteenth Observed: No Classes'},
        {startDate: parseLocalDate('2025-07-03'), endDate: parseLocalDate('2025-07-04'), name: 'Independence Day Holiday: No Classes'},
        {date: parseLocalDate('2025-07-05'), name: 'End First 7-Week Session'},
        {date: parseLocalDate('2025-07-07'), name: 'Start Second 7-Week Session'},
        {date: parseLocalDate('2025-08-23'), name: 'End of 14-Week Term and Second 7-Week Term'},
        {date: parseLocalDate('2025-08-29'), name: 'Summer Term Degree Conferral Date'},
      ],
      termEnd: parseLocalDate("2025-08-23"),
    },
  };
  