
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDistrictProfile } from '@/services/districtProfileService';
import { fetchJobs } from '@/services/jobService';
import { fetchSchools } from '@/services/schoolService';
import { fetchEvaluationRequests } from '@/services/evaluationRequestService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DistrictOverview } from '@/components/district/DistrictOverview';
import { DistrictProfile } from '@/components/district/DistrictProfile';
import { District } from '@/types/district';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DistrictHome = () => {
  const [district, setDistrict] = useState<District | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobsCount, setJobsCount] = useState({ active: 0, pending: 0, offered: 0, accepted: 0, total: 0 });
  const [schoolsCount, setSchoolsCount] = useState(0);
  const [evaluationsCount, setEvaluationsCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
          const offeredCount = jobs.filter(job => job.status === 'offered').length;
          const acceptedCount = jobs.filter(job => job.status === 'accepted').length;
          setJobsCount({
            active: activeCount,
            pending: pendingCount,
            offered: offeredCount,
            accepted: acceptedCount,
            total: jobs.length
          });
          
          // Get schools count
          const schools = await fetchSchools(districtProfile.id);
          setSchoolsCount(schools.length);
          
          // Get evaluations count
          const evaluations = await fetchEvaluationRequests(districtProfile.id);
          setEvaluationsCount(evaluations.length);
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
  
  const handleProfileUpdated = (updatedDistrict: District) => {
    setDistrict(updatedDistrict);
  };
  
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
        <h1 className="text-2xl font-bold">Welcome, {district.name}</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-1">
          <DistrictOverview 
            district={district} 
            jobsCount={jobsCount} 
            schoolsCount={schoolsCount}
            evaluationsCount={evaluationsCount}
          />
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access frequently used actions</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button 
                  className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                  onClick={() => navigate('/district-dashboard/jobs')}
                >
                  <Plus className="mr-2 h-4 w-4" /> Post New Job
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/district-dashboard/evaluations')}
                >
                  <Plus className="mr-2 h-4 w-4" /> Request Evaluation
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/district-dashboard/schools')}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add School
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/district-dashboard/students')}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Student
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <DistrictProfile 
            district={district} 
            onProfileUpdated={handleProfileUpdated}
            embedded={true}
          />
        </div>
      </div>
    </div>
  );
};

export default DistrictHome;
