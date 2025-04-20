import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { academicCalendar } from "../../utils/academicCalendar";
import { AuthContext } from "../../Context/AuthProvider";
// Added import for Firestore methods
import { addCalendar, updateUserCalendar } from "../../utils/firestoreDatabase"

const UserInputForm = ({ currentIndex, calendars, setCalendars }) => {
  const { user } = useContext(AuthContext);
  const currentCalendar = calendars[currentIndex] || {};
  const [notes, setNotes] = useState(currentCalendar.notes || "");

  useEffect(() => {
    setNotes(currentCalendar.notes || "");
  }, [currentIndex]);

  const getGreyedOutDatesForTerm = (term) => {
    const termHolidays = academicCalendar[term].holidays.filter(h => h.name.includes("No Classes"));
    const greyedOut = new Set();

    termHolidays.forEach(h => {
      const start = new Date(h.startDate || h.date);
      const end = new Date(h.endDate || h.date);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        greyedOut.add(d.toISOString().split('T')[0]);
      }
    });
    return greyedOut;
  };

  const saveScheduleHandler = async () => {
    
    const { className, instructorName, location, academicTerm, selectedTimeSlots, id, } = currentCalendar;
    const termStart = academicCalendar[academicTerm]?.termStart;
    const termEnd = academicCalendar[academicTerm]?.termEnd;

    const isEmptySlots = !selectedTimeSlots ||
      Object.values(selectedTimeSlots).every(arr => arr.length === 0);
    if (isEmptySlots) {
      toast.error("Please select at least one time slot before saving.");
      return;
    }
  
    // Validate required fields
    const missingFields = [];
    if (!termStart) missingFields.push("Start Date");
    if (!termEnd) missingFields.push("End Date");
    if (!className) missingFields.push("Class Name");
    if (!instructorName) missingFields.push("Instructor Name");
    if (!location) missingFields.push("Location");
    if (missingFields.length) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    const greyedOutDates = getGreyedOutDatesForTerm(academicTerm);
    const hasInvalidSlots = Object.entries(selectedTimeSlots).some(([day, slots]) => {
      return slots.some(slot => greyedOutDates.has(day));
    });
    if (hasInvalidSlots) {
      toast.error("Selected slots include invalid dates (weekends or holidays).");
      return;
    }
    
    const scheduleData = { 
      ...currentCalendar, 
      notes, 
      firstDay: termStart, 
      lastDay: termEnd, 
    };

    try {
      if (user) {
        if (currentCalendar.id) {
          console.log("Update calendar", {userId: user.uid, calendarId: currentCalendar.id, data: scheduleData,});
          await updateUserCalendar(user.uid, currentCalendar.id, scheduleData);
          toast.success("Schedule updated to your account!");
        } else {
          await addCalendar(scheduleData);
          toast.success("Schedule saved to your account!");
        }
      } else {
        localStorage.setItem("calendars", JSON.stringify(calendars));
        toast.success("Schedule saved locally!");
      }

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
            <h2 className="text-xl font-semibold mb-3">Course Details:</h2>
            <input 
              type="text" 
              placeholder="Class Name" 
              value={currentCalendar.className || ""}
              onChange={(e) => {
                const updated = [...calendars];
                updated[currentIndex].className = e.target.value;
                setCalendars(updated);
              }}
              className="p-3 border rounded-lg mb-2" 
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
              className="p-3 border rounded-lg mb-2" 
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
              className="p-3 border rounded-lg" />
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-1">Selected Class Times:</h2>
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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full md:w-1/2">
            <label htmlFor="notes" className="block font-semibold text-lg mb-1">Notes (Optional):</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="p-2 border rounded-lg w-full"
              rows="1"
            />
          </div>
          <div className="w-full md:w-1/2">
              <label htmlFor="reminder" className="block font-semibold text-lg mb-1">Reminder (Default = 30mins):</label>
              <input
                type="number"
                min="0"
                value={currentCalendar.reminderMinutes || 30}
                onChange={(e) => {
                  const updated = [...calendars];
                  updated[currentIndex].reminderMinutes = parseInt(e.target.value);
                  setCalendars(updated);
                }}
                className="p-2 border rounded-lg w-full"
              />
          </div>
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
