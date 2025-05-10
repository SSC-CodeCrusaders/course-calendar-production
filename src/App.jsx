import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./Components/Header";
import Auth from "./Components/Auth";
import UserProfile from "./Components/UserProfile";
import Homepage from "./Components/MainPage/Homepage";
import AboutUsPage from "./Components/Pages/AboutUsPage"
import TutorialPage from "./Components/Pages/TutorialPage";
import FeaturesPage from "./Components/Pages/FeaturesPage"
import FaqPage from "./Components/Pages/faqPage";
import ContactUsPage from "./Components/Pages/ContactUsPage"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [user, setUser] = useState(null);

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
      <div className="pt-20 h-full">
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
          <Route path="/tutorial" element={<TutorialPage/>} />
          <Route path="/features" element={<FeaturesPage/>} />
          <Route path="/faq" element={<FaqPage/>} />
          <Route path="/contactus" element={<ContactUsPage/>} />
          {/* New 1-4 */}

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={<ProtectedRoute element={<UserProfile />} />}
          />

          {/* Redirect unknown routes to home or a 404 page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
}
