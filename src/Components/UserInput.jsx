import { useState } from "react";

const DatePicker = () => {
  // State to store the form values
  const [firstDay, setFirstDay] = useState('');
  const [lastDay, setLastDay] = useState('');
  const [classTime, setClassTime] = useState('');
  const [daysOfClass, setDaysOfClass] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [instructorName, setInstructorName] = useState('');
  const [className, setClassName] = useState('');
  const [location, setLocation] = useState('');

  // Handler to toggle day checkboxes
  const handleDayChange = (day) => {
    setDaysOfClass({ ...daysOfClass, [day]: !daysOfClass[day] });
  };

  const toICSDateString = (date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  // Generate the .ics content
  const createICS = () => {
    const selectedDays = getSelectedClassDays();
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CourseCalenderSEC\n`;

    selectedDays.forEach((day) => {
      let startTime = toICSDateString(day);
      let endTime = toICSDateString(new Date(day.getTime() + 60 * 60 * 1000)); // 1-hour class duration

      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `UID:${day.getTime()}@CourseCalender.com\n`;
      icsContent += `DTSTAMP:${toICSDateString(new Date())}\n`;
      icsContent += `DTSTART:${startTime}\n`;
      icsContent += `DTEND:${endTime}\n`;
      icsContent += `SUMMARY:${className} with ${instructorName}\n`;
      icsContent += `LOCATION:${location}\n`;
      icsContent += `DESCRIPTION:Class with ${instructorName}\n`;
      icsContent += `END:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;
    downloadFile(icsContent, 'schedule.ics');
  };

  // Download the generated .ics file
  const downloadFile = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const getSelectedClassDays = () => {
    const firstDateTime = new Date(`${firstDay}T${classTime}`);
    const lastDateTime = new Date(`${lastDay}T${classTime}`);
    let selectedDays = [];

    for (let d = new Date(firstDateTime); d <= lastDateTime; d.setDate(d.getDate() + 1)) {
      let dayIndex = d.getDay();
      if (Object.values(daysOfClass)[dayIndex]) {
        selectedDays.push(new Date(d));
      }
    }
    return selectedDays;
  };

  return (
    <div className="bg-lewisRed min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl font-bold mb-8 text-center">Class Schedule Creator</h1>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl text-center">
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="calendar" className="mr-4">Start of Course Date: </label>
          <input
            type="date"
            value={firstDay}
            onChange={(e) => setFirstDay(e.target.value)}
            className="p-2 border rounded text-center"
          />
        </div>
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="calendar" className="mr-4">End of Course Date:</label>
          <input
            type="date"
            value={lastDay}
            onChange={(e) => setLastDay(e.target.value)}
            className="p-2 border rounded text-center"
          />
        </div>
        <h2 className="text-center mb-4">Course Dates:</h2>
        <div className="mb-4 flex-wrap flex justify-center items-center">
          {Object.keys(daysOfClass).map((day, index) => (
            <div key={index} className="mr-4 flex items-center">
              <label htmlFor={day} className="mr-2">{day.charAt(0).toUpperCase() + day.slice(1)}</label>
              <input
                type="checkbox"
                id={day}
                checked={daysOfClass[day]}
                onChange={() => handleDayChange(day)}
                className="form-checkbox"
              />
            </div>
          ))}
        </div>

        <br />
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="instructor_name" className="mr-4">Instructor Name: </label>
          <input
            type="text"
            value={instructorName}
            onChange={(e) => setInstructorName(e.target.value)}
            className="p-2 border rounded text-center"
          />
        </div>

        <br />
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="class_name" className="mr-4">Course Name: </label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="p-2 border rounded text-center"
          />
        </div>

        <br />
        <div className="mb-4 w-full flex justify-center items-center">
          <label htmlFor="location" className="mr-4">Course Location: </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 border rounded text-center"
          />
        </div>
        <br />
        <div className="mt-6 flex justify-center">
          <button
            onClick={createICS}
            className="bg-white text-lewisRed p-2 rounded border border-lewisRed shadow hover:bg-lewisRed hover:text-white transition duration-300"
          >
            Create .ICS
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
