
import React from 'react';
import { CreateJobForm } from './CreateJobForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Job } from '@/services/jobService';

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
  onJobCreated
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new job posting.
          </DialogDescription>
        </DialogHeader>
        
        <CreateJobForm 
          districtId={districtId} 
          onJobCreated={onJobCreated} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};
