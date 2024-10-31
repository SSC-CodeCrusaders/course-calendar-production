// src/hooks/useCalendar.js

import { useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';

const useCalendar = () => {
  const { state, dispatch } = useUser();

  const fetchCalendarById = useCallback(async (id) => {
    // Check if calendar is cached
    if (state.calendarCache[id]) {
      return state.calendarCache[id];
    }

    try {
      const { data, error } = await supabase
        .from('calendars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Cache the calendar
      dispatch({ type: 'CACHE_CALENDAR', payload: { id, data } });

      return data;
    } catch (error) {
      toast.error('Error fetching calendar: ' + error.message);
      return null;
    }
  }, [state.calendarCache, dispatch]);

  return { fetchCalendarById };
};

export default useCalendar;
