
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Public Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import PsychologistsLanding from './pages/PsychologistsLanding';
import DistrictsLanding from './pages/DistrictsLanding';
import SuccessStories from './pages/SuccessStories';
import NotFound from './pages/NotFound';

// Case Studies
import DenverPublicSchools from './pages/case-studies/DenverPublicSchools';
import KansasCityPublicSchools from './pages/case-studies/KansasCityPublicSchools';
import MidwesternRegionalDistrict from './pages/case-studies/MidwesternRegionalDistrict';

// Signup Pages
import PsychologistSignup from './pages/PsychologistSignup';
import DistrictSignup from './pages/DistrictSignup';

// Admin Pages
import AdminSetup from './pages/AdminSetup';
import AdminCreate from './pages/AdminCreate';
import AdminAuth from './pages/AdminAuth';

// Dashboard Pages
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import PsychologistDashboard from './pages/PsychologistDashboard';
import DistrictDashboard from './pages/DistrictDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';

// District Dashboard Pages
import DistrictHome from './pages/district/DistrictHome';
import DistrictJobs from './pages/district/DistrictJobs';
import DistrictSchools from './pages/district/DistrictSchools';
import DistrictEvaluations from './pages/district/DistrictEvaluations';
import DistrictStudents from './pages/district/DistrictStudents';
import DistrictSettings from './pages/district/DistrictSettings';

// Psychologist Dashboard Pages
import Applications from './pages/psychologist/Applications';
import Evaluations from './pages/psychologist/Evaluations';

// Admin Dashboard Pages
import Approvals from './pages/admin/Approvals';
import AdminDistricts from './pages/admin/AdminDistricts';
import AdminPsychologists from './pages/admin/AdminPsychologists';
import AdminSchools from './pages/admin/AdminSchools';
import AdminJobs from './pages/admin/AdminJobs';
import AdminEvaluations from './pages/admin/AdminEvaluations';
import AdminStudents from './pages/admin/AdminStudents';

// Alternative Designs
import BrandGuide from './pages/BrandGuide';
import AIInspiredLanding from './pages/AIInspiredLanding';
import ThirdLandingPage from './pages/ThirdLandingPage';

const App = () => {
  const { isAuthenticated, profile } = useAuth();

  return (
    <div className="min-h-screen bg-white text-foreground font-sans">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/for-psychologists" element={<PsychologistsLanding />} />
        <Route path="/for-districts" element={<DistrictsLanding />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        
        {/* Case Studies */}
        <Route path="/success-stories/denver-public-schools" element={<DenverPublicSchools />} />
        <Route path="/success-stories/kansas-city-public-schools" element={<KansasCityPublicSchools />} />
        <Route path="/success-stories/midwestern-regional-district" element={<MidwesternRegionalDistrict />} />
        
        {/* Signup Routes */}
        <Route path="/psychologist-signup" element={<PsychologistSignup />} />
        <Route path="/district-signup" element={<DistrictSignup />} />
        
        {/* Admin Setup */}
        <Route path="/admin-setup" element={<AdminSetup />} />
        <Route path="/admin-create" element={<AdminCreate />} />
        <Route path="/admin-auth" element={<AdminAuth />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/psychologist-dashboard"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['psychologist']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <PsychologistDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/psychologist-dashboard/applications"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['psychologist']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <Applications />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/psychologist-dashboard/evaluations"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['psychologist']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <Evaluations />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/district-dashboard"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['district']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <DistrictDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/district-dashboard/home"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['district']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <DistrictHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/district-dashboard/jobs"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['district']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <DistrictJobs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/district-dashboard/schools"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['district']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <DistrictSchools />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/district-dashboard/evaluations"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['district']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <DistrictEvaluations />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/district-dashboard/students"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['district']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <DistrictStudents />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/district-dashboard/settings"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['district']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <DistrictSettings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['admin']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard/approvals"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['admin']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <Approvals />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard/districts"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['admin']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <AdminDistricts />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard/psychologists"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['admin']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <AdminPsychologists />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard/schools"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['admin']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <AdminSchools />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard/jobs"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['admin']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <AdminJobs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard/evaluations"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['admin']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <AdminEvaluations />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard/students"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={['admin']}
              userRole={profile?.role}
              redirectPath="/unauthorized"
            >
              <DashboardLayout>
                <AdminStudents />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Alternative design routes */}
        <Route path="/brand-guide" element={<BrandGuide />} />
        <Route path="/ai-inspired" element={<AIInspiredLanding />} />
        <Route path="/third-landing" element={<ThirdLandingPage />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
