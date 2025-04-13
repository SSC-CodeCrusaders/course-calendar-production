import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { academicCalendar } from "../../utils/academicCalendar";
import { generateICSAndUpload } from "../../utils/icsGenerator";
import { generateSchedule } from "../../utils/scheduleGenerator";
import { AuthContext } from "../../Context/AuthProvider";
// Added import for Firestore methods
import { addCalendar, updateUserCalendar } from "../../utils/firestoreDatabase"

const UserInputForm = ({ currentIndex, calendars, setCalendars }) => {
  const { user } = useContext(AuthContext);
  const currentCalendar = calendars?.[currentIndex] ?? {};
  
  const [notes, setNotes] = useState(currentCalendar.notes || "");
  if (!currentCalendar) {
    return <div className="text-center text-gray-500 mt-4">No calendar selected.</div>;
  }
  useEffect(() => {
    const updatedCalendars = calendars.map((calendar, index) =>
      index === currentIndex ? { ...calendar, notes } : calendar
    );
    setCalendars(updatedCalendars);
  }, [notes]);

  const saveScheduleHandler = async () => {
    try {
      const { className, instructorName, location, academicTerm, selectedTimeSlots, startTime, endTime, } = currentCalendar;
      const termStart = academicCalendar[academicTerm]?.termStart;
      const termEnd = academicCalendar[academicTerm]?.termEnd;
  
      // Validate required fields
      const missingFields = [];
      if (!termStart) missingFields.push("Start Date");
      if (!termEnd) missingFields.push("End Date");
      if (!className) missingFields.push("Class Name");
      if (!instructorName) missingFields.push("Instructor Name");
      if (!location) missingFields.push("Location");
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }
  
      const scheduleData = { ...currentCalendar, notes, firstDay: termStart, lastDay: termEnd, }; // Include notes
      if (user) {
        if (currentCalendar.id) {
          console.log("Update calendar", {userId: user.uid, calendarId: currentCalendar.id, data: scheduleData,});
          // Firestore updates the currently selected calendar
          await updateUserCalendar(user.uid, currentCalendar.id, scheduleData);

          // Supabase implementation for updating a calendar
          // await updateSchedule(currentCalendar.id, scheduleData);
          toast.success("Schedule updated to your account!");
        } else {
          await addCalendar(scheduleData);
          // Supabase method to save a calendar
          // const savedSchedule = await saveSchedule({ ...scheduleData, user_id: user.id });
          // updateCurrentCalendar("id", savedSchedule[0].id);
          toast.success("Schedule saved to your account!");
        }
      } else {
        localStorage.setItem("calendars", JSON.stringify(calendars));
        toast.success("Schedule saved locally!");
      }

      const scheduleEvents = generateSchedule({
        firstDay: termStart,
        lastDay: termEnd,
        selectedTimeSlots,
        instructorName,
        className,
        location,
        academicTerm,
        startTime,
        endTime,
        notes,
      });

      const holidayEvents = academicCalendar[academicTerm]?.holidays || [];

      const icsUrl = await generateICSAndUpload(scheduleEvents, holidayEvents, className);
      console.log("ICS file uploaded successfully. Accessible at: ", icsUrl);

    } catch (error) {
      console.error(error);
      toast.error("Failed to save schedule.");
    }
  };

  return (
    <div className="mt-1">
      {/* Main Schedule Form */}
      <form className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-3">Course Details</h2>
            <input 
              type="text" 
              placeholder="Class Name" 
              value={currentCalendar.className || ""}
              onChange={(e) => {
                const updated = [...calendars];
                updated[currentIndex].className = e.target.value;
                setCalendars(updated);
              }}
              className="p-3 border rounded-lg mb-4" 
            />
            <input 
              type="text" 
              placeholder="Instructor Name" 
              value={currentCalendar.instructorName || ""}
              onChange={(e) => {
                const updated = [...calendars];
                updated[currentIndex].instructorName = e.target.value;
                setCalendars(updated);
              }}
              className="p-3 border rounded-lg mb-4" 
            />
            <input 
              type="text" 
              placeholder="Location" 
              value={currentCalendar.location || ""}
              onChange={(e) => {
                const updated = [...calendars];
                updated[currentIndex].location = e.target.value;
                setCalendars(updated);
              }}
              className="p-3 border rounded-lg mb-4" />
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-2">Selected Class Times</h2>
            <ul className="list-disc pl-5 text-black mb-4">
              {Object.entries(currentCalendar.selectedTimeSlots ?? {}).map(([weekday, slots]) => (
                Array.isArray(slots) && slots.length > 0 && (
                <li key={weekday}>
                  <span className="font-bold capitalize">{weekday}:</span> {[...slots].join(", ")}
                </li>
                )
              ))}
            </ul>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block font-semibold text-lg">Notes (optional):</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="p-2 border rounded-lg w-full"
            rows="2"
          />
        </div>

        {/* Save and Generate Buttons */}
        <button
          type="button"
          onClick={saveScheduleHandler}
          className="mt-4 bg-lewisRedDarker text-white py-4 rounded-lg w-full font-semibold hover:bg-lewisRed transition"
        >
          Save Schedule
        </button>
      </form>
    </div>
  );
};

UserInputForm.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  calendars: PropTypes.array.isRequired,
  setCalendars: PropTypes.func.isRequired,
};

export default UserInputForm;
