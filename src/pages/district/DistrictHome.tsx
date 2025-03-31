
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDistrictProfile } from '@/services/districtProfileService';
import { fetchJobs } from '@/services/jobService';
import { fetchSchools } from '@/services/schoolService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DistrictOverview } from '@/components/district/DistrictOverview';
import { District } from '@/types/district';

const DistrictHome = () => {
  const [district, setDistrict] = useState<District | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobsCount, setJobsCount] = useState({ active: 0, pending: 0, total: 0 });
  const [schoolsCount, setSchoolsCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const districtProfile = await fetchDistrictProfile(user.id);
        
        if (districtProfile) {
          setDistrict(districtProfile);
          
          // Get jobs count
          const jobs = await fetchJobs(districtProfile.id);
          const activeCount = jobs.filter(job => job.status === 'active').length;
          const pendingCount = jobs.filter(job => job.status === 'pending').length;
          setJobsCount({
            active: activeCount,
            pending: pendingCount,
            total: jobs.length
          });
          
          // Get schools count
          const schools = await fetchSchools(districtProfile.id);
          setSchoolsCount(schools.length);
        } else {
          toast({
            title: "Error loading district profile",
            description: "Could not find your district profile. Please contact support.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching district data:', error);
        toast({
          title: "Error loading dashboard data",
          description: "Failed to load dashboard information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [user, toast]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!district) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold mb-4">District Profile Not Found</h2>
        <p className="text-muted-foreground">
          We couldn't find your district profile. Please contact support for assistance.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">District Dashboard</h1>
      </div>
      
      <DistrictOverview district={district} jobsCount={jobsCount} schoolsCount={schoolsCount} />
    </div>
  );
};

export default DistrictHome;
