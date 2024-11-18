// src/Components/Header.jsx
import { Link } from "react-router-dom";
import { supabase } from '../utils/supabaseClient';
import { useEffect } from 'react';
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
    await supabase.auth.signOut();
    setUser(null); // Update user state to null on sign-out
  };

  return (
    <nav className="bg-lewisRed text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">LewisCal</Link>
        </h1>
        <div className="space-x-6 flex items-center">
          <Link className="hover:text-gray" to="/">
            Home
          </Link>
          <Link className="hover:text-gray" to="/aboutus">
            About Us
          </Link>
          <Link className="hover:text-gray" to="/">
            New2
          </Link>
          <Link className="hover:text-gray" to="/">
            New3
          </Link>
          <Link className="hover:text-gray" to="/tutorial">
            Tutorial
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
