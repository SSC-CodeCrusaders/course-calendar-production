// src/contexts/UserContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

// Create a Context for the user and calendar
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Define the default calendar structure
const defaultCalendar = {
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

// Provider component to wrap around parts of the app that need access to user and calendar state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calendar states
  const [calendars, setCalendars] = useState(() => {
    const storedCalendars = localStorage.getItem('calendars');
    if (storedCalendars) {
      const parsed = JSON.parse(storedCalendars);
      // Ensure each calendar has all required fields
      return parsed.map(calendar => ({
        firstDay: calendar.firstDay || '',
        lastDay: calendar.lastDay || '',
        startTime: calendar.startTime || '',
        endTime: calendar.endTime || '',
        daysOfClass: calendar.daysOfClass || {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
        instructorName: calendar.instructorName || '',
        className: calendar.className || '',
        location: calendar.location || '',
      }));
    }
    return [defaultCalendar];
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const storedIndex = localStorage.getItem('currentIndex');
    return storedIndex ? JSON.parse(storedIndex) : 0;
  });

  // Fetch the current session
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      toast.error('Failed to get user session');
    }
    setUser(data.session?.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup the listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Persist calendars to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendars', JSON.stringify(calendars));
  }, [calendars]);

  // Persist currentIndex to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentIndex', JSON.stringify(currentIndex));
  }, [currentIndex]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      loading,
      calendars,
      setCalendars,
      currentIndex,
      setCurrentIndex
    }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
