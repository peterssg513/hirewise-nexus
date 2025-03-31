
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { approveApplication, rejectApplication } from '@/services/applicationService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Clock, FileText, Calendar, Award } from 'lucide-react';

interface ApplicationsListProps {
  applications: any[];
  isLoading: boolean;
  onApplicationStatusChanged: () => void;
}

export const ApplicationsList: React.FC<ApplicationsListProps> = ({
  applications,
  isLoading,
  onApplicationStatusChanged,
}) => {
  const { toast } = useToast();

  const handleApprove = async (applicationId: string) => {
    try {
      await approveApplication(applicationId);
      onApplicationStatusChanged();
      toast({
        title: 'Application approved',
        description: 'The applicant has been approved for this position.',
      });
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve application. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await rejectApplication(applicationId);
      onApplicationStatusChanged();
      toast({
        title: 'Application rejected',
        description: 'The application has been rejected.',
      });
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject application. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Rejected
          </Badge>
        );
      case 'submitted':
      default:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No applications yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Waiting for psychologists to apply for this position.
        </p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
      : '?';
  };

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <Card key={app.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-psyched-darkBlue text-white">
                    {getInitials(app.psychologists.profiles.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{app.psychologists.profiles.name}</CardTitle>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {app.psychologists.experience_years && (
                      <Badge variant="secondary" className="text-xs">
                        {app.psychologists.experience_years} years experience
                      </Badge>
                    )}
                    {app.psychologists.certifications?.[0] && (
                      <Badge variant="secondary" className="text-xs">
                        {app.psychologists.certifications[0]}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {getStatusBadge(app.status)}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            {app.notes && (
              <div className="mb-3 bg-gray-50 p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Applicant Note:</p>
                <p>{app.notes}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              {app.psychologists.specialties && app.psychologists.specialties.length > 0 && (
                <div>
                  <p className="font-medium mb-1 flex items-center">
                    <Award className="h-3.5 w-3.5 mr-1" /> Specialties:
                  </p>
                  <ul className="list-disc pl-5">
                    {app.psychologists.specialties.slice(0, 3).map((spec: string, i: number) => (
                      <li key={i}>{spec}</li>
                    ))}
                    {app.psychologists.specialties.length > 3 && (
                      <li>+{app.psychologists.specialties.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}
              
              {app.psychologists.evaluation_types && app.psychologists.evaluation_types.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Evaluation Types:</p>
                  <ul className="list-disc pl-5">
                    {app.psychologists.evaluation_types.slice(0, 3).map((type: string, i: number) => (
                      <li key={i}>{type}</li>
                    ))}
                    {app.psychologists.evaluation_types.length > 3 && (
                      <li>+{app.psychologists.evaluation_types.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5 inline mr-1" /> 
              Applied on {new Date(app.created_at).toLocaleDateString()}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            {app.status === 'submitted' && (
              <div className="flex justify-end space-x-2 w-full">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reject Application</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reject this application? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleReject(app.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Reject
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve Application</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to approve this applicant? They will be assigned to this position.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleApprove(app.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
