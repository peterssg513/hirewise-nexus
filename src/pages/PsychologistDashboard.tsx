import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, BriefcaseBusiness, ClipboardCheck, FileSpreadsheet, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobApplication {
  id: string;
  job_title: string;
  district_name: string;
  status: string;
  created_at: string;
  has_evaluation: boolean;
  evaluation_id?: string;
}

interface Evaluation {
  id: string;
  status: string;
  job_title: string;
  district_name: string;
  created_at: string;
}

const PsychologistDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const [upcomingEvaluations, setUpcomingEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Clear existing data to prevent showing stale data
      setRecentApplications([]);
      setUpcomingEvaluations([]);
      
      if (!user?.id) return;
      
      // Fetch recent applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          created_at,
          jobs!inner (
            title,
            districts (
              name
            )
          ),
          evaluations (
            id
          )
        `)
        .eq('psychologist_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (applicationsError) throw applicationsError;
      
      if (applicationsData) {
        // Transform applications data
        const applications = applicationsData.map(app => ({
          id: app.id,
          job_title: app.jobs.title,
          district_name: app.jobs.districts.name,
          status: app.status,
          created_at: app.created_at,
          has_evaluation: app.evaluations && app.evaluations.length > 0,
          evaluation_id: app.evaluations && app.evaluations.length > 0 ? app.evaluations[0].id : undefined
        }));
        
        setRecentApplications(applications);
      }
      
      // Fetch upcoming evaluations (pending or in progress)
      const { data: evaluationsData, error: evaluationsError } = await supabase
        .from('evaluations')
        .select(`
          id,
          status,
          created_at,
          applications!inner (
            psychologist_id,
            jobs (
              title,
              districts (
                name
              )
            )
          )
        `)
        .eq('applications.psychologist_id', user.id)
        .or('status.eq.assigned,status.eq.in_progress')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (evaluationsError) throw evaluationsError;
      
      // Transform evaluations data - fixed the reserved keyword 'eval'
      const evaluations = evaluationsData.map(item => ({
        id: item.id,
        status: item.status,
        job_title: item.applications.jobs.title,
        district_name: item.applications.jobs.districts.name,
        created_at: item.created_at
      }));
      
      setUpcomingEvaluations(evaluations);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error fetching data',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
    }
  };
  
  const renderEvaluationStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Submitted</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Assigned</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-psyched-darkBlue">
          Welcome back, {profile?.name || 'Psychologist'}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your recent activity
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Job Listings</CardTitle>
            <CardDescription>Browse available positions</CardDescription>
          </CardHeader>
          <CardContent>
            <BriefcaseBusiness className="h-10 w-10 text-psyched-lightBlue mb-2" />
            <p className="text-sm text-gray-600">
              Find job opportunities that match your qualifications
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate('/psychologist-dashboard/jobs')}
              className="w-full bg-psyched-lightBlue hover:bg-psyched-lightBlue/90"
            >
              View Jobs
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Applications</CardTitle>
            <CardDescription>Track your job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <ClipboardCheck className="h-10 w-10 text-psyched-orange mb-2" />
            <p className="text-sm text-gray-600">
              Monitor status and updates on your applications
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate('/psychologist-dashboard/applications')}
              className="w-full bg-psyched-orange hover:bg-psyched-orange/90"
            >
              View Applications
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Profile</CardTitle>
            <CardDescription>Update your information</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar className="h-10 w-10 text-psyched-yellow mb-2" />
            <p className="text-sm text-gray-600">
              Keep your profile information current
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate('/psychologist-dashboard/profile')}
              className="w-full bg-psyched-yellow hover:bg-psyched-yellow/90"
            >
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-psyched-darkBlue">Recent Applications</h2>
          <Button 
            variant="ghost" 
            className="h-8 gap-1 text-psyched-darkBlue"
            onClick={() => navigate('/psychologist-dashboard/applications')}
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="bg-gray-50/50 animate-pulse">
                <CardContent className="py-4">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentApplications.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-gray-500">You haven't applied to any jobs yet.</p>
              <Button 
                onClick={() => navigate('/psychologist-dashboard/jobs')} 
                className="mt-2 bg-psyched-lightBlue hover:bg-psyched-lightBlue/90"
              >
                Browse Job Listings
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentApplications.map(application => (
              <Card key={application.id}>
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-medium mb-1">{application.job_title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{application.district_name}</span>
                        {renderStatusBadge(application.status)}
                      </div>
                    </div>
                    
                    {application.has_evaluation && (
                      <Button 
                        onClick={() => navigate(`/psychologist-dashboard/evaluation/${application.evaluation_id}`)}
                        className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Go to Evaluation
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Upcoming Evaluations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-psyched-darkBlue">Upcoming Evaluations</h2>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="bg-gray-50/50 animate-pulse">
                <CardContent className="py-4">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : upcomingEvaluations.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-gray-500">You don't have any upcoming evaluations.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingEvaluations.map(evaluation => (
              <Card key={evaluation.id}>
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-medium mb-1">{evaluation.job_title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{evaluation.district_name}</span>
                        {renderEvaluationStatusBadge(evaluation.status)}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/psychologist-dashboard/evaluation/${evaluation.id}`)}
                      className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Start Evaluation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PsychologistDashboard;
