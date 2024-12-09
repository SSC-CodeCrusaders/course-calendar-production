// src/Components/Header.jsx
import { Link } from "react-router-dom";
import { supabase } from '../utils/supabaseClient';
import { useEffect } from 'react';
import { toast } from "react-toastify";
import PropTypes from 'prop-types';

const Header = ({ user, setUser }) => {
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setUser]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out: " + error.message);
    } else {
      // Clear user state
      setUser(null);

      // Clear localStorage and calendar state
      localStorage.removeItem("calendars");
      localStorage.removeItem("currentIndex");

      toast.success("Logged out successfully!");
    }
  };

  return (
    <nav className="bg-lewisRedDarkest text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="pl-28 text-2xl font-bold">
          <Link to="/">LewisCal</Link>
        </h1>
        <div className="space-x-6 flex items-center">
          <Link className="hover:text-gray" to="/">
            Home
          </Link>
          <Link className="hover:text-gray" to="/aboutus">
            About Us
          </Link>
          <Link className="hover:text-gray" to="/features">
            Features
          </Link>
          <Link className="hover:text-gray" to="/faq">
            FAQs
          </Link>
          <Link className="hover:text-gray" to="/tutorial">
            Tutorial
          </Link>
          <Link className="hover:text-gray" to="/contactus">
            Contact Us
          </Link>
          <a
            className="hover:text-gray"
            href="https://salmon-island-04e296f10.5.azurestaticapps.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            Info
          </a>
          {!user ? (
            <Link className="hover:text-gray" to="/auth">
              Log In / Sign Up
            </Link>
          ) : (
            <>
              {/* Display user email and greeting */}
              <span className="text-sm">Welcome, {user.email}</span>
              
              {/* Profile link for logged-in users */}
              <Link className="hover:text-gray ml-4" to="/profile">
                Profile
              </Link>

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
      </div>
    </nav>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired,
};

export default Header;
