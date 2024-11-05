import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./Components/Header";
import Auth from "./Components/Auth";
import UserProfile from "./Components/UserProfile";
import Homepage from "./Components/MainPage/Homepage";
import AboutUsPage from "./Components/Pages/AboutUsPage"
import { supabase } from "./utils/supabaseClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [user, setUser] = useState(null);

  // Handle user session persistence and state updates
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    getSession();
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
        {/* Homepage Route */}
        <Route path="/" element={<Homepage />} />

        {/* New 1-4 */}
        <Route path="/aboutus" element={<AboutUsPage/>} />
        <Route path="/features" element={null} />
        <Route path="/faq" element={null} />
        <Route path="/tutorial" element={null} />
        {/* New 1-4 */}

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={<ProtectedRoute element={<UserProfile />} />}
        />

        {/* Redirect unknown routes to home or a 404 page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
