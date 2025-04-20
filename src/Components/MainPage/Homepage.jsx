import { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import CalendarPage from "./CalendarPage";
import { AuthContext } from "../../Context/AuthProvider";
import { deleteCalendar, fetchUserCalendars } from "../../utils/firestoreDatabase";
import { toast } from "react-toastify";
// imports added to use Firestore

const Homepage = () => {
  const { user } = useContext(AuthContext);

  // Default calendar template
  const defaultCalendar = {
    firstDay: "",
    lastDay: "",
    instructorName: "",
    className: "",
    location: "",
    notes: "",
  };

  const [calendars, setCalendars] = useState(() => {
    const storedCalendars = localStorage.getItem("calendars");
    if (storedCalendars) {
      try {
        const parsed = JSON.parse(storedCalendars);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }
    return [defaultCalendar];
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const storedIndex = parseInt(localStorage.getItem("currentIndex"), 10);
    if (!isNaN(storedIndex) && storedIndex >= 0 && storedIndex < calendars.length) {
      return storedIndex;
    }
    return 0;
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Effect to sync calendars and currentIndex with localStorage
  useEffect(() => {
    localStorage.setItem("calendars", JSON.stringify(calendars));
    localStorage.setItem("currentIndex", currentIndex);
  }, [calendars, currentIndex]);

  useEffect(() => {
    async function loadCalendars() {
      if (user) {
        try {
          const fetched = await fetchUserCalendars();          
          const toUse = Array.isArray(fetched) && fetched.length > 0 ? fetched : [defaultCalendar];
          setCalendars(toUse);
          setCurrentIndex(idx => Math.min(idx, toUse.length - 1));
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
    }
    loadCalendars();
  }, [user]);

  // Function to create a new calendar
  const createNewCalendar = () => {
    setCalendars(prev => [...prev, defaultCalendar]);
    setCurrentIndex(calendars.length); // Set the new calendar as active
  };

  const updateCalendarName = (i, name) =>
    setCalendars(prev =>
      prev.map((c, idx) => (idx === i ? { ...c, className: name } : c))
    );

  const handleDeleteCalendar = async (calendarId) => {
    if (calendars.length === 1) {
      toast.error("Calendar deletion failed. Cannot delete last calendar.");
      return;
    }

    const confirmDelete = window.confirm("Delete Calendar?");
    if (!confirmDelete) return;
    const deletedIndex = calendars.findIndex((c) => c.id === calendarId);
    await deleteCalendar(calendarId);
    const updatedCalendars = calendars.filter((c) => c.id !== calendarId);
    setCalendars(updatedCalendars);

    if (deletedIndex === currentIndex) {
      const nextIndex = deletedIndex >= updatedCalendars.length ? updatedCalendars.length - 1 : deletedIndex;
      setCurrentIndex(nextIndex);
    } else if (deletedIndex < currentIndex) {
      setCurrentIndex((prev) => prev - 1);
    }

    toast.success("Calendar deleted successfully.");
  };
  
  const renderCurrentPage = () => {
    const safeIndex = Math.max(0, Math.min(currentIndex, calendars.length - 1));
    const currentCalendar = calendars?.[safeIndex];
    return (
      <CalendarPage
        currentCalendar={currentCalendar}
        currentIndex={currentIndex}
        calendars={calendars}
        setCalendars={setCalendars}
      />
    );  
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
        deleteCalendar={handleDeleteCalendar}
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
