import { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CalendarPage from "./CalendarPage";
import { AuthContext } from "../../Context/AuthProvider";
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
  };

  const [calendars, setCalendars] = useState(() => {
    const storedCalendars = localStorage.getItem("calendars");
    return storedCalendars ? JSON.parse(storedCalendars) : [defaultCalendar];
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const storedIndex = localStorage.getItem("currentIndex");
    return storedIndex ? parseInt(storedIndex, 10) : 0;
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Effect to sync calendars and currentIndex with localStorage
  useEffect(() => {
    localStorage.setItem("calendars", JSON.stringify(calendars));
    localStorage.setItem("currentIndex", currentIndex);
  }, [calendars, currentIndex]);

  // Effect to load schedules when user logs in or reset on logout
  useEffect(() => {
    // creates a method that when called will load schedules from Firestore
    const loadCalendars = async () => {
      // Checks if there is a user signed in
      if (user) {
        // if there is a user, it will call a method from the firestoreDatabase.js file to get the calendars
        try {
          const calendars = await fetchUserCalendars();

          // Supabase approach to fetch calendars from their database
          // const schedules = await fetchSchedules(user.id);
          
          setCalendars(calendars && calendars.length > 0 ? calendars : [defaultCalendar]);
        } catch (error) {
          toast.error("Failed to load calendars from Firestore.");
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

    loadCalendars();
  }, [user]);

  // Function to create a new calendar
  const createNewCalendar = () => {
    setCalendars([...calendars, defaultCalendar]);
    setCurrentIndex(calendars.length); // Set the new calendar as active
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
          <CalendarPage
            currentCalendar={currentCalendar}
            currentIndex={currentIndex}
            calendars={calendars}
            setCalendars={setCalendars}
          />
        );
      default:
        return null;
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
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div className={`flex flex-col flex-grow p-4 overflow-y-auto transition-all duration-150
                      ${isCollapsed ? "ml-12" : "ml-44"}`}>
        {/* Render Active Page Content */}
        <div className="flex-grow">{renderCurrentPage()}</div>
      </div>
    </div>
  );
};

export default Homepage;
