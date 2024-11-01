// Homepage.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import UserInputForm from './UserInputForm';
import ProgressBar from './ProgressBar';

const Homepage = () => {
  const defaultCalendar = {
    firstDay: '',
    lastDay: '',
    classTime: '',
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
    page: 0,
  };

  const [calendars, setCalendars] = useState(() => {
    const storedCalendars = localStorage.getItem('calendars');
    return storedCalendars ? JSON.parse(storedCalendars) : [defaultCalendar];
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem('calendars', JSON.stringify(calendars));
  }, [calendars]);

  const createNewCalendar = () => {
    setCalendars([...calendars, defaultCalendar]);
    setCurrentIndex(calendars.length);
  };

  const setCurrentPage = (page) => {
    setCalendars((prevCalendars) => {
      const updatedCalendars = [...prevCalendars];
      updatedCalendars[currentIndex].page = page;
      return updatedCalendars;
    });
  };

  const nextPage = () => setCurrentPage(calendars[currentIndex].page + 1);
  const prevPage = () => setCurrentPage(calendars[currentIndex].page - 1);

  const renderCurrentPage = () => {
    const currentCalendar = calendars[currentIndex];
    switch (currentCalendar.page) {
      case 0:
        return (
          <UserInputForm
            currentIndex={currentIndex}
            calendars={calendars}
            setCalendars={setCalendars}
          />
        );
      case 1:
        return <div className="h-full flex items-center justify-center">Calendar Page Placeholder</div>;
      case 2:
        return <div className="h-full flex items-center justify-center">Link Page Placeholder</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-lewisRed min-h-screen">
      {/* Sidebar */}
      <Sidebar
        calendars={calendars}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        createNewCalendar={createNewCalendar}
      />
      {/* Main Content */}
      <div className="flex flex-col flex-grow p-4 overflow-y-auto">
        {/* Progress Bar */}
        <ProgressBar currentPage={calendars[currentIndex].page} setCurrentPage={setCurrentPage} />
        {/* Page Content */}
        <div className="flex-grow">{renderCurrentPage()}</div>
      </div>
    </div>
  );
};

export default Homepage;
