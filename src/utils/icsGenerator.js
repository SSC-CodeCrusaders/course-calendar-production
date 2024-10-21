import { createEvents } from "ics";
import { saveAs } from "file-saver";

/**
 * Generates and downloads an ICS file based on the provided events.
 * @param {Array} scheduleEvents - Array of class events.
 * @param {Array} holidayEvents - Array of holiday events.
 * @param {string} className - Name of the class for naming the ICS file.
 */
export const generateICS = (scheduleEvents, holidayEvents, className) => {
  const allEvents = [
    ...scheduleEvents.map((event) => ({
      title: event.title,
      start: event.start,
      duration: event.duration,
      location: event.location,
      description: event.description,
    })),
    ...holidayEvents.map((holiday) => ({
      title: holiday.name,
      start: [
        holiday.date.getFullYear(),
        holiday.date.getMonth() + 1,
        holiday.date.getDate(),
      ],
      description: `${holiday.name} Holiday`,
    })),
  ];

  createEvents(allEvents, (error, value) => {
    if (error) {
      console.error(error);
      alert("Failed to generate ICS file.");
      return;
    }

    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
    saveAs(blob, `${className.replace(/\s+/g, "_")}.ics`);
    alert("ICS file generated successfully!");
  });
};
