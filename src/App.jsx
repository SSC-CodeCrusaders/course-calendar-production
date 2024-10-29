import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Auth from "./Components/Auth";
import Layout from "./Components/Layout";
import { useUser } from './contexts/UserContext';
import ErrorBoundary from './Components/ErrorBoundary';
import { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';

// Lazy load components for performance optimization
const LazyUserProfile = lazy(() => import('./Components/UserProfile'));
const LazyUserInput = lazy(() => import('./Components/UserInputForm'));
const LazyDownload = lazy(() => import('./Components/Download'));

// ProtectedRoute component to restrict access to authenticated users only
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/auth" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes with Layout */}
            <Route path="/*" element={<Layout />}>
              <Route index element={<LazyUserInput />} />
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
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}
