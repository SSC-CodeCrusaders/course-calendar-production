// src/Components/Header.jsx
import { Link } from "react-router-dom";
import { supabase } from '../utils/supabaseClient';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

// Header is a functional component that receives the current user logged in and the function to update the current user
const Header = ({ user, setUser }) => {
  // userEmail is a local state that stores the user's email
  // Creates two useState variables but will give the value of the a signed in user's email if there is one
  const [userEmail, setUserEmail] = useState(user?.email || '');
  // useEffect for an Authentication listener and runs when the component mounts and listens for authentication state changes
  useEffect(() => {
    // I AM EDITING USING THIS SECTION BELOW AS A FALLBACK
    // onAuthStateChanged subscirbes to Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // if a user is logged in
      if (currentUser) {
        // This will update the global state
        setUser(currentUser);
        setUserEmail(currentUser.email); // Set email immediately from auth

        // Fetch email from Firebase if available
        try {
          // retrieves the user's document from Firestore with the "users" collection using their uid as the document key
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          // Checks if the document exists
          if (userDoc.exists()) {
            // If Firebase has an email store it overrides the userEmail from authentication
            setUserEmail(userDoc.data().email); // Override if Firebase has a stored email
          }
        } catch (error) {
          toast.error("Error fetching user data: " + error.message);
        }
      // if no user is logged in
      } else {
        // sets the user to null and the email to an empty string
        setUser(null);
        setUserEmail('');
      }
    });

    // cleans up and removes the listener when the component unmounts
    return () => unsubscribe();
  }, [setUser]);

  // A function to handle the signing out of the user
  const handleSignOut = async () => {
    try {
      // calls the signOut method to log the user out
      await signOut(auth);
      // resets the user and their email to null and an empty string respectively
      setUser(null);
      setUserEmail('');
      // This will clear the session storage meaning when you sign out it will remove the
      // Firebase presence from local storage because it likes to persist 
      sessionStorage.clear();
      // removes locally stored calendar data
      localStorage.removeItem("calendars");
      localStorage.removeItem("currentIndex");
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to log out: " + error.message);
    }
  };

  // SECTION BELOW USES SUPABASE, MIGHT REMOVE IN THE FUTURE
  // useEffect(() => {
  //   const getSession = async () => {
  //     // Fetch the current user session from Supabase
  //     const { data } = await supabase.auth.getSession();

  //     // Update user state with session data if available, otherwise set to null
  //     setUser(data.session?.user ?? null);
  //   };

  //   getSession(); // Invoke session retrieval on mount

  //   // Set up a listener to detect authentication state changes
  //   const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setUser(session?.user ?? null); // Update user state accordingly
  //   });

  //   return () => {
  //     // Cleanup function to unsubscribe from auth state changes
  //     authListener?.subscription.unsubscribe();
  //   };
  // }, [setUser]);

  // const handleSignOut = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     // Display error message if sign-out fails
  //     toast.error("Failed to log out: " + error.message);
  //   } else {
  //     // Clear user state on successful sign-out
  //     setUser(null);

  //     // Remove stored calendar data from localStorage
  //     localStorage.removeItem("calendars");
  //     localStorage.removeItem("currentIndex");

  //     // Notify user of successful logout
  //     toast.success("Logged out successfully!");
  //   }
  // };

  return (
    <nav className="bg-lewisRedDarkest text-white py-4 relative flex items-center justify-between px-4">
      {/* Application title with link to home */}
      <h1 className="font-crimson text-3xl sm:text-4xl md:text-5xl font-bold hover:text-gray transition">
        <Link to="/">LewisCal</Link>
      </h1>

      <div className="flex">
        <Link className="hover:text-gray transition px-3" to="/aboutus">About Us</Link>
        <Link className="hover:text-gray transition px-3" to="/features">Features</Link>
        <Link className="hover:text-gray transition px-3" to="/faq">FAQs</Link>
        <Link className="hover:text-gray transition px-3" to="/tutorial">Tutorial</Link>
        <Link className="hover:text-gray transition px-3" to="/contactus">Contact Us</Link>

        {/* External Link to old website - will need to be removed later */}
        <a
          className="hover:text-gray transition px-3"
          href="https://lewiscalendar-gpfng4ddezdmhdac.centralus-01.azurewebsites.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Info
        </a>

        {!user ? (
        // Display login/signup link if user is not logged in
        <Link className="hover:text-gray transition px-3" to="/auth">Log In / Sign Up</Link>
        ) : (
          <>
            {/* Display user email and greeting */}
            <span className="text-sm px-3">Welcome, {userEmail}</span>
                  
            {/* Profile link for logged-in users */}
            <Link className="hover:text-gray transition ml-4" to="/profile">Profile</Link>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition ml-4"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

Header.propTypes = {
  user: PropTypes.object, // User object, null if not logged in
  setUser: PropTypes.func.isRequired, // Function to update user state
};

export default Header;
