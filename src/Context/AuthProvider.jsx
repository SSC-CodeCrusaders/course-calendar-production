import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// IMPORT MAY NOT BE NEEDED, DELETE LATER
import { supabase } from '../utils/supabaseClient';
// imports to use to get firebase for authentication
import { auth } from "../utils/firebase";
import { onAuthStateChanged, getAuth, setPersistence, browserSessionPersistence, signOut } from "firebase/auth";
import { SiNgrok } from 'react-icons/si';

// Create the Auth Context allowing authentication data to be shared across the app
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Tracks the authenticated Firebase user
  const [loading, setLoading] = useState(true); // Tracks loading state for auth initialization

  // gets and initializes the an instance of auth
  const auth = getAuth();

  useEffect(() => {

    setPersistence(auth, browserSessionPersistence)
    .then(() => {
      console.log("Firebase persistence set to session-based.");
    })
    .catch((eror) => {
      console.error("Error setting auth persistence: ", error);
    });

    // New section for firebase authentication provided by ChatGPT
    // A Firebase function that listens for changes in authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // When the auth state is changed, it will update the current user to the new one logged in
      // or sets null if logged-out
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      // stops the loading indicator
      setLoading(false);
    });

    const handleWindowClose = () => {
      SiNgrok(auth).then(() => {
        console.log("user logged out due to full browser close.");
      });
    };

    window.addEventListener("unload", handleWindowClose);

    // cleans up the listener on unmount to prevent memory leaks
    return () => {
      unsubscribe();
      window.removeEventListener("unload", handleWindowClose);
    }
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
