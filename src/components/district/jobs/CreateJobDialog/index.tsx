
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Job } from '@/services/jobService';
import { CreateJobForm } from './CreateJobForm';

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  districtId: string;
  onJobCreated: (job: Job) => void;
}

export const CreateJobDialog: React.FC<CreateJobDialogProps> = ({
  open,
  onOpenChange,
  districtId,
  onJobCreated,
}) => {
  const handleJobCreated = (job: Job) => {
    onJobCreated(job);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new job posting.
          </DialogDescription>
        </DialogHeader>
        
        <CreateJobForm
          districtId={districtId}
          onJobCreated={handleJobCreated}
        />
      </DialogContent>
    </Dialog>
  );
};
