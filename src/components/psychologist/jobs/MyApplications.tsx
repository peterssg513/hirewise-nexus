
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Building, Calendar, MapPin, Briefcase, CheckCircle, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface Application {
  id: string;
  status: string;
  created_at: string;
  job: {
    id: string;
    title: string;
    description: string;
    work_type: string;
    work_location: string;
    location: string;
    district: {
      name: string;
      location: string;
    };
  };
  has_evaluation: boolean;
  evaluation_id?: string;
}

const MyApplications = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          created_at,
          jobs (
            id,
            title,
            description,
            work_type,
            work_location,
            location,
            districts (
              name,
              location
            )
          ),
          evaluations (
            id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(app => ({
        id: app.id,
        status: app.status,
        created_at: app.created_at,
        job: {
          id: app.jobs.id,
          title: app.jobs.title,
          description: app.jobs.description,
          work_type: app.jobs.work_type,
          work_location: app.jobs.work_location,
          location: app.jobs.location,
          district: {
            name: app.jobs.districts?.name || 'Unknown District',
            location: app.jobs.districts?.location || ''
          }
        },
        has_evaluation: app.evaluations && app.evaluations.length > 0,
        evaluation_id: app.evaluations && app.evaluations.length > 0 ? app.evaluations[0].id : undefined
      }));
    }
  });

  const renderStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-red-500">Error loading your applications</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-2"
            variant="outline"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-gray-500">You haven't applied to any jobs yet.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-psyched-lightBlue hover:bg-psyched-lightBlue/90"
          >
            Browse Job Listings
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map(application => (
        <Card key={application.id} className="overflow-hidden border-l-4" 
              style={{ borderLeftColor: application.status === 'approved' ? '#10b981' : application.status === 'rejected' ? '#ef4444' : '#f59e0b' }}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{application.job.title}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-1.5" />
                  {application.job.district.name}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {renderStatus(application.status)}
                <div className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(application.created_at)}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3">
            {/* Job brief */}
            <p className="text-sm line-clamp-2 text-gray-700 mb-3">
              {application.job.description}
            </p>
            
            {/* Job details */}
            <div className="flex flex-wrap text-sm text-gray-600 mb-3 gap-y-1">
              {application.job.location && (
                <div className="flex items-center mr-4">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                  <span>{application.job.location}</span>
                </div>
              )}
              
              {application.job.work_type && (
                <div className="flex items-center mr-4">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                  <span>{application.job.work_type}</span>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between items-center pt-2 border-t bg-gray-50">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>Applied {formatDate(application.created_at)}</span>
            </div>
            
            {application.has_evaluation && (
              <Button
                variant="success"
                className="font-medium bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.location.href = `/psychologist-dashboard/evaluation/${application.evaluation_id}`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Go to Evaluation
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MyApplications;
