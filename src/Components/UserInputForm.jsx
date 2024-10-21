import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { academicCalendar } from "../utils/academicCalendar";
import { generateSchedule } from "../utils/scheduleGenerator";
import { generateICS } from "../utils/icsGenerator";

const UserInputForm = ({ currentIndex, calendars = [], setCalendars }) => {
  const defaultValues = calendars[currentIndex] || {
    firstDay: "",
    lastDay: "",
    classTime: "",
    daysOfClass: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    instructorName: "",
    className: "",
    location: "",
    academicTerm: "fall2024", // Default term
  };

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues,
  });

  const [academicTerm, setAcademicTerm] = useState(defaultValues.academicTerm);

  // Update academicTerm in form when state changes
  useEffect(() => {
    setValue("academicTerm", academicTerm);
  }, [academicTerm, setValue]);

  const onSubmit = (data) => {
    try {
      // Validate that firstDay is before lastDay
      const startDate = new Date(data.firstDay);
      const endDate = new Date(data.lastDay);
      if (startDate > endDate) {
        toast.error("Start date must be before end date.");
        return;
      }

      // Update calendars state
      const updatedCalendars = calendars.map((calendar, i) =>
        i === currentIndex ? data : calendar
      );
      setCalendars(updatedCalendars);
      toast.success("Schedule saved successfully!");

      // Generate Schedule Events
      const scheduleEvents = generateSchedule(data);

      // Generate Holiday Events
      const termHolidays = academicCalendar[data.academicTerm]?.holidays || [];
      const holidayEvents = termHolidays.flatMap((holiday) => {
        if (holiday.date) {
          return [
            {
              name: holiday.name,
              date: new Date(holiday.date),
            },
          ];
        }
        if (holiday.start && holiday.end) {
          const start = new Date(holiday.start);
          const end = new Date(holiday.end);
          const dates = [];
          let current = new Date(start);
          while (current <= end) {
            dates.push({
              name: holiday.name,
              date: new Date(current),
            });
            current.setDate(current.getDate() + 1);
          }
          return dates;
        }
        return [];
      });

      // Generate ICS File
      generateICS(scheduleEvents, holidayEvents, data.className);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save schedule.");
    }
  };

  return (
    <div className="bg-lewisRed min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">
        Class Schedule Creator
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center"
      >
        {/* Academic Term Selection */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="academicTerm" className="mr-4">
            Academic Term:{" "}
          </label>
          <Controller
            name="academicTerm"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                onChange={(e) => {
                  setAcademicTerm(e.target.value);
                  field.onChange(e);
                }}
                className="p-2 border rounded text-center"
              >
                {Object.keys(academicCalendar).map((term) => (
                  <option key={term} value={term}>
                    {term.charAt(0).toUpperCase() + term.slice(1)}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Start Date */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="firstDay" className="mr-4">
            Start of Course Date:{" "}
          </label>
          <Controller
            name="firstDay"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="date"
                {...field}
                className="p-2 border rounded text-center"
                required
              />
            )}
          />
        </div>

        {/* End Date */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="lastDay" className="mr-4">
            End of Course Date:
          </label>
          <Controller
            name="lastDay"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="date"
                {...field}
                className="p-2 border rounded text-center"
                required
              />
            )}
          />
        </div>

        {/* Class Time */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="classTime" className="mr-4">
            Class Time (24h format):
          </label>
          <Controller
            name="classTime"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="time"
                {...field}
                className="p-2 border rounded text-center"
                required
              />
            )}
          />
        </div>

        {/* Days of Class */}
        <h2 className="text-center mb-4">Course Days:</h2>
        <div className="mb-4 flex-wrap flex justify-center items-center">
          {Object.keys(watch("daysOfClass")).map((day) => (
            <div key={day} className="mr-4 flex items-center">
              <label htmlFor={day} className="mr-2">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </label>
              <Controller
                name={`daysOfClass.${day}`}
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    {...field}
                    className="form-checkbox"
                  />
                )}
              />
            </div>
          ))}
        </div>

        {/* Instructor Name */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="instructorName" className="mr-4">
            Instructor Name:{" "}
          </label>
          <Controller
            name="instructorName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="text"
                {...field}
                className="p-2 border rounded text-center"
                required
              />
            )}
          />
        </div>

        {/* Course Name */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="className" className="mr-4">
            Course Name:{" "}
          </label>
          <Controller
            name="className"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="text"
                {...field}
                className="p-2 border rounded text-center"
                required
              />
            )}
          />
        </div>

        {/* Location */}
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="location" className="mr-4">
            Course Location:{" "}
          </label>
          <Controller
            name="location"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <input
                type="text"
                {...field}
                className="p-2 border rounded text-center"
                required
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 bg-lewisRed text-white px-4 py-2 rounded"
        >
          Save Schedule & Generate ICS
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
