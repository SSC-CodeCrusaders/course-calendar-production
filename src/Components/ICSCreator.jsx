// src/Components/ICSCcreator.jsx

import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';
import CalendarEditor from './CalendarEditor';
import Button from './Button';
import PropTypes from 'prop-types';

const ICSCcreator = () => {
  const { state, dispatch } = useUser();
  const [calendarData, setCalendarData] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  // Load calendar data when current_index or calendars change
  useEffect(() => {
    const loadCalendar = async () => {
      if (state.current_index === null || state.current_index === undefined) {
        setCalendarData(null);
        return;
      }

      const selectedCalendar = state.calendars[state.current_index];

      if (!selectedCalendar) {
        setCalendarData(null);
        return;
      }

      setLoadingCalendar(true);

      if (state.user && selectedCalendar.id) {
        // Logged-in User: Use selectedCalendar directly
        setCalendarData(selectedCalendar);
      } else {
        // Guest User: Use local data
        setCalendarData(selectedCalendar);
      }

      setLoadingCalendar(false);
    };

    loadCalendar();
  }, [state.current_index, state.calendars, state.user]);

  // Handle Save Action (for editing existing calendars)
  const handleSave = async (updatedCalendar) => {
    if (state.user && updatedCalendar.id) {
      // Save to Supabase
      try {
        const { error } = await supabase
          .from('calendars')
          .update(updatedCalendar)
          .eq('id', updatedCalendar.id);

        if (error) throw error;

        // Update local state
        dispatch({
          type: 'UPDATE_CALENDAR',
          payload: { index: state.current_index, calendar: updatedCalendar },
        });

        // Update cache
        dispatch({
          type: ACTIONS.CACHE_CALENDAR,
          payload: { id: updatedCalendar.id, data: updatedCalendar },
        });

        toast.success('Calendar saved successfully!');
      } catch (error) {
        console.error('Error saving calendar:', error);
        toast.error('Error saving calendar: ' + error.message);
      }
    } else {
      // Guest User: Save to localStorage
      const updated_calendars = state.calendars.map((cal, idx) =>
        idx === state.current_index ? updatedCalendar : cal
      );
      dispatch({ type: ACTIONS.SET_CALENDARS, payload: updated_calendars });
      toast.success('Calendar saved locally!');
    }
  };

  // Handle ICS Download
  const handleDownloadICS = (calendar) => {
    try {
      const ics = generateICS(calendar);
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${calendar.class_name || 'calendar'}.ics`;
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

  // Function to generate ICS content
  const generateICS = (calendar) => {
    const { first_day, last_day, start_time, end_time, days_of_class, instructor_name, class_name, location } = calendar;

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
      const start = new Date(first_day);
      const end = new Date(last_day);
      const selectedDays = Object.keys(days_of_class).filter(day => days_of_class[day]);

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
DTSTART:${eventDate}T${convertToUTC(start_time)}
DTEND:${eventDate}T${convertToUTC(end_time)}
SUMMARY:${class_name}
DESCRIPTION:${instructor_name}
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

  if (state.calendars.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-white shadow-md rounded-md">
          <p className="text-gray-500 mb-4">Get started by creating your first calendar!</p>
          <Button
            type="button"
            onClick={() => dispatch({ type: 'SET_CURRENT_INDEX', payload: 0 })}
            className="bg-lewisRed hover:bg-red-600"
          >
            Create Calendar
          </Button>
        </div>
      </div>
    );
  }

  if (loadingCalendar) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading calendar...</p>
      </div>
    );
  }

  if (!calendarData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No calendar selected or failed to load.</p>
      </div>
    );
  }

  return (
    <div>
      <CalendarEditor
        calendar={calendarData}
        onSave={handleSave}
        onDownloadICS={() => handleDownloadICS(calendarData)}
      />
    </div>
  );
};

ICSCcreator.propTypes = {
  // Define prop types if necessary
};

export default ICSCcreator;
