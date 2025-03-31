
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Briefcase } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  city?: string;
  state?: string;
  location?: string;
  job_type?: string;
  timeframe?: string;
  salary?: number;
  skills_required?: string[];
  qualifications?: string[];
  benefits?: string[];
  districts?: {
    name: string;
  };
}

interface JobsTabProps {
  loading: boolean;
  pendingJobs: Job[];
  onApprove: (type: string, id: string, name: string) => void;
  onReject: (type: string, id: string, name: string) => void;
}

export const JobsTab: React.FC<JobsTabProps> = ({
  loading,
  pendingJobs,
  onApprove,
  onReject
}) => {
  if (loading) {
    return <p>Loading pending jobs...</p>;
  }

  if (pendingJobs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-muted-foreground">
            <Briefcase className="mr-2 h-5 w-5" />
            <span>No pending job approvals</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {pendingJobs.map(job => (
        <Card key={job.id} className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{job.title}</CardTitle>
              <Badge className="bg-yellow-500">Pending</Badge>
            </div>
            <CardDescription>Posted by {job.districts?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {job.city && job.state 
                    ? `${job.city}, ${job.state}` 
                    : job.location || 'Remote/Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Job Type</p>
                <p className="text-sm text-muted-foreground">{job.job_type || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Timeframe</p>
                <p className="text-sm text-muted-foreground">{job.timeframe || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Salary</p>
                <p className="text-sm text-muted-foreground">
                  {job.salary 
                    ? `$${job.salary.toLocaleString()}` 
                    : 'Not specified'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium">Skills Required</p>
              <p className="text-sm text-muted-foreground">
                {job.skills_required?.length ? job.skills_required.join(', ') : 'None specified'}
              </p>
            </div>
            {job.qualifications?.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Qualifications</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {job.qualifications.map((qual, idx) => (
                    <li key={idx}>{qual}</li>
                  ))}
                </ul>
              </div>
            )}
            {job.benefits?.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Benefits</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onReject('job', job.id, job.title)}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => onApprove('job', job.id, job.title)}>
                <Check className="mr-1 h-4 w-4" />
                Approve Job
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
