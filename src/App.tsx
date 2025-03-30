
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import PsychologistDashboard from "./pages/PsychologistDashboard";
import DistrictDashboard from "./pages/DistrictDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/for-psychologists" element={<Index />} />
            <Route path="/for-districts" element={<Index />} />
            
            {/* Protected Routes - Psychologist */}
            <Route path="/psychologist-dashboard" element={
              <ProtectedRoute allowedRoles={['psychologist']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<PsychologistDashboard />} />
              {/* Add nested routes for psychologist here */}
            </Route>
            
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
);

export default App;
