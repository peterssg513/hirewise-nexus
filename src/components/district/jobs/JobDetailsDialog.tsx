
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/services/jobService';

interface JobDetailsDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({ 
  job, 
  open, 
  onOpenChange 
}) => {
  if (!job) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
          <div className="mt-1">
            <Badge variant="outline" className={getStatusBadgeColor(job.status)}>
              {getStatusLabel(job.status)}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm">{job.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {job.city && job.state && (
              <div>
                <h4 className="text-sm font-medium mb-1">Location</h4>
                <p className="text-sm">{job.city}, {job.state}</p>
              </div>
            )}
            
            {job.work_location && (
              <div>
                <h4 className="text-sm font-medium mb-1">Work Location</h4>
                <p className="text-sm">{job.work_location}</p>
              </div>
            )}
            
            {job.work_type && (
              <div>
                <h4 className="text-sm font-medium mb-1">Work Type</h4>
                <p className="text-sm">{job.work_type}</p>
              </div>
            )}
            
            {job.salary && (
              <div>
                <h4 className="text-sm font-medium mb-1">Salary</h4>
                <p className="text-sm">${job.salary.toLocaleString()}</p>
              </div>
            )}
          </div>
          
          {job.qualifications && job.qualifications.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Qualifications</h4>
              <ul className="list-disc list-inside text-sm">
                {job.qualifications.map((qualification, index) => (
                  <li key={index}>{qualification}</li>
                ))}
              </ul>
            </div>
          )}
          
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Benefits</h4>
              <ul className="list-disc list-inside text-sm">
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
