import { useContext } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { academicCalendar } from "../../utils/academicCalendar";
import { saveSchedule, updateSchedule } from "../../utils/supabaseClient";
import { AuthContext } from "../../Context/AuthProvider";
import { generateICSAndUpload } from "../../utils/icsGenerator";

const UserInputForm = ({ currentIndex, calendars, setCalendars }) => {
  const { user } = useContext(AuthContext);
  const currentCalendar = calendars[currentIndex];

  const updateCurrentCalendar = (key, value) => {
    const updatedCalendars = calendars.map((calendar, index) =>
      index === currentIndex ? { ...calendar, [key]: value } : calendar
    );
    setCalendars(updatedCalendars);
  };

  const handleDayChange = (day) => {
    const updatedDays = {
      ...currentCalendar.daysOfClass,
      [day]: !currentCalendar.daysOfClass[day],
    };
    updateCurrentCalendar("daysOfClass", updatedDays);
  };

  const saveScheduleHandler = async () => {
    try {
      const { firstDay, lastDay, className, instructorName, location, notes } = currentCalendar;

      // Validate required fields
      if (!firstDay || !lastDay || !className || !instructorName || !location) {
        toast.error("Please fill out all required fields.");
        return;
      }

      if (user) {
        if (currentCalendar.id) {
          await updateSchedule(currentCalendar.id, currentCalendar);
          toast.success("Schedule updated in your account!");
        } else {
          const savedSchedule = await saveSchedule({ ...currentCalendar, user_id: user.id });
          updateCurrentCalendar("id", savedSchedule[0].id);
          toast.success("Schedule saved to your account!");
        }
      } else {
        localStorage.setItem("calendars", JSON.stringify(calendars));
        toast.success("Schedule saved locally!");
      }
      // This should generate the notes within the ICS file
      const publicUrl = await generateICSAndUpload(scheduleEvents, holidayEvents, className, notes);
      console.log('ICS file public URL:', publicUrl);

    } catch (error) {
      console.error(error);
      toast.error("Failed to save schedule.");
    }
  };

  return (
    <div className="bg-lewisRed min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Class Schedule Creator</h1>
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center">
        {/* Academic Term */}
        <div className="mb-4">
          <label htmlFor="academicTerm" className="block font-medium">
            Academic Term:
          </label>
          <select
            id="academicTerm"
            value={currentCalendar.academicTerm || ""}
            onChange={(e) => updateCurrentCalendar("academicTerm", e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="" disabled>
              Select an academic term
            </option>
            {Object.keys(academicCalendar).map((term) => (
              <option key={term} value={term}>
                {term.charAt(0).toUpperCase() + term.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="start-date" className="block font-medium">
            Start Date:
          </label>
          <input
            id="start-date"
            type="date"
            value={currentCalendar.firstDay || ""}
            onChange={(e) => updateCurrentCalendar("firstDay", e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="end-date" className="block font-medium">
            End Date:
          </label>
          <input
            id="end-date"
            type="date"
            value={currentCalendar.lastDay || ""}
            onChange={(e) => updateCurrentCalendar("lastDay", e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Start Time */}
        <div className="mb-4">
          <label htmlFor="start-time" className="block font-medium">
            Start Time:
          </label>
          <input
            id="start-time"
            type="time"
            value={currentCalendar.startTime || ""}
            onChange={(e) => updateCurrentCalendar("startTime", e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* End Time */}
        <div className="mb-4">
          <label htmlFor="end-time" className="block font-medium">
            End Time:
          </label>
          <input
            id="end-time"
            type="time"
            value={currentCalendar.endTime || ""}
            onChange={(e) => updateCurrentCalendar("endTime", e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Days of Class */}
        <h2 className="text-center mb-4">Course Days:</h2>
        <div className="mb-4 flex-wrap flex justify-center items-center">
          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
            <div key={day} className="mr-4 flex items-center">
              <label htmlFor={day} className="mr-2">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
              <input
                id={day}
                type="checkbox"
                checked={currentCalendar.daysOfClass[day] || false}
                onChange={() => handleDayChange(day)}
                className="form-checkbox"
              />
            </div>
          ))}
        </div>

        {/* Instructor Name */}
        <div className="mb-4">
          <label htmlFor="instructor-name" className="block font-medium">
            Instructor Name:
          </label>
          <input
            id="instructor-name"
            type="text"
            value={currentCalendar.instructorName || ""}
            onChange={(e) => updateCurrentCalendar("instructorName", e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Class Name */}
        <div className="mb-4">
          <label htmlFor="class-name" className="block font-medium">
            Class Name:
          </label>
          <input
            id="class-name"
            type="text"
            value={currentCalendar.className || ""}
            onChange={(e) => updateCurrentCalendar("className", e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="block font-medium">
            Location:
          </label>
          <input
            id="location"
            type="text"
            value={currentCalendar.location || ""}
            onChange={(e) => updateCurrentCalendar("location", e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Notes Section */}
          <div className="mb-4">
          <label htmlFor="notes" className="block font-medium">
            Notes:
          </label>
          <textarea
          id="notes"
          value={currentCalendar.notes || ""}
          onChange={(e) => updateCurrentCalendar("notes", e.target.value)}
          className="p-2 border rounded w-full"
          rows="4"
          placeholder="Add any additional notes here..."
          />
        </div>

        {/* Save and Generate Buttons */}
        <button
          type="button"
          onClick={saveScheduleHandler}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded mr-4"
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
