import { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import UserInputForm from "./UserInputForm";
import CalendarPage from "./CalendarPage";
import LinkPage from "./LinkPage";
import ProgressBar from "./ProgressBar";
import { AuthContext } from "../../Context/AuthProvider";
import { fetchSchedules } from "../../utils/supabaseClient";
import { fetchUserCalendars } from "../../utils/firestoreDatabase"
// imports added to use Firestore

const Homepage = () => {
  const { user } = useContext(AuthContext);

  // Default calendar template
  const defaultCalendar = {
    firstDay: "",
    lastDay: "",
    startTime: "",
    endTime: "",
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
    notes: "",
    page: 0,
  };

  const [calendars, setCalendars] = useState(() => {
    const storedCalendars = localStorage.getItem("calendars");
    return storedCalendars ? JSON.parse(storedCalendars) : [defaultCalendar];
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const storedIndex = localStorage.getItem("currentIndex");
    return storedIndex ? parseInt(storedIndex, 10) : 0;
  });

  // Effect to sync calendars and currentIndex with localStorage
  useEffect(() => {
    localStorage.setItem("calendars", JSON.stringify(calendars));
    localStorage.setItem("currentIndex", currentIndex);
  }, [calendars, currentIndex]);

  // Effect to load schedules when user logs in or reset on logout
  useEffect(() => {
    // creates a method that when called will load schedules from Firestore
    const loadSchedules = async () => {
      // Checks if there is a user signed in
      if (user) {
        // if there is a user, it will call a method from the firestoreDatabase.js file to get the calendars
        try {
          const schedules = fetchUserCalendars();

          // Supabase approach to fetch calendars from their database
          // const schedules = await fetchSchedules(user.id);
          
          setCalendars(schedules.length > 0 ? schedules : [defaultCalendar]);
        } catch (error) {
          toast.error("Failed to load schedules from Firestore.");
          console.error("Error loading calendars: ", error);
        }
      } else {
        // Reset calendars and localStorage on logout
        setCalendars([defaultCalendar]);
        setCurrentIndex(0);
        localStorage.removeItem("calendars");
        localStorage.removeItem("currentIndex");
      }
    };

    loadSchedules();
  }, [user]);

  // Function to create a new calendar
  const createNewCalendar = () => {
    setCalendars([...calendars, defaultCalendar]);
    setCurrentIndex(calendars.length); // Set the new calendar as active
  };

  // Function to set the current page for a calendar
  const setCurrentPage = (page) => {
    setCalendars((prevCalendars) => {
      const updatedCalendars = [...prevCalendars];
      updatedCalendars[currentIndex].page = page;
      return updatedCalendars;
    });
  };

  const updateCalendarName = (index, newName) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((calendar, i) =>
        i === index ? { ...calendar, className: newName } : calendar
      )
    );
  };
  
  const renderCurrentPage = () => {
    const currentCalendar = calendars[currentIndex];

    // Ensure a valid page is always set
    const page = currentCalendar.page ?? 0;

    switch (page) {
      case 0: // User Input
        return (
          // calls the userInputForm passing through the currentIndex of the calendar
          // the calendars object holding all of the data important for calendars
          // and the method setCalendars created from the useState() to change the calendars
          <UserInputForm
            currentIndex={currentIndex}
            calendars={calendars}
            setCalendars={setCalendars}
          />
        );
      case 1: // Calendar Page
        return <CalendarPage currentCalendar={currentCalendar} />;
      case 2: // Link Page
        return <LinkPage currentCalendar={currentCalendar} />;
      default: // Fallback to User Input
        setCurrentPage(0); // Automatically reset invalid page
        return null; // Render nothing temporarily (until page resets)
    }
  };

  return (
    <div className="flex bg-lewisRed min-h-screen items-stretch">
      {/* Sidebar */}
      <Sidebar
        calendars={calendars}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        createNewCalendar={createNewCalendar}
        updateCalendarName={updateCalendarName}
      />
      {/* Main Content */}
      <div className="flex flex-col flex-grow p-4 overflow-y-auto">
        {/* Progress Bar */}
        <ProgressBar
          currentPage={calendars[currentIndex]?.page || 0}
          setCurrentPage={setCurrentPage}
        />
        {/* Page Content */}
        <div className="flex-grow">{renderCurrentPage()}</div>
      </div>
    </div>
  );
};

export default Homepage;
