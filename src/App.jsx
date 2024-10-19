import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Download from "./Components/Download";
import UserInput from "./Components/UserInput";
import Auth from "./Components/Auth";  // Import the Auth component
import { useEffect, useState } from "react";
import { supabase } from './utils/supabaseClient';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Use the updated getSession method
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    // Use onAuthStateChange to listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup the listener when the component is unmounted
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Protects the route
  const ProtectedRoute = ({ element }) => {
    return user ? element : <Auth />;
  };

  return (
    <Router>
      <Header />
      <Routes>
        {/* If user is not logged in, show the Auth component */}
        <Route path="/" element={<UserInput />} />
        
        {/* Login and Signup Route */}
        <Route path="/auth" element={<Auth />} />

        {/* Protect the /download route, only accessible if the user is logged in */}
        <Route path="/download" element={<ProtectedRoute element={<Download />} />} />
      </Routes>
    </Router>
  );
};
