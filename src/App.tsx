
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import React, { useEffect } from "react"; // Add explicit React import

// Import the storage setup
import './services/setupStorageBuckets';
import { setupFormDataColumn } from './services/setupFormDataColumn';

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import PsychologistDashboard from "./pages/PsychologistDashboard";
import DistrictDashboard from "./pages/DistrictDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PsychologistsLanding from "./pages/PsychologistsLanding";
import DistrictsLanding from "./pages/DistrictsLanding";
import PsychologistSignup from "./pages/PsychologistSignup";

// Psychologist Pages
import JobListings from "./pages/psychologist/JobListings";
import Applications from "./pages/psychologist/Applications";
import Profile from "./pages/psychologist/Profile";
import Evaluation from "./pages/psychologist/Evaluation";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// Create the query client outside of the component
const queryClient = new QueryClient();

const App = () => {
  // Setup the form_data column when the app starts
  useEffect(() => {
    setupFormDataColumn();
  }, []);
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/for-psychologists" element={<PsychologistsLanding />} />
                <Route path="/for-districts" element={<DistrictsLanding />} />
                
                {/* Psychologist Signup */}
                <Route path="/psychologist-signup" element={<PsychologistSignup />} />
                
                {/* Protected Routes - Psychologist */}
                <Route path="/psychologist-dashboard" element={
                  <ProtectedRoute allowedRoles={['psychologist']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<PsychologistDashboard />} />
                  <Route path="jobs" element={<JobListings />} />
                  <Route path="applications" element={<Applications />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
                
                {/* Separate route for evaluation to make it fullscreen */}
                <Route path="/psychologist-dashboard/evaluation/:id" element={
                  <ProtectedRoute allowedRoles={['psychologist']}>
                    <Evaluation />
                  </ProtectedRoute>
                } />
                
                {/* Protected Routes - District */}
                <Route path="/district-dashboard" element={
                  <ProtectedRoute allowedRoles={['district']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DistrictDashboard />} />
                  {/* Add nested routes for district here */}
                </Route>
                
                {/* Protected Routes - Admin */}
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  {/* Add nested routes for admin here */}
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
