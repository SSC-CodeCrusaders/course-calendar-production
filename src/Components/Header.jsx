import { Link } from "react-router-dom";
import { supabase } from '../utils/supabaseClient';
import { useEffect, useState } from 'react';

const Header = () => {
  const [user, setUser] = useState(null);

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
  }, []);

  return (
    <nav className="bg-lewisRed text-white  py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">LewisCal</h1>
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
          {!user ? (
            <Link className="hover:text-gray" to="/auth">
              Log In / Sign Up
            </Link>
          ) : (
            <>
              <span className="text-sm mr-4">Welcome, {user.email}</span>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition"
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
