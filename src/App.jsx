import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./Components/Header";
import UserInput from "./Components/UserInputForm";
import Auth from "./Components/Auth";
import UserProfile from "./Components/UserProfile";
import Sidebar from "./Components/Sidebar";
import { supabase } from './utils/supabaseClient';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [user, setUser] = useState(null);

  // useEffect to handle user session persistence and state updates
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

  // ProtectedRoute component to restrict access to authenticated users only
  // Redirects to the /auth route if the user is not logged in
  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/auth" replace />;
  };

  ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired,
  };

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/auth" 
          element={!user ? <Auth /> : <Navigate to="/" replace />} 
        />
        {/* Redirects to home if user is logged in */}
        <Route path="/" element={<UserInput />} />
        <Route path="/*" element={<Sidebar />} />

        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={<ProtectedRoute element={<UserProfile />} />} 
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
