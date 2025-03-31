
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash } from 'lucide-react';
import { Job } from '@/services/jobService';

interface JobCardProps {
  job: Job;
  onView: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onView, onDelete }) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'offered':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Approval';
      case 'active':
        return 'Open';
      case 'offered':
        return 'Offered';
      case 'accepted':
        return 'Accepted';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold truncate" title={job.title}>{job.title}</h3>
            <Badge variant="outline" className={getStatusBadgeColor(job.status)}>
              {getStatusLabel(job.status)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2" title={job.description}>
            {job.description}
          </p>
          <div className="mt-3 space-y-1">
            {job.city && job.state && (
              <div className="text-xs text-muted-foreground">
                Location: {job.city}, {job.state}
              </div>
            )}
            {job.work_location && (
              <div className="text-xs text-muted-foreground">
                Work Location: {job.work_location}
              </div>
            )}
            {job.work_type && (
              <div className="text-xs text-muted-foreground">
                Work Type: {job.work_type}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex border-t">
          <Button
            variant="ghost"
            className="flex-1 rounded-none py-2 h-auto"
            onClick={() => onView(job)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          <div className="border-l h-10" />
          <Button
            variant="ghost"
            className="flex-1 rounded-none py-2 h-auto text-destructive hover:text-destructive"
            onClick={() => onDelete(job.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
