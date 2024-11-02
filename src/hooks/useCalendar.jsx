import { useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

const useCalendar = () => {
  const fetchCalendarById = useCallback(async (id) => {
    try {
      const { data, error } = await supabase
        .from('calendars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      console.log('Fetched Calendar by ID:', data);
      return data;
    } catch (error) {
      console.error('Error fetching calendar by ID:', error);
      toast.error('Error fetching calendar: ' + error.message);
      return null;
    }
  }, []);

  return { fetchCalendarById };
};

export default useCalendar;
