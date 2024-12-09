import { createEvents } from "ics";
import { supabase } from "./supabaseClient";

/**
 * Generates an ICS file and uploads it to a Supabase bucket.
 * @param {Array} scheduleEvents - Array of class events.
 * @param {Array} holidayEvents - Array of holiday events.
 * @param {string} className - Name of the class for naming the ICS file.
 * @param {string} notes - Allows notes to be included in the ICS file.
 * @returns {string} Public URL of the uploaded ICS file.
 */
export const generateICSAndUpload = async (scheduleEvents, holidayEvents, className, notes) => {
  const allEvents = [
    ...scheduleEvents.map((event) => ({
      title: event.title,
      start: event.start,
      duration: event.duration,
      location: sanitizeText(event.location),
      description: event.description + (notes ? `\n\nNotes: ${notes}` : ""),
    })),
    ...holidayEvents.map((holiday) => ({
      title: holiday.name,
      start: [
        holiday.date.getFullYear(),
        holiday.date.getMonth() + 1,
        holiday.date.getDate(),
      ],
      description: `${holiday.name} Holiday` + (notes ? `\n\nNotes: ${notes}` : ""),
    })),
  ];

  return new Promise((resolve, reject) => {
    createEvents(allEvents, async (error, value) => {
      if (error) {
        console.error("ICS file generation error:", error);
        reject(new Error("Failed to generate ICS file: " + JSON.stringify(error)));
        return;
      }

      try {
        const fileName = `${className.replace(/\s+/g, "_")}.ics`;
        const filePath = 'public/' + fileName;
        const fileBody = new Blob([value], { type: "text/calendar;charset=utf-8" });

        console.log("Uploading ICS file...");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("ics-files")
          .upload(filePath, fileBody, { cacheControl: "3600", upsert: true });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          reject(new Error("Error uploading ICS file."));
          return;
        }

        console.log("Upload successful:", uploadData);
        

        console.log("Generating Public URL...");
        const { data, error } = await supabase.storage
          .from('ics-files')
          .getPublicUrl(filePath, 60);

        if (error) {
          console.error("Public URL error:", error);
          reject(new Error("Error generating signed URL."));
          return;
        }

        console.log("Generated Public URL:", data);
        resolve(data);
      } catch (err) {
        console.error("Unexpected error during ICS upload process:", err);
        reject(err);
      }
    });
  });
};


