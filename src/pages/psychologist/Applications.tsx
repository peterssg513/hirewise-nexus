
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ClipboardList, FileSpreadsheet, CheckCircle, XCircle, Clock, ChevronRight, 
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Application {
  id: string;
  job_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  job_title: string;
  district_name: string;
  documents_urls: string[] | null;
  notes: string | null;
  evaluation_id?: string;
}

const Applications = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);
  
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (
            id,
            title,
            district_id
          ),
          jobs!inner (
            districts (
              id,
              name
            )
          ),
          evaluations (
            id
          )
        `)
        .eq('psychologist_id', user.id);
        
      if (error) throw error;
      
      // Transform the data to a flatter structure
      const transformedData = data.map(app => ({
        id: app.id,
        job_id: app.job_id,
        status: app.status,
        created_at: app.created_at,
        updated_at: app.updated_at,
        job_title: app.jobs.title,
        district_name: app.jobs.districts.name,
        documents_urls: app.documents_urls,
        notes: app.notes,
        evaluation_id: app.evaluations && app.evaluations.length > 0 ? app.evaluations[0].id : undefined
      }));
      
      setApplications(transformedData);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error fetching applications',
        description: error.message || 'Failed to load your applications',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Adding the missing renderStatus function
  const renderStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return (
          <Badge variant="success" className="flex items-center">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Rejected
          </Badge>
        );
      case 'pending':
      case 'submitted':
      default:
        return (
          <Badge variant="outline" className="flex items-center text-amber-600 border-amber-600">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {status || 'Pending'}
          </Badge>
        );
    }
  };
  
  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status?.toLowerCase() === activeTab;
  });
  
  const handleViewEvaluation = (evaluationId: string) => {
    navigate(`/psychologist-dashboard/evaluation/${evaluationId}`);
  };
  
  // Skeletons for loading state
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-4">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-3 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-9 w-24 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-psyched-darkBlue">My Applications</h1>
        <p className="text-gray-600">Track your job applications and evaluations</p>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              All <span className="ml-1.5 text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                {applications.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex-1 sm:flex-none">
              Approved
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 sm:flex-none">
              Pending
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex-1 sm:flex-none">
              Rejected
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            renderSkeletons()
          ) : filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex flex-col items-center justify-center py-8">
                  <ClipboardList className="h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No applications found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {activeTab === 'all' 
                      ? "You haven't applied for any jobs yet." 
                      : `You don't have any ${activeTab} applications.`}
                  </p>
                  <Button 
                    onClick={() => navigate('/psychologist-dashboard/jobs')}
                    className="bg-psyched-lightBlue hover:bg-psyched-lightBlue/90"
                  >
                    Browse Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map(application => (
                <Card key={application.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{application.job_title}</CardTitle>
                    <CardDescription>{application.district_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`flex ${isMobile ? 'flex-col gap-3' : 'justify-between items-center'}`}>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStatus(application.status)}
                          <span className="text-sm text-gray-500">
                            Applied on {new Date(application.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`${isMobile ? 'w-full' : ''}`}>
                        {application.status === 'approved' && application.evaluation_id ? (
                          <Button
                            onClick={() => handleViewEvaluation(application.evaluation_id!)}
                            className={`bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 ${isMobile ? 'w-full' : ''}`}
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Go to Evaluation
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <div className="text-sm text-gray-500">
                            {application.status === 'approved' 
                              ? 'Waiting for evaluation assignment'
                              : application.status === 'rejected'
                              ? 'This application was not selected'
                              : 'Waiting for district review'}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Applications;
