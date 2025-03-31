
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DistrictNavigation } from '@/components/district/DistrictNavigation';
import { JobsList } from '@/components/district/JobsList';
import { SchoolsList } from '@/components/district/SchoolsList';
import { StudentsList } from '@/components/district/StudentsList';
import { EvaluationsList } from '@/components/district/EvaluationsList';
import { TabsContent } from '@/components/ui/tabs';

const DistrictDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading false after a short delay to simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">District Dashboard</h1>
      
      <DistrictNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="mt-4">
        {activeTab === 'overview' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
            <p className="text-gray-600 mb-4">
              Manage your district's jobs, schools, students, and evaluation requests all in one place.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-700">Active Jobs</h3>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-700">Schools</h3>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-700">Students</h3>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <h3 className="font-medium text-amber-700">Pending Evaluations</h3>
                <p className="text-2xl font-bold mt-2">-</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'jobs' && user?.id && (
          <JobsList districtId={user.id} />
        )}
        
        {activeTab === 'schools' && user?.id && (
          <SchoolsList districtId={user.id} />
        )}
        
        {activeTab === 'students' && user?.id && (
          <StudentsList districtId={user.id} />
        )}
        
        {activeTab === 'evaluations' && user?.id && (
          <EvaluationsList districtId={user.id} />
        )}
      </div>
    </div>
  );
};

export default DistrictDashboard;
