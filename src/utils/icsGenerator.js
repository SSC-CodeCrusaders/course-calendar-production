import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createEvents } from "ics";
import { storage } from "./firebase";

function calculateDuration(start, end) {
  try {
    const [startHour, startMinute] = start.split(":".padEnd(5, "0")).map(Number);
    const [endHour, endMinute] = end.split(":".padEnd(5, "0")).map(Number);

    let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    if (totalMinutes < 0) totalMinutes += 24 * 60;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours: isNaN(hours) ? 1 : hours, minutes: isNaN(minutes) ? 0 : minutes };
  } catch (e) {
    return { hours: 1, minutes: 0 };
  }
}

export async function generateICSAndUpload(scheduleEvents, holidays, calendarName) {
  const events = scheduleEvents.map((event) => {
    const { hours, minutes } = calculateDuration(event.startTime, event.endTime);

    return {
      title: event.className,
      start: (() => {
        try {
          const d = new Date(event.start);
          if (isNaN(d)) throw new Error("Invalid start date");
          return [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()];
        } catch (err) {
          console.error("Invalid event.start for event:", event);
          throw err;
        }
      })(),
      duration: {
        hours,
        minutes,
      },
      location: event.location,
      description: `Instructor: ${event.instructorName}`,
    };
  });
  
  holidays.forEach((holiday) => {
    const isNoClasses = holiday.name?.toLowerCase().includes("no classes");
    if (isNoClasses) return;
    events.push({ /* ... */ });
  });

  return new Promise((resolve, reject) => {
    createEvents(events, async (error, value) => {
      if (error) {
        console.error("ICS file generation error:", error);
        reject(new Error("Failed to generate ICS file: " + JSON.stringify(error)));
        return;
      }

      const blob = new Blob([value], { type: "text/calendar" });
      const fileRef = ref(storage, `ics/${calendarName}-${Date.now()}.ics`);

      try {
        console.log("Uploading ICS file...");
        await uploadBytes(fileRef, blob);
        const url = await getDownloadURL(fileRef);
        resolve(url);
        console.log("Generated Public URL:", data);
      } catch (err) {
        console.error("Unexpected error during ICS upload process:", err);
        reject(err);
      }
    });
  });
};