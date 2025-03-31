
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

interface RejectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  psychologistName: string;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
}

const RejectionDialog: React.FC<RejectionDialogProps> = ({
  isOpen,
  onOpenChange,
  psychologistName,
  rejectionReason,
  onReasonChange,
  onConfirm
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Psychologist</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for rejecting "{psychologistName}". This will be shared with the user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Textarea 
            placeholder="Enter rejection reason..." 
            value={rejectionReason} 
            onChange={(e) => onReasonChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={!rejectionReason.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            Reject
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectionDialog;
