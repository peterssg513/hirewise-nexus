
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

interface RejectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: string;
  entityName: string;
  rejectionReason: string;
  onReasonChange: (value: string) => void;
  onConfirm: () => void;
}

export const RejectionDialog: React.FC<RejectionDialogProps> = ({
  open,
  onOpenChange,
  entityType,
  entityName,
  rejectionReason,
  onReasonChange,
  onConfirm
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject {entityType}</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for rejecting "{entityName}". This will be shared with the user.
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
