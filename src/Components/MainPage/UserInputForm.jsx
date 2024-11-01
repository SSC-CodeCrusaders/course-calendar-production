import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UserInputForm = () => {
  const { calendars, setCalendars, currentIndex } = useUser();

  const currentCalendar = calendars[currentIndex] || {
    firstDay: '',
    lastDay: '',
    startTime: '',
    endTime: '',
    daysOfClass: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    instructorName: '',
    className: '',
    location: '',
  };

  const validationSchema = Yup.object({
    firstDay: Yup.date().required('Required'),
    lastDay: Yup.date()
      .min(Yup.ref('firstDay'), 'End date must be after start date')
      .required('Required'),
    startTime: Yup.string().required('Required'),
    endTime: Yup.string()
      .test('is-greater', 'End time must be later than start time', function (value) {
        const { startTime } = this.parent;
        return startTime && value && startTime < value;
      })
      .required('Required'),
    instructorName: Yup.string().required('Required'),
    className: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
  });

  // Handler to toggle day checkboxes
  const handleDayChange = (day, values, setFieldValue) => {
    setFieldValue(`daysOfClass.${day}`, !values.daysOfClass[day]);
  };

  // Function to generate ICS content
  const generateICS = (calendar) => {
    const { firstDay, lastDay, startTime, endTime, daysOfClass, instructorName, className, location } = calendar;

    // Function to convert date to YYYYMMDD format
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (`0${d.getMonth() + 1}`).slice(-2);
      const day = (`0${d.getDate()}`).slice(-2);
      return `${year}${month}${day}`;
    };

    // Function to get all dates between start and end that match selected days
    const getEventDates = () => {
      const start = new Date(firstDay);
      const end = new Date(lastDay);
      const selectedDays = Object.keys(daysOfClass).filter(day => daysOfClass[day]);

      const dayMap = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };

      const dates = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayName = Object.keys(dayMap).find(key => dayMap[key] === d.getDay());
        if (selectedDays.includes(dayName)) {
          dates.push(new Date(d));
        }
      }
      return dates;
    };

    const dates = getEventDates();

    let events = '';
    dates.forEach((date) => {
      const eventDate = formatDate(date);
      events += `
BEGIN:VEVENT
DTSTAMP:${formatDate(new Date())}T000000Z
DTSTART:${eventDate}T${convertToUTC(startTime)}
DTEND:${eventDate}T${convertToUTC(endTime)}
SUMMARY:${className}
DESCRIPTION:${instructorName}
LOCATION:${location}
END:VEVENT
`;
    });

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Class Schedule//EN
${events}
END:VCALENDAR
`;

    return icsContent.trim();
  };

  // Function to convert time to HHMM00 format (24-hour)
  const convertToUTC = (time) => {
    // time is in "HH:MM" 24-hour format
    if (!time) return '000000'; // Fallback in case time is empty
    const [hours, minutes] = time.split(':').map(Number);
    const formattedHours = (`0${hours}`).slice(-2);
    const formattedMinutes = (`0${minutes}`).slice(-2);
    return `${formattedHours}${formattedMinutes}00`;
  };

  // Function to handle ICS download
  const handleDownloadICS = (calendar) => {
    try {
      const ics = generateICS(calendar);
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${calendar.className || 'calendar'}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('ICS file downloaded successfully!');
    } catch (error) {
      console.error('Error downloading ICS:', error);
      toast.error('Failed to download ICS file.');
    }
  };

  return (
    <div className="bg-lewisRed min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Class Schedule Creator</h1>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl border-none">
        <Formik
          initialValues={currentCalendar}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => {
            const updatedCalendars = calendars.map((calendar, index) =>
              index === currentIndex ? values : calendar
            );
            setCalendars(updatedCalendars);
            toast.success('Calendar updated successfully');
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Start of Course Date */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="firstDay" className="mr-4 w-full sm:w-1/3">Start of Course Date:</label>
                <Field
                  type="date"
                  name="firstDay"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="firstDay" component="div" className="text-red-500 text-sm mb-2" />

              {/* End of Course Date */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="lastDay" className="mr-4 w-full sm:w-1/3">End of Course Date:</label>
                <Field
                  type="date"
                  name="lastDay"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="lastDay" component="div" className="text-red-500 text-sm mb-2" />

              {/* Start and End Time */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="startTime" className="mr-4 w-full sm:w-1/3">Start Time:</label>
                <Field
                  type="time"
                  name="startTime"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm mb-2" />

              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="endTime" className="mr-4 w-full sm:w-1/3">End Time:</label>
                <Field
                  type="time"
                  name="endTime"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm mb-2" />

              {/* Days of Class */}
              <div className="mb-4">
                <h2 className="text-center mb-2">Days of Class:</h2>
                <div className="flex flex-wrap justify-center">
                  {Object.keys(values.daysOfClass).map((day) => (
                    <div key={day} className="mr-4 flex items-center">
                      <Field
                        type="checkbox"
                        name={`daysOfClass.${day}`}
                        id={day}
                        onChange={() => handleDayChange(day, values, setFieldValue)}
                        className="form-checkbox h-5 w-5 text-lewisRed"
                        aria-label={`Toggle ${day}`}
                      />
                      <label htmlFor={day} className="ml-2">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor Name */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="instructorName" className="mr-4 w-full sm:w-1/3">Instructor Name:</label>
                <Field
                  type="text"
                  name="instructorName"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="instructorName" component="div" className="text-red-500 text-sm mb-2" />

              {/* Course Name */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="className" className="mr-4 w-full sm:w-1/3">Course Name:</label>
                <Field
                  type="text"
                  name="className"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="className" component="div" className="text-red-500 text-sm mb-2" />

              {/* Course Location */}
              <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
                <label htmlFor="location" className="mr-4 w-full sm:w-1/3">Course Location:</label>
                <Field
                  type="text"
                  name="location"
                  className="p-2 border rounded w-full sm:w-2/3"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="location" component="div" className="text-red-500 text-sm mb-2" />

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                {/* Save Calendar Button */}
                <button
                  type="submit"
                  className="bg-lewisRed text-white p-3 rounded hover:bg-red-600 transition w-1/2 mr-2"
                >
                  Save Calendar
                </button>

                {/* Download ICS Button */}
                <button
                  type="button"
                  onClick={() => handleDownloadICS(values)}
                  className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition w-1/2 ml-2"
                >
                  Download ICS
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserInputForm;
