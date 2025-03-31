
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import PsychologistSignup from './pages/PsychologistSignup';
import DistrictSignup from './pages/DistrictSignup';
import AdminDashboard from './pages/AdminDashboard';
import DistrictDashboard from './pages/DistrictDashboard';
import PsychologistDashboard from './pages/PsychologistDashboard';
import JobListings from './pages/psychologist/JobListings';
import Evaluations from './pages/psychologist/Evaluations';
import Applications from './pages/psychologist/Applications';
import Profile from './pages/psychologist/Profile';
import DashboardLayout from './layouts/DashboardLayout';
import Settings from './pages/psychologist/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import PsychologistsLanding from './pages/PsychologistsLanding';
import DistrictsLanding from './pages/DistrictsLanding';
import AdminAuth from './pages/AdminAuth';
import AdminCreate from './pages/AdminCreate';
import AdminSetup from './pages/AdminSetup';
import AdminDistricts from './pages/admin/AdminDistricts';
import AdminPsychologists from './pages/admin/AdminPsychologists';
import AdminJobs from './pages/admin/AdminJobs';
import AdminEvaluations from './pages/admin/AdminEvaluations';
import Unauthorized from './pages/Unauthorized';

// Use a non-guessable path for admin authentication
const ADMIN_AUTH_PATH = 'admin-secret-auth-84721';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/for-psychologists" element={<PsychologistsLanding />} />
        <Route path="/for-districts" element={<DistrictsLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/psychologist-signup" element={<PsychologistSignup />} />
        <Route path="/district-signup" element={<DistrictSignup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin Auth Routes - Non-guessable URL */}
        <Route path={`/${ADMIN_AUTH_PATH}`} element={<AdminAuth />} />
        <Route path={`/${ADMIN_AUTH_PATH}/setup`} element={<AdminSetup />} />

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
          <Route path="create-admin" element={<AdminCreate />} />
          <Route path="districts" element={<AdminDistricts />} />
          <Route path="psychologists" element={<AdminPsychologists />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="evaluations" element={<AdminEvaluations />} />
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
          {/* Add routes for district tabs */}
          <Route path="jobs" element={<DistrictDashboard />} />
          <Route path="schools" element={<DistrictDashboard />} />
          <Route path="students" element={<DistrictDashboard />} />
          <Route path="evaluations" element={<DistrictDashboard />} />
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
      </Routes>
    </AuthProvider>
  );
}

export default App;
