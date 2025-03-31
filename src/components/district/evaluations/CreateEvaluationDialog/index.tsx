
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Evaluation Request</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new evaluation request.
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
