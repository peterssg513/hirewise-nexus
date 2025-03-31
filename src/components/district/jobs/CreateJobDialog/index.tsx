
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Job } from '@/services/jobService';
import { STATES } from '@/services/stateSalaryService';
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
  onJobCreated 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>
            Fill in the details for the new job posting.
          </DialogDescription>
        </DialogHeader>
        
        <CreateJobForm 
          districtId={districtId} 
          onJobCreated={onJobCreated}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};
