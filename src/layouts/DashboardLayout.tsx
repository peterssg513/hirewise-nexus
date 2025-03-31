
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SidebarLayout from './SidebarLayout';

const DashboardLayout = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarLayout />
    </div>
  );
};

export default DashboardLayout;
