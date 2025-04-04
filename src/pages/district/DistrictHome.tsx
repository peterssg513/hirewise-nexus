import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDistrictProfile } from '@/services/districtProfileService';
import { fetchJobs } from '@/services/jobService';
import { fetchSchools } from '@/services/schoolService';
import { getEvaluationRequests } from '@/services/evaluationRequestService';
import { useToast } from '@/hooks/use-toast';
import { DistrictProfile } from '@/components/district/DistrictProfile';
import { DistrictOverview }  from '@/components/district/DistrictOverview';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { District } from '@/types/district';

const DistrictHome = () => {
  const [district, setDistrict] = useState<District | null>(null);
  const [jobsCount, setJobsCount] = useState({
    active: 0,
    pending: 0,
    offered: 0,
    accepted: 0,
    total: 0
  });
  const [schoolsCount, setSchoolsCount] = useState(0);
  const [evaluationsCount, setEvaluationsCount] = useState({
    open: 0,
    offered: 0,
    accepted: 0,
    inProgress: 0,
    closed: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const districtProfile = await fetchDistrictProfile(user.id);
        
        if (districtProfile) {
          setDistrict(districtProfile);
          
          // Load jobs count
          const jobs = await fetchJobs(districtProfile.id);
          const activeJobs = jobs.filter(job => job.status === 'active').length;
          const pendingJobs = jobs.filter(job => job.status === 'pending').length;
          const offeredJobs = jobs.filter(job => job.status === 'offered').length;
          const acceptedJobs = jobs.filter(job => job.status === 'accepted').length;
          
          setJobsCount({
            active: activeJobs,
            pending: pendingJobs,
            offered: offeredJobs,
            accepted: acceptedJobs,
            total: jobs.length
          });
          
          // Load schools count
          const schools = await fetchSchools(districtProfile.id);
          setSchoolsCount(schools.length);
          
          // Load evaluations count
          const evaluations = await getEvaluationRequests(districtProfile.id);
          setEvaluationsCount({
            open: evaluations.filter(e => e.status === 'Open').length,
            offered: evaluations.filter(e => e.status === 'Offered').length,
            accepted: evaluations.filter(e => e.status === 'Accepted').length,
            inProgress: evaluations.filter(e => e.status === 'Evaluation In Progress').length,
            closed: evaluations.filter(e => e.status === 'Closed').length,
            total: evaluations.length
          });
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
          title: "Error loading district data",
          description: "Failed to load district information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, toast]);
  
  const handleProfileUpdated = (updatedDistrict: District) => {
    setDistrict(updatedDistrict);
    toast({
      title: "Profile Updated",
      description: "Your district profile has been updated successfully.",
    });
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {district.first_name || district.name}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/district-dashboard/jobs')}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
          <Button 
            onClick={() => navigate('/district-dashboard/evaluations')}
            variant="outline"
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Evaluation
          </Button>
        </div>
      </div>
      
      <div className="grid gap-8 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>District Profile</CardTitle>
            <CardDescription>
              Manage your district information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DistrictProfile 
              district={district} 
              onProfileUpdated={handleProfileUpdated} 
            />
          </CardContent>
        </Card>
      </div>
      
      <DistrictOverview 
        district={district}
        jobsCount={jobsCount}
        schoolsCount={schoolsCount}
        evaluationsCount={evaluationsCount}
      />
    </div>
  );
};

export default DistrictHome;
