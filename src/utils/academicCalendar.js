export const academicCalendar = {
  fall2024: {
    termStart: "2024-08-26",
    holidays: [
      { name: "Labor Day: No Classes", date: "2024-09-02" },
      { name: "Fall Break: No Classes", start: "2024-10-10", end: "2024-10-11", id: "fallBreak2024" },
      { name: "Thanksgiving Holiday Recess: No Classes", start: "2024-11-27", end: "2024-12-01", id: "thanksgiving2024" },
      { name: "Christmas Eve/Day: No Classes", start: "2024-12-24", end: "2024-12-25", id: "christmas2024" }
    ],
    termEnd: "2024-12-20",
    first8WeekEnd: "2024-10-19",
    second8WeekStart: "2024-10-21",
    second8WeekEnd: "2024-12-14",
    commencement: {
      start: "2024-12-13",
      end: "2024-12-14"
    },
    degreeConferral: "2024-12-20"
  },

  spring2025: {
    termStart: "2025-01-21",
    holidays: [
      { name: "MLK Day: No Classes", date: "2025-01-20" },
      { name: "Spring Break: No Classes", start: "2025-03-17", end: "2025-03-21", id: "springBreak2025" },
      { name: "Easter Holiday Break: No Classes", start: "2025-04-17", end: "2025-04-21", id: "easterBreak2025" }
    ],
    termEnd: "2025-05-23",
    januarySession: {
      start: "2025-01-06",
      end: "2025-01-17"
    },
    first8Week: {
      start: "2025-01-21",
      end: "2025-03-15"
    },
    second8Week: {
      start: "2025-03-24",
      end: "2025-05-17"
    },
    commencement: {
      start: "2025-05-16",
      end: "2025-05-17"
    },
    degreeConferral: "2025-05-23"
  },

  summer2025: {
    termStart: "2025-05-19",
    holidays: [
      { name: "Memorial Day: No Classes", date: "2025-05-26" },
      { name: "Juneteenth Observed: No Classes", date: "2025-06-19" },
      { name: "Independence Day: No Classes", date: "2025-07-04" }
    ],
    termEnd: "2025-08-29",
    sessions: {
      "14Week": {
        start: "2025-05-19",
        end: "2025-08-23"
      },
      "first7Week": {
        start: "2025-05-19",
        end: "2025-07-05"
      },
      "second7Week": {
        start: "2025-07-07",
        end: "2025-08-23"
      },
      "4Week": {
        start: "2025-05-19",
        end: "2025-06-14"
      },
      "6Week": {
        start: "2025-06-02",
        end: "2025-07-12"
      },
      "10 Week": {
        start: "2025-05-19",
        end: "2025-07-19"
      },
      "8WeekStAugustine": {
        start: "2025-06-02",
        end: "2025-07-26"
      }
    },
    degreeConferral: "2025-08-29"
  },

  fall2025: {
    termStart: "2025-08-25",
    holidays: [
      { name: "Labor Day: No Classes", date: "2025-09-01" },
      { name: "Fall Break: No Classes", start: "2025-10-16", end: "2025-10-17", id: "fallBreak2025" },
      { name: "Thanksgiving Holiday: No Classes", start: "2025-11-26", end: "2025-11-30", id: "thanksgiving2025" }
    ],
    termEnd: "2025-12-19"
  }
};