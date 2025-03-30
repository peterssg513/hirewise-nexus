
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import PsychologistSignup from './pages/PsychologistSignup';
import AdminDashboard from './pages/AdminDashboard';
import DistrictDashboard from './pages/DistrictDashboard';
import PsychologistDashboard from './pages/PsychologistDashboard';
import JobListings from './pages/psychologist/JobListings';
import Evaluations from './pages/psychologist/Evaluations';
import Applications from './pages/psychologist/Applications';
import Profile from './pages/psychologist/Profile';
import DashboardLayout from './layouts/DashboardLayout';
import Settings from './pages/psychologist/Settings';

// ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, profile } = useAuth();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  if (profile && allowedRoles && !allowedRoles.includes(profile.role)) {
    // Redirect to unauthorized page or another appropriate route
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/psychologist-signup" element={<PsychologistSignup />} />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* District Routes */}
          <Route
            path="/district-dashboard"
            element={
              <ProtectedRoute allowedRoles={["district"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DistrictDashboard />} />
          </Route>

          {/* Psychologist Routes */}
          <Route
            path="/psychologist-dashboard"
            element={
              <ProtectedRoute allowedRoles={["psychologist"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PsychologistDashboard />} />
            <Route path="jobs" element={<JobListings />} />
            <Route path="evaluations" element={<Evaluations />} />
            <Route path="applications" element={<Applications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
