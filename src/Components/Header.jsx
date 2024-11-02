import { Link } from "react-router-dom";
import { useUser } from '../contexts/UserContext';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

const Header = () => {
  const { state, dispatch } = useUser();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out: ' + error.message);
    } else {
      toast.success('Signed out successfully');
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_CALENDARS', payload: [] });
      dispatch({ type: 'SET_CURRENT_INDEX', payload: null });
    }
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
          <Link className="hover:text-gray" to="/download">
            Download
          </Link>
          <a
            className="hover:text-gray"
            href="https://salmon-island-04e296f10.5.azurestaticapps.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            Info
          </a>
          {!state.user ? (
            <Link className="hover:text-gray" to="/auth">
              Log In / Sign Up
            </Link>
          ) : (
            <>
              {/* Display user email and greeting */}
              <span className="text-sm">Welcome, {state.user.email}</span>

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

export default Header;
