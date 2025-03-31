
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DistrictNavigation from '@/components/district/DistrictNavigation'; // Fixed import
import { JobsList } from '@/components/district/JobsList';
import { SchoolsList } from '@/components/district/SchoolsList';
import { StudentsList } from '@/components/district/StudentsList';
import { EvaluationsList } from '@/components/district/EvaluationsList';
import { fetchDistrictProfile } from '@/services/districtProfileService';
import { Skeleton } from '@/components/ui/skeleton';

const DistrictDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [districtId, setDistrictId] = useState<string | null>(null);

  useEffect(() => {
    const loadDistrictProfile = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const district = await fetchDistrictProfile(user.id);
        
        if (district) {
          setDistrictId(district.id);
        } else {
          toast({
            title: 'Error',
            description: 'Could not load district profile.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error loading district profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load district data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDistrictProfile();
  }, [user, toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!districtId) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Profile Setup Required</h2>
        <p className="text-gray-600 mb-4">
          Please complete your district profile setup before accessing dashboard features.
        </p>
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
        
        {activeTab === 'jobs' && districtId && (
          <JobsList districtId={districtId} />
        )}
        
        {activeTab === 'schools' && districtId && (
          <SchoolsList districtId={districtId} />
        )}
        
        {activeTab === 'students' && districtId && (
          <StudentsList districtId={districtId} />
        )}
        
        {activeTab === 'evaluations' && districtId && (
          <EvaluationsList districtId={districtId} />
        )}
      </div>
    </div>
  );
};

export default DistrictDashboard;
