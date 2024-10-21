import { useEffect, useState, useCallback } from "react";
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./Components/Header";
import UserInputForm from "./Components/UserInputForm";
import Auth from "./Components/Auth";
import UserProfile from "./Components/UserProfile";
import Sidebar from "./Components/Sidebar";
import { supabase } from './utils/supabaseClient';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Centralized currentIndex

  // Load calendars and currentIndex from localStorage on mount
  useEffect(() => {
    const storedCalendars = localStorage.getItem('calendars');
    if (storedCalendars) {
      setCalendars(JSON.parse(storedCalendars));
    }

    const storedIndex = localStorage.getItem('currentIndex');
    if (storedIndex) {
      setCurrentIndex(JSON.parse(storedIndex));
    }
  }, []);

  // Persist calendars and currentIndex to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendars', JSON.stringify(calendars));
  }, [calendars]);

  useEffect(() => {
    localStorage.setItem('currentIndex', JSON.stringify(currentIndex));
  }, [currentIndex]);

  // Handle user session persistence and state updates
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // ProtectedRoute component to restrict access to authenticated users only
  // Redirects to the /auth route if the user is not logged in
  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/auth" replace />;
  };

  ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired,
  };

  // Memoize the state setters to prevent unnecessary re-renders
  const memoizedSetCalendars = useCallback(setCalendars, []);
  const memoizedSetCurrentIndex = useCallback(setCurrentIndex, []);

  return (
    <Router>
      <Header user={user} setUser={setUser} /> {/* Pass setUser correctly */}
      <Sidebar
        calendars={calendars}
        setCalendars={memoizedSetCalendars}
        currentIndex={currentIndex}
        setCurrentIndex={memoizedSetCurrentIndex}
      />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/auth" 
          element={!user ? <Auth /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/" 
          element={
            <UserInputForm 
              currentIndex={currentIndex} 
              calendars={calendars} 
              setCalendars={setCalendars} 
            />
          } 
        />
        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={<ProtectedRoute element={<UserProfile />} />} 
        />
        {/* Redirect unknown routes to home or a 404 page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
