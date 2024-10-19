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

  // ProtectedRoute component to restrict access based on user state
  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/auth" replace />;
  };

  ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired,
  };

  return (
    <Router>
      {/* Render Header for all routes */}
      <Header user={user} setUser={setUser} />
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" replace />} />
        <Route path="/" element={<UserInput />} />
        <Route path="/*" element={<Sidebar />} />

        {/* Protected Routes */}
        <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
