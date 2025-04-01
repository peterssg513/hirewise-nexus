
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { EvaluationRequest } from '@/services/evaluationRequestService';
import { CreateEvaluationForm } from './CreateEvaluationForm';

interface CreateEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  districtId: string;
  onEvaluationCreated: (evaluation: EvaluationRequest) => void;
}

export const CreateEvaluationDialog: React.FC<CreateEvaluationDialogProps> = ({ 
  open, 
  onOpenChange, 
  districtId, 
  onEvaluationCreated 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-psyched-darkBlue">Create New Evaluation Request</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new evaluation request for a student.
          </DialogDescription>
        </DialogHeader>
        
        <CreateEvaluationForm 
          districtId={districtId} 
          onEvaluationCreated={onEvaluationCreated} 
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};
