
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const renderStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
  }
};

const Applications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchApplicationsData();
    }
  }, [user]);
  
  const fetchApplicationsData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch applications
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
        .order('created_at', { ascending: false });
        
      if (applicationsError) throw applicationsError;
      
      // Transform applications data
      const transformedApplications = applicationsData.map(app => ({
        id: app.id,
        job_title: app.jobs.title,
        district_name: app.jobs.districts.name,
        status: app.status,
        created_at: app.created_at,
        has_evaluation: app.evaluations && app.evaluations.length > 0,
        evaluation_id: app.evaluations && app.evaluations.length > 0 ? app.evaluations[0].id : undefined
      }));
      
      setApplications(transformedApplications);
      
      // Fetch evaluations
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
        .order('created_at', { ascending: false });
        
      if (evaluationsError) throw evaluationsError;
      
      // Transform evaluations data
      const transformedEvaluations = evaluationsData.map(item => ({
        id: item.id,
        status: item.status,
        job_title: item.applications.jobs.title,
        district_name: item.applications.jobs.districts.name,
        created_at: item.created_at
      }));
      
      setEvaluations(transformedEvaluations);
    } catch (error: any) {
      console.error('Error fetching applications data:', error);
      toast({
        title: 'Error fetching data',
        description: error.message || 'Failed to load applications data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track and manage your job applications and evaluations</p>
      </div>
      
      {/* Applications Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Job Applications</h2>
        
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
        ) : applications.length === 0 ? (
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
            {applications.map(application => (
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
      
      {/* Evaluations Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Evaluations</h2>
        
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
        ) : evaluations.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-gray-500">You don't have any evaluations yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {evaluations.map(evaluation => (
              <Card key={evaluation.id}>
                <CardContent className="py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="font-medium mb-1">{evaluation.job_title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{evaluation.district_name}</span>
                        <Badge 
                          variant={evaluation.status === 'submitted' ? 'default' : 'secondary'}
                          className={evaluation.status === 'submitted' ? 'bg-green-500' : ''}
                        >
                          {evaluation.status === 'in_progress' ? 'In Progress' : 
                           evaluation.status === 'submitted' ? 'Submitted' : 
                           evaluation.status === 'approved' ? 'Approved' : 'Assigned'}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => navigate(`/psychologist-dashboard/evaluation/${evaluation.id}`)}
                      className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      {evaluation.status === 'submitted' ? 'View' : 'Continue'} Evaluation
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

export default Applications;
