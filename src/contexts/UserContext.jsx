// src/contexts/UserContext.jsx

import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

// Initial State
const initialState = {
  user: null,
  loading: true,
  calendars: [],
  current_index: 0,
  calendarCache: {},
};

// Actions
const ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_CALENDARS: 'SET_CALENDARS',
  ADD_CALENDAR: 'ADD_CALENDAR',
  UPDATE_CALENDAR: 'UPDATE_CALENDAR',
  SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
  CACHE_CALENDAR: 'CACHE_CALENDAR',
};

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_CALENDARS:
      return { ...state, calendars: action.payload };
    case ACTIONS.ADD_CALENDAR:
      return { ...state, calendars: [...state.calendars, action.payload] };
    case ACTIONS.UPDATE_CALENDAR:
      const updatedCalendars = state.calendars.map((cal, idx) =>
        idx === action.payload.index ? action.payload.calendar : cal
      );
      return { ...state, calendars: updatedCalendars };
      case ACTIONS.SET_CURRENT_INDEX:
        if (action.payload >= 0 && action.payload < state.calendars.length) {
          return { ...state, current_index: action.payload };
        } else {
          console.warn('Invalid current_index set:', action.payload);
          return state; // Avoid updating state with an invalid index
        }
      
    case ACTIONS.CACHE_CALENDAR:
      return {
        ...state,
        calendarCache: { ...state.calendarCache, [action.payload.id]: action.payload.data },
      };
    default:
      console.warn('Unhandled action type:', action.type);
      return state;
  }
};

// Context
const UserContext = createContext();

// Provider
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch user session on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        toast.error('Failed to get user session');
        console.error('Error fetching session:', error);
      }
      dispatch({ type: ACTIONS.SET_USER, payload: data.session?.user ?? null });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch({ type: ACTIONS.SET_USER, payload: session?.user ?? null });
    });

    // Cleanup
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      } else {
        console.warn('No subscription found to unsubscribe.');
      }
    };
  }, []);

  // Load Calendars based on user state
  useEffect(() => {
    const loadCalendars = async () => {
      if (state.user) {
        // Logged-in User: Fetch from Supabase
        try {
          const { data, error } = await supabase
            .from('calendars')
            .select('*')
            .eq('user_id', state.user.id);

          if (error) {
            throw error;
          }

          dispatch({ type: ACTIONS.SET_CALENDARS, payload: data });

          // Optionally cache calendars
          data.forEach(calendar => {
            dispatch({ type: ACTIONS.CACHE_CALENDAR, payload: { id: calendar.id, data: calendar } });
          });

          // If no calendar is selected, set to first calendar
          if (data.length > 0 && state.current_index === null) {
            dispatch({ type: ACTIONS.SET_CURRENT_INDEX, payload: 0 });
          }
        } catch (error) {
          console.error('Error fetching calendars:', error);
          toast.error('Error fetching calendars: ' + error.message);
        }
      } else {
        // Guest User: Fetch from localStorage
        const stored_calendars = localStorage.getItem('calendars_guest');
        if (stored_calendars) {
          const parsed = JSON.parse(stored_calendars);
          dispatch({ type: ACTIONS.SET_CALENDARS, payload: parsed });
          if (parsed.length > 0 && state.current_index === null) {
            dispatch({ type: ACTIONS.SET_CURRENT_INDEX, payload: 0 });
          }
        } else {
          dispatch({ type: ACTIONS.SET_CALENDARS, payload: [] });
        }
      }
    };

    loadCalendars();
  }, [state.user]);

  // Persist guest calendars to localStorage
  useEffect(() => {
    if (!state.user) {
      localStorage.setItem('calendars_guest', JSON.stringify(state.calendars));
    }
  }, [state.calendars, state.user]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom Hook for consuming context
export const useUser = () => {
  return useContext(UserContext);
};
