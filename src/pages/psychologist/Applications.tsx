import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, FileText, AlertCircle, XCircle, ExternalLink, FileCheck, PanelRightOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  status: string;
  created_at: string;
  notes: string | null;
  job: {
    id: string;
    title: string;
    district_name: string;
    district_location: string;
  };
  evaluation?: {
    id: string;
    status: string;
  };
}

const statusColors: Record<string, { color: string, icon: React.ReactNode, label: string }> = {
  'submitted': { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4" />, label: 'Under Review' },
  'under_review': { color: 'bg-purple-100 text-purple-800', icon: <FileText className="w-4 h-4" />, label: 'Under Review' },
  'approved': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Approved' },
  'rejected': { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" />, label: 'Rejected' },
  'pending': { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="w-4 h-4" />, label: 'Pending' },
};

const Applications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data: psychologist, error: psychError } = await supabase
        .from('psychologists')
        .select('id')
        .single();
      
      if (psychError) throw psychError;
      
      const { data, error: appError } = await supabase
        .from('applications')
        .select(`
          id, 
          status, 
          created_at, 
          notes,
          job:jobs(
            id, 
            title,
            district:districts(name, location)
          ),
          evaluation:evaluations(
            id,
            status
          )
        `)
        .eq('psychologist_id', psychologist.id)
        .order('created_at', { ascending: false });
      
      if (appError) throw appError;
      
      return data?.map(app => ({
        id: app.id,
        status: app.status,
        created_at: app.created_at,
        notes: app.notes,
        job: {
          id: app.job.id,
          title: app.job.title,
          district_name: app.job.district?.name || 'Unknown District',
          district_location: app.job.district?.location || 'Unknown Location',
        },
        evaluation: app.evaluation?.[0] ? {
          id: app.evaluation[0].id,
          status: app.evaluation[0].status,
        } : undefined
      })) as Application[];
    }
  });
  
  const handleStartEvaluation = (evaluationId: string) => {
    navigate(`/psychologist-dashboard/evaluation/${evaluationId}`);
  };
  
  const renderStatus = (status: string) => {
    const { color, icon, label } = statusColors[status] || statusColors.pending;
    return (
      <Badge variant="outline" className={`${color} flex items-center gap-1 font-normal`}>
        {icon}
        <span>{label}</span>
      </Badge>
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getGroupedApplications = () => {
    if (!applications) return { active: [], approved: [], rejected: [] };
    
    return {
      active: applications.filter(app => ['submitted', 'under_review', 'pending'].includes(app.status)),
      approved: applications.filter(app => app.status === 'approved'),
      rejected: applications.filter(app => app.status === 'rejected')
    };
  };
  
  const ApplicationDetails = ({ application }: { application: Application }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Job Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Position</div>
            <div>{application.job.title}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">School District</div>
            <div>{application.job.district_name}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Location</div>
            <div>{application.job.district_location}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Application Date</div>
            <div>{formatDate(application.created_at)}</div>
          </div>
        </div>
      </div>
      
      {application.notes && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Your Application Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line border p-3 rounded-md bg-gray-50">
            {application.notes}
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Application Status</h3>
        <div className="flex items-center">
          {renderStatus(application.status)}
        </div>
      </div>
      
      {application.status === 'approved' && application.evaluation && (
        <div className="space-y-2 pt-2">
          <h3 className="text-lg font-medium">Evaluation</h3>
          <div className="flex flex-col space-y-2">
            <div className="text-sm">
              {application.evaluation.status === 'assigned' ? (
                <p>Your application has been approved. You can now start the evaluation process.</p>
              ) : (
                <p>Evaluation is in progress. Status: {application.evaluation.status}</p>
              )}
            </div>
            <Button 
              onClick={() => handleStartEvaluation(application.evaluation!.id)}
              className="mt-2 bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
            >
              {application.evaluation.status === 'assigned' ? (
                <>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Start Evaluation
                </>
              ) : (
                <>
                  <PanelRightOpen className="mr-2 h-4 w-4" />
                  Continue Evaluation
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-500">Error loading applications</h3>
          <p className="text-muted-foreground">{(error as Error).message}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  const { active, approved, rejected } = getGroupedApplications();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Applications</h1>
        <p className="text-muted-foreground">Track the status of your job applications</p>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : applications?.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No applications yet</h3>
            <p className="text-muted-foreground mb-6">You haven't applied to any jobs yet</p>
            <Button onClick={() => navigate('/psychologist-dashboard/jobs')}>
              Browse Available Jobs
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({applications?.length || 0})</TabsTrigger>
              <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {renderApplicationsTable(applications || [], setSelectedApplication, isMobile)}
            </TabsContent>
            
            <TabsContent value="active">
              {renderApplicationsTable(active, setSelectedApplication, isMobile)}
            </TabsContent>
            
            <TabsContent value="approved">
              {renderApplicationsTable(approved, setSelectedApplication, isMobile)}
            </TabsContent>
            
            <TabsContent value="rejected">
              {renderApplicationsTable(rejected, setSelectedApplication, isMobile)}
            </TabsContent>
          </Tabs>
          
          {isMobile ? (
            <Drawer open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Application Details</DrawerTitle>
                  <DrawerDescription>
                    {selectedApplication?.job.title} at {selectedApplication?.job.district_name}
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  {selectedApplication && <ApplicationDetails application={selectedApplication} />}
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Application Details</DialogTitle>
                  <DialogDescription>
                    {selectedApplication?.job.title} at {selectedApplication?.job.district_name}
                  </DialogDescription>
                </DialogHeader>
                {selectedApplication && <ApplicationDetails application={selectedApplication} />}
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
};

const renderApplicationsTable = (
  applications: Application[], 
  setSelectedApplication: (app: Application) => void,
  isMobile: boolean
) => {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No applications found in this category</p>
      </div>
    );
  }
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {applications.map(app => (
          <Card key={app.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{app.job.title}</CardTitle>
                  <CardDescription>{app.job.district_name}</CardDescription>
                </div>
                {statusColors[app.status] && renderStatus(app.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                <span>{app.job.district_location}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setSelectedApplication(app)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Position</TableHead>
          <TableHead>District</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Applied On</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map(app => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">{app.job.title}</TableCell>
            <TableCell>{app.job.district_name}</TableCell>
            <TableCell>{app.job.district_location}</TableCell>
            <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
            <TableCell>{renderStatus(app.status)}</TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => setSelectedApplication(app)}
              >
                <span className="sr-only">View details</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Applications;
