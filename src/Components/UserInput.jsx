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
    <div>
      <h1>Class Schedule Creator</h1>
      <label htmlFor="calendar">Select date from </label>
      <input type="date" value={firstDay} onChange={(e) => setFirstDay(e.target.value)} />
      <label htmlFor="calendar"> to </label>
      <input type="date" value={lastDay} onChange={(e) => setLastDay(e.target.value)} />
      <br />

      <label htmlFor="class_time">Class Time: </label>
      <input type="time" value={classTime} onChange={(e) => setClassTime(e.target.value)} />
      <br />

      <h2>Days of class:</h2>
      {Object.keys(daysOfClass).map((day, index) => (
        <div key={index}>
          <label htmlFor={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
          <input
            type="checkbox"
            id={day}
            checked={daysOfClass[day]}
            onChange={() => handleDayChange(day)}
          />
        </div>
      ))}

      <br />
      <label htmlFor="instructor_name">Instructor Name: </label>
      <input
        type="text"
        value={instructorName}
        onChange={(e) => setInstructorName(e.target.value)}
      />
      <br />
      <label htmlFor="class_name">Name of Class: </label>
      <input
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />
      <br />
      <label htmlFor="location">Location: </label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br />
      <button onClick={createICS}>Create ICS</button>
    </div>
  );
};

export default DatePicker;
