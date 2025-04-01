
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Building, Calendar, ClipboardCheck, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    work_type: string;
    districts: {
      id: string;
      name: string;
      location: string;
    };
  };
  evaluations: {
    id: string;
    status: string;
  }[] | null;
}

const MyApplications: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          job:jobs (
            id,
            title,
            description,
            location,
            work_type,
            districts (
              id,
              name,
              location
            )
          ),
          evaluations (
            id,
            status
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Application[];
    }
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>;
      case 'accepted':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Accepted</Badge>;
      case 'offered':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Offered</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Under Review</Badge>;
    }
  };
  
  const handleViewEvaluation = (evaluationId: string) => {
    navigate(`/psychologist-dashboard/evaluation/${evaluationId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Applications</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Applications</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-500">Error loading applications</h3>
              <p className="text-muted-foreground">{(error as Error).message}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Applications</h2>
      </div>

      {applications && applications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't applied for any jobs yet. Browse available positions to get started.
            </p>
            <Button 
              onClick={() => navigate('/psychologist-dashboard/jobs')}
              className="bg-psyched-lightBlue hover:bg-psyched-lightBlue/90"
            >
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications?.map(application => {
            const hasEvaluation = application.evaluations && application.evaluations.length > 0;
            const evaluationId = hasEvaluation ? application.evaluations[0].id : null;
            
            return (
              <Card key={application.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{application.job.title}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="h-3.5 w-3.5 mr-1.5" />
                          {application.job.districts.name}
                        </div>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {application.job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        Applied: {formatDate(application.created_at)}
                      </div>
                      
                      {application.job.location && (
                        <div className="flex items-center">
                          <Building className="h-3.5 w-3.5 mr-1.5" />
                          {application.job.location}
                        </div>
                      )}
                      
                      {application.status === 'approved' && !hasEvaluation && (
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          Waiting for evaluation assignment
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {hasEvaluation && (
                    <>
                      <Separator />
                      <div className="p-4 bg-blue-50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-blue-700">
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="font-medium">Evaluation assigned</span>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => evaluationId && handleViewEvaluation(evaluationId)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            View Evaluation
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {(application.status === 'offered') && (
                    <>
                      <Separator />
                      <div className="p-4 bg-green-50">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-green-700">
                            <ClipboardCheck className="h-4 w-4 mr-2" />
                            <span className="font-medium">You've been offered this position!</span>
                          </div>
                          <div className="space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                              Decline
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Accept Offer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
