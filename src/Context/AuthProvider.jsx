import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// imports to use to get firebase for authentication
import { auth } from "../utils/firebase";
import { onAuthStateChanged, getAuth, setPersistence, browserLocalPersistence, signOut } from "firebase/auth";

// Create the Auth Context allowing authentication data to be shared across the app
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Tracks the authenticated Firebase user
  const [loading, setLoading] = useState(true); // Tracks loading state for auth initialization

  // gets and initializes the an instance of auth
  const auth = getAuth();

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Firebase persistence set to session-based.");
    })
    .catch((error) => {
      console.error("Error setting auth persistence: ", error);
    });

    // New section for firebase authentication provided by ChatGPT
    // A Firebase function that listens for changes in authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // When the auth state is changed, it will update the current user to the new one logged in
      // or sets null if logged-out
      setUser(user || null);
      // stops the loading indicator
      setLoading(false);
    });

    // cleans up the listener on unmount to prevent memory leaks
    return () => unsubscribe();
  }, []);

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
