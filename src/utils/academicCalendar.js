// parseLocalDate ensures that each of the holidays follows within our timezone.
function parseLocalDate(str) {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/* Potentially this could be improved if there was a way for us to automatically take these dates from Lewis' 
* Academic Calendar Page, but currently, all of these dates need to be manually inputted.
* The Lewis Academic Calendar can be found here: https://www.lewisu.edu/academics/academiccalendar.htm
*/ 
export const academicCalendar = {
    // Terms must be formatted as either SP (spring), SU (summer), or FA (Fall), with the appropriate year.
    SP2025: {
      // termStart/termEnd is what CalendarPage.jsx uses to determine how long a term needs to be.
      termStart: parseLocalDate("2025-01-21"),
      /* Holiday dates must be formatted as YYYY-MM-DD, so do not forget to include zeros.
       * - If it is a holiday where class is not being held, the name must include "No Classes". This is to prevent it from showing up in ICS form.
       * Any days that do not have "No Classes" within the name will not be excluded from showing up in ICS files.
       * - If it is a holiday that spans multiple days, you must use startDate/endDate.
       * - If there are multiple holidays that have the same day (Except for those that span multiple days), you
       * need to put an "id" tag, so CalendarPage.jsx can differentiate them. Refer to 2025-05-19 as an example of formatting.
       * - Every date NEEDS to be enclosed by "parseLocalDate", CalendarPage.jsx will show those events on incorrect days if
       * it is not included.
       */
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
    
    FA2025: {
      termStart: parseLocalDate("2025-08-25"),
      holidays: [
        { date: parseLocalDate("2025-08-25"), name: "Start of Fall Semester", id: '2025-08-25-1'},
        { date: parseLocalDate("2025-08-25"), name: "Start of First 8-Week Session", id: '2025-08-25-2' },
        { date: parseLocalDate("2025-09-01"), name: "Labor Day: No Classes" },
        { startDate: parseLocalDate("2025-10-16"), endDate: parseLocalDate("2025-10-17"), name: "Fall Break: No Classes" },
        { date: parseLocalDate("2025-10-18"), name: "End of First 8-Week Session" },
        { date: parseLocalDate("2025-10-20"), name: "Start of Second 8-Week Session" },
        { startDate: parseLocalDate("2025-11-26"), endDate: parseLocalDate("2025-11-30"), name: "Thanksgiving Holiday: No Classes" },
        { date: parseLocalDate("2025-12-13"), name: "End of Second 8-Week Session", id: '2025-12-13-1' },
        { date: parseLocalDate("2025-12-13"), name: "End of Fall Semester", id: '2025-12-13-2' },
        { startDate: parseLocalDate("2025-12-12"), endDate: parseLocalDate("2025-12-13"), name: "Commencement Weekend" },
        { date: parseLocalDate("2025-12-19"), name: "Fall Term Degree Conferral Date" },
        { startDate: parseLocalDate("2025-12-24"), endDate: parseLocalDate("2025-12-25"), name: "Christmas Eve/Day" },
      ],
      termEnd: parseLocalDate("2025-12-13"),
    },
  
    SP2026: {
      termStart: parseLocalDate("2026-01-20"),
      holidays: [
        { date: parseLocalDate("2026-01-05"), name: "Start of January Session" },
        { date: parseLocalDate("2026-01-16"), name: "End of January Session" },
        { date: parseLocalDate("2026-01-19"), name: "MLK Day: No Classes" },
        { date: parseLocalDate("2026-01-20"), name: "Start of Spring Semester", id: '2026-01-20-1' },
        { date: parseLocalDate("2026-01-20"), name: "Start of First 8-Week Session", id: '2026-01-20-2' },
        { date: parseLocalDate("2026-03-14"), name: "End of First 8-Week Session" },
        { startDate: parseLocalDate("2026-03-16"), endDate: parseLocalDate("2026-03-20"), name: "Spring Break: No Classes" },
        { date: parseLocalDate("2026-03-23"), name: "Start of Second 8-Week Session", id: '2026-03-23-1' },
        { date: parseLocalDate("2026-03-23"), name: "Spring Semester Classes Resume", id: '2026-03-23-2' },
        { startDate: parseLocalDate("2026-04-02"), endDate: parseLocalDate("2026-04-06"), name: "Easter Holiday Break: No Classes" },
        { date: parseLocalDate("2026-05-16"), name: "End of Second 8-Week Session", id: '2026-05-16-1' },
        { date: parseLocalDate("2026-05-16"), name: "End of Spring Semester", id: '2026-05-16-2' },
        { startDate: parseLocalDate("2026-05-15"), endDate: parseLocalDate("2026-05-16"), name: "Commencement Weekend" },
        { date: parseLocalDate("2026-05-22"), name: "Spring Term Degree Conferral Date" },
      ],
      termEnd: parseLocalDate("2026-05-16"),
    },
  
    SU2026: {
      termStart: parseLocalDate("2026-05-18"),
      holidays: [
        { date: parseLocalDate("2026-05-18"), name: "Start of Summer Semester", id: '2026-05-18-1' },
        { date: parseLocalDate("2026-05-18"), name: "Start of 14-Week Session", id: '2026-05-18-2' },
        { date: parseLocalDate("2026-05-18"), name: "Start of First 7-Week Session", id: '2026-05-18-3' },
        { date: parseLocalDate("2026-05-18"), name: "Start of 4-Week Session", id: '2026-05-18-4' },
        { date: parseLocalDate("2026-05-18"), name: "Start of 10-Week Session", id: '2026-05-18-5' },
        { date: parseLocalDate("2026-05-25"), name: "Memorial Day: No Classes" },
        { date: parseLocalDate("2026-06-01"), name: "Start of 6-Week Session", id: '2026-06-01-1' },
        { date: parseLocalDate("2026-06-01"), name: "Start of 8-Week Session (St. Augustine Combined)", id: '2026-06-01-2' },
        { date: parseLocalDate("2026-06-13"), name: "End of 4-Week Session" },
        { date: parseLocalDate("2026-06-19"), name: "Juneteenth Observed: No Classes" },
        { date: parseLocalDate("2026-07-02"), name: "End of First 7-Week Session" },
        { date: parseLocalDate("2026-07-04"), name: "Independence Day: No Classes" },
        { date: parseLocalDate("2026-07-06"), name: "Start of Second 7-Week Session" },
        { date: parseLocalDate("2026-07-11"), name: "End of 6-Week Session" },
        { date: parseLocalDate("2026-07-18"), name: "End of 10-Week Session" },
        { date: parseLocalDate("2026-07-25"), name: "End of 8-Week Session (St. Augustine Combined)" },
        { date: parseLocalDate("2026-08-22"), name: "End of Second 7-Week Session", id: '2026-08-22-1' },
        { date: parseLocalDate("2026-08-22"), name: "End of 14-Week Session", id: '2026-08-22-2' },
        { date: parseLocalDate("2026-08-22"), name: "End of Summer Semester", id: '2026-08-22-3' },
        { date: parseLocalDate("2026-08-28"), name: "Summer Term Degree Conferral Date" },
      ],
      termEnd: parseLocalDate("2026-08-22"),
    },

    FA2026: {
      termStart: parseLocalDate("2026-08-24"),
      holidays: [
        { date: parseLocalDate("2026-08-24"), name: "Start of Fall Semester", id: "2026-08-24-1" },
        { date: parseLocalDate("2026-08-24"), name: "Start of First 8-Week Session", id: "2026-08-24-2" },
        { date: parseLocalDate("2026-09-07"), name: "Labor Day: No Classes" },
        { startDate: parseLocalDate("2026-10-15"), endDate: parseLocalDate("2026-10-16"), name: "Fall Break: No Classes" },
        { date: parseLocalDate("2026-10-17"), name: "End of First 8-Week Session" },
        { date: parseLocalDate("2026-10-19"), name: "Start of Second 8-Week Session" },
        { startDate: parseLocalDate("2026-11-25"), endDate: parseLocalDate("2026-11-29"), name: "Thanksgiving Holiday: No Classes" },
        { date: parseLocalDate("2026-12-12"), name: "End of Second 8-Week Session", id: "2026-12-12-1" },
        { date: parseLocalDate("2026-12-12"), name: "End of Fall Semester", id: "2026-12-12-2" },
        { startDate: parseLocalDate("2026-12-11"), endDate: parseLocalDate("2026-12-12"), name: "Commencement Weekend" },
        { date: parseLocalDate("2026-12-18"), name: "Fall Term Degree Conferral Date" },
        { startDate: parseLocalDate("2026-12-24"), endDate: parseLocalDate("2026-12-25"), name: "Christmas Eve/Day" },
      ],
      termEnd: parseLocalDate("2026-12-12"),
    },

    SP2027: {
      termStart: parseLocalDate("2027-01-05"),
      holidays: [
        { date: parseLocalDate("2027-01-05"), name: "Start of January Session" },
        { date: parseLocalDate("2027-01-15"), name: "End of January Session" },
        { date: parseLocalDate("2027-01-18"), name: "MLK Day: No Classes" },
        { date: parseLocalDate("2027-01-19"), name: "Start of Spring Semester", id: "2027-01-19-1" },
        { date: parseLocalDate("2027-01-19"), name: "Start of First 8-Week Session", id: "2027-01-19-2" },
        { date: parseLocalDate("2027-03-13"), name: "End of First 8-Week Session" },
        { startDate: parseLocalDate("2027-03-15"), endDate: parseLocalDate("2027-03-19"), name: "Spring Break: No Classes" },
        { date: parseLocalDate("2027-03-22"), name: "Start of Second 8-Week Session" },
        { startDate: parseLocalDate("2027-03-25"), endDate: parseLocalDate("2027-03-29"), name: "Easter Holiday Break: No Classes" },
        { date: parseLocalDate("2027-05-15"), name: "End of Second 8-Week Session", id: "2027-05-15-1" },
        { date: parseLocalDate("2027-05-15"), name: "End of Spring Semester", id: "2027-05-15-2" },
        { startDate: parseLocalDate("2027-05-14"), endDate: parseLocalDate("2027-05-15"), name: "Commencement Weekend" },
        { date: parseLocalDate("2027-05-21"), name: "Spring Term Degree Conferral Date" },
      ],
      termEnd: parseLocalDate("2027-05-15"),
    },

    SU2027: {
      termStart: parseLocalDate("2027-05-17"),
      holidays: [
        { date: parseLocalDate("2027-05-17"), name: "Start of Summer Semester", id: "2027-05-17-1" },
        { date: parseLocalDate("2027-05-17"), name: "Start of 14-Week Session", id: "2027-05-17-2" },
        { date: parseLocalDate("2027-05-17"), name: "Start of First 7-Week Session", id: "2027-05-17-3" },
        { date: parseLocalDate("2027-05-17"), name: "Start of 4-Week Session", id: "2027-05-17-4" },
        { date: parseLocalDate("2027-05-17"), name: "Start of 10-Week Session", id: "2027-05-17-5" },
        { date: parseLocalDate("2027-05-31"), name: "Memorial Day: No Classes", id: "2027-05-31-1" },
        { date: parseLocalDate("2027-05-31"), name: "Start of 8-Week Session (Combiled with St. Augustine Summer)", id: "2027-05-31-2" },
        { date: parseLocalDate("2027-05-31"), name: "Start of 6-Week Session", id: "2027-05-31-3" },
        { date: parseLocalDate("2027-06-12"), name: "End of 4-Week Session" },
        { date: parseLocalDate("2027-06-19"), name: "Junteenth Observed: No Classes" },
        { date: parseLocalDate("2027-07-02"), name: "End of First 7-Week Session" },
        { startDate: parseLocalDate("2027-07-04"), endDate: parseLocalDate("2027-07-05"), name: "Independence Day: No Classes" },
        { date: parseLocalDate("2027-07-06"), name: "Start of Second 7-Week Session" },
        { date: parseLocalDate("2027-07-10"), name: "End of 6-Week Session" },
        { date: parseLocalDate("2027-07-17"), name: "End of 10-Week Session" },
        { date: parseLocalDate("2027-07-24"), name: "End of 8-Week Session" },
        { date: parseLocalDate("2027-08-21"), name: "End of Second 7-Week Session", id: "2027-08-21-1" },
        { date: parseLocalDate("2027-08-21"), name: "End of 14-Week Session", id: "2027-08-21-2" },
        { date: parseLocalDate("2027-08-21"), name: "End of Summer Semester", id: "2027-08-21-3" },
        { date: parseLocalDate("2027-08-27"), name: "Summer Term Degree Conferral Date" },
      ],
      termEnd: parseLocalDate("2027-08-21"),
    }
  };
  
