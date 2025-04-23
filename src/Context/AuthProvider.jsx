import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// imports to use to get firebase for authentication
import { auth } from "../utils/firebase";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { updateUserEmailInFirestore } from "../utils/firestoreDatabase";

// Create the Auth Context allowing authentication data to be shared across the app
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Tracks the authenticated Firebase user
  const [loading, setLoading] = useState(true); // Tracks loading state for auth initialization

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("Firebase persistence set to Local."))
    .catch((error) => console.error("Error setting auth persistence: ", error));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        setUser(user);
        await updateUserEmailInFirestore(user.uid, user.email);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // cleans up the listener on unmount to prevent memory leaks
    return () => unsubscribe();
  }, []);

  // Returns authentication data 
  return (
    // this will return and make the variables user and loading available throughout the app
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {loading ? <div>Loading...</div> : children} {/* Display loading state is loading is true*/}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
