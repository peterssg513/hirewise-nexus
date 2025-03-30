import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import DistrictDashboard from './pages/district/DistrictDashboard';
import PsychologistDashboard from './pages/psychologist/PsychologistDashboard';
import JobListings from './pages/psychologist/JobListings';
import Evaluations from './pages/psychologist/Evaluations';
import Applications from './pages/psychologist/Applications';
import Profile from './pages/psychologist/Profile';
import PsychologistSignup from './pages/PsychologistSignup';
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-profile" element={<UpdateProfilePage />} />
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
