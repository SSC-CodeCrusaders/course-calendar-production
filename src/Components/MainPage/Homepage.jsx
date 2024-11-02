import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import ProgressBar from './ProgressBar';
import CreateCalendar from '../CreateCalendar';
import ICSCcreator from '../ICSCreator'; // Import the editor/creator component
import { useUser } from '../../contexts/UserContext'; // Import the context

const Homepage = () => {
  const { state } = useUser();
  const { current_index, calendars } = state;

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
    page: 0, // Ensure this is defined by default
    isNew: true, // Indicates whether this is a new calendar
  };

  const [localCalendars, setLocalCalendars] = useState(() => {
    const storedCalendars = localStorage.getItem('calendars');
    return storedCalendars ? JSON.parse(storedCalendars) : [defaultCalendar];
  });

  const [currentPage, setCurrentPage] = useState(0); // Default to 0

  useEffect(() => {
    localStorage.setItem('calendars', JSON.stringify(localCalendars));
  }, [localCalendars]);

  // Set currentPage whenever current_index changes
  useEffect(() => {
    if (calendars && current_index !== null && current_index < calendars.length) {
      const calendarPage = calendars[current_index]?.page ?? 0;
      setCurrentPage(calendarPage);
    }
  }, [calendars, current_index]);

  const createNewCalendar = () => {
    const newCalendar = { ...defaultCalendar, isNew: true };
    setLocalCalendars([...localCalendars, newCalendar]);
  };

  const setCurrentPageForCalendar = (page) => {
    setCurrentPage(page);
    if (current_index !== null && current_index < localCalendars.length) {
      setLocalCalendars((prevCalendars) => {
        const updatedCalendars = [...prevCalendars];
        updatedCalendars[current_index] = {
          ...updatedCalendars[current_index],
          page: page, // Update the page property
        };
        return updatedCalendars;
      });
    }
  };

  const renderCurrentPage = () => {
    if (!calendars || current_index === null || current_index >= calendars.length) {
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">No valid calendar selected.</p>
        </div>
      );
    }

    const currentCalendar = calendars[current_index];

    switch (currentPage) {
      case 0:
        // Display the CreateCalendar or Editor based on whether it's a new calendar
        return currentCalendar.isNew ? (
          <CreateCalendar currentPage={currentPage} setCurrentPage={setCurrentPageForCalendar} />
        ) : (
          <ICSCcreator currentPage={currentPage} setCurrentPage={setCurrentPageForCalendar} calendar={currentCalendar} />
        );
      case 1:
        // Placeholder for Calendar Page step
        return (
          <div className="h-full flex items-center justify-center">
            <h1 className="text-3xl font-bold">Calendar Page Placeholder</h1>
          </div>
        );
      case 2:
        // Placeholder for Link Page step
        return (
          <div className="h-full flex items-center justify-center">
            <h1 className="text-3xl font-bold">Link Page Placeholder</h1>
          </div>
        );
      default:
        // Handle invalid page numbers
        return (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Invalid page selected.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex bg-lewisRed min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow p-4 ml-64 overflow-y-auto">
        <ProgressBar currentPage={currentPage} setCurrentPage={setCurrentPageForCalendar} />
        <div className="flex-grow">{renderCurrentPage()}</div>
      </div>
    </div>
  );
};

export default Homepage;
