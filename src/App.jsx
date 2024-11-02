import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./Components/Auth";
import Layout from "./Components/Layout";
import { useUser } from './contexts/UserContext';
import ErrorBoundary from './Components/ErrorBoundary';
import PropTypes from 'prop-types';
import Homepage from './Components/MainPage/Homepage';

// Lazy load components for performance optimization
const LazyUserProfile = lazy(() => import('./Components/UserProfile'));
const LazyDownload = lazy(() => import('./Components/Download'));
const CreateCalendar = lazy(() => import('./Components/CreateCalendar'));

// ProtectedRoute component to restrict access to authenticated users only
const ProtectedRoute = ({ children }) => {
  const { state } = useUser();

  if (state.loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return state.user ? children : <Navigate to="/auth" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes with Layout */}
            <Route path="/*" element={<Layout />}>
              {/* Main route pointing to Homepage */}
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Homepage /> {/* Render Homepage for the root path */}
                  </ProtectedRoute>
                }
              />
              <Route path="download" element={<LazyDownload />} />

              {/* Profile Route */}
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <LazyUserProfile />
                  </ProtectedRoute>
                }
              />

              {/* Create Calendar Route */}
              <Route
                path="create"
                element={
                  <ProtectedRoute>
                    <CreateCalendar />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}
