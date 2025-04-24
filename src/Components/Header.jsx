// src/Components/Header.jsx
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Header is a functional component that receives the current user logged in and the function to update the current user
const Header = ({ user, setUser }) => {
  // userEmail is a local state that stores the user's email
  // Creates two useState variables but will give the value of the a signed in user's email if there is one
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // useEffect for an Authentication listener and runs when the component mounts and listens for authentication state changes
  useEffect(() => {
    // I AM EDITING USING THIS SECTION BELOW AS A FALLBACK
    // onAuthStateChanged subscirbes to Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // if a user is logged in
      if (currentUser) {
        // This will update the global state
        setUser(currentUser);
        await currentUser.reload();
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

  return (
    <nav className="fixed top-0 left-0 w-full bg-accent text-white py-4 z-50 px-4">
      <div className="flex flex-row justify-between">
        {/* Application title with link to home */}
        <h1 className="font-crimson text-5xl font-bold hover:text-gray transition whitespace-nowrap">
          <Link to="/">LewisCal</Link>
        </h1>
        {/* mobile/small screens only */}
        <button
          className="sm:hidden flex items-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
          
        <div className="hidden sm:flex font-semibold items-center gap-1 text-sm">
          <Link className="hover:text-gray transition px-2" to="/aboutus">About Us</Link>
          <Link className="hover:text-gray transition px-2" to="/features">Features</Link>
          <Link className="hover:text-gray transition px-2" to="/faq">FAQs</Link>
          <Link className="hover:text-gray transition px-2" to="/tutorial">Tutorial</Link>
          <Link className="hover:text-gray transition px-2" to="/contactus">Contact Us</Link>
          {!user ? (
            // Display login/signup link if user is not logged in
            <Link className="hover:text-gray transition px-2" to="/auth">Log In / Sign Up</Link>
          ) : (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1 hover:text-gray transition">
                <UserCircleIcon className="w-7 h-7 text-white" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 bg-accent text-white text-right divide-y-2 rounded-md z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <span className="font-semibold">{userEmail}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-right px-4 py-2 text-sm hover:bg-red-100 text-red-400"
                  >
                    Sign Out
                  </button>
                </div> 
              )}
            </div>
          )}
        </div>
      </div>
      {/* small screen nav menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden divide-y-2 divide-lewisRedDarkest bg-accent rounded-md z-40 p-2 space-y text-right fixed right-0">
          <Link to="/aboutus" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">About Us</Link>
          <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Features</Link>
          <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">FAQs</Link>
          <Link to="/tutorial" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Tutorial</Link>
          <Link to="/contactus" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Contact Us</Link>
          {!user ? (
            // Display login/signup link if user is not logged in
            <Link className="hover:text-gray transition px-2" to="/auth">Log In / Sign Up</Link>
          ) : (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="block px-4 py-4">
                <UserCircleIcon className="top-2 absolute right-2 w-6 h-6 text-white" />
              </button>

              {dropdownOpen && (
                <div className="fixed right-0 mt-0 bg-accent text-white text-right divide-y-2 rounded-md z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <span className="font-semibold">{userEmail}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-right px-4 py-2 text-sm hover:bg-red-100 text-red-400"
                  >
                    Sign Out
                  </button>
                </div> 
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

Header.propTypes = {
  user: PropTypes.object, // User object, null if not logged in
  setUser: PropTypes.func.isRequired, // Function to update user state
};

export default Header;
