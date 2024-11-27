import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../utils/supabaseClient';

// Create the Auth Context
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Tracks the authenticated user
  const [loading, setLoading] = useState(true); // Tracks loading state for auth initialization

  useEffect(() => {
    const initAuth = async () => {
      // Fetch the session from Supabase
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Failed to fetch session:', error.message);
      } else {
        setUser(data.session?.user || null); // Set user if session exists
      }

      setLoading(false); // Finished initializing auth

      // Listen for authentication state changes
      const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => subscription?.unsubscribe(); // Clean up listener on unmount
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <div>Loading...</div> : children} {/* Display loading state */}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
