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

const Header = ({ user, setUser }) => {
  const [userEmail, setUserEmail] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserEmail(currentUser.email); // Set email immediately from auth

        // Fetch email from Firestore if available
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserEmail(userDoc.data().email); // Override if Firestore has a stored email
          }
        } catch (error) {
          toast.error("Error fetching user data: " + error.message);
        }
      } else {
        setUser(null);
        setUserEmail('');
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserEmail('');
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
            <span className="text-sm px-3">Welcome, {userEmail || "User"}</span>
                  
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
