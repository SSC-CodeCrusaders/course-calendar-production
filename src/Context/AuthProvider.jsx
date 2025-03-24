import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// IMPORT MAY NOT BE NEEDED, DELETE LATER
import { supabase } from '../utils/supabaseClient';
// imports to use to get firebase for authentication
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Create the Auth Context allowing authentication data to be shared across the app
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Tracks the authenticated Firebase user
  const [loading, setLoading] = useState(true); // Tracks loading state for auth initialization

  useEffect(() => {
    // New section for firebase authentication provided by ChatGPT
    // A Firebase function that listens for changes in authentication status
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // When the auth state is changed, it will update the current user to the new one logged in
      // or sets null if logged-out
      setUser(currentUser);
      // stops the loading indicator
      setLoading(false);
    });

    // cleans up the listener on unmount to prevent memory leaks
    return () => unsubscribe();
  }, []);

  // REVIEW SECTION BELOW, MAY NOT BE NEEDED
  //   const initAuth = async () => {
  //     // Fetch the session from Supabase
  //     const { data, error } = await supabase.auth.getSession();

  //     if (error) {
  //       console.error('Failed to fetch session:', error.message);
  //     } else {
  //       setUser(data.session?.user || null); // Set user if session exists
  //     }

  //     setLoading(false); // Finished initializing auth

  //     // Listen for authentication state changes
  //     const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
  //       setUser(session?.user || null);
  //     });

  //     return () => subscription?.unsubscribe(); // Clean up listener on unmount
  //   };

  //   initAuth();
  // }, []);

  // Returns authentication data 
  return (
    // this will return and make the variables user and loading available throughout the app
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <div>Loading...</div> : children} {/* Display loading state is loading is true*/}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
