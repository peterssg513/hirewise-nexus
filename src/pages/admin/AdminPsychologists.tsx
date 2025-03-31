
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { usePendingPsychologists } from '@/hooks/usePendingPsychologists';
import PsychologistCard from '@/components/admin/psychologists/PsychologistCard';
import RejectionDialog from '@/components/admin/psychologists/RejectionDialog';
import EmptyState from '@/components/admin/psychologists/EmptyState';
import LoadingState from '@/components/admin/psychologists/LoadingState';

const AdminPsychologists = () => {
  const { 
    pendingPsychologists, 
    loading, 
    approvePsychologist, 
    rejectPsychologist 
  } = usePendingPsychologists();
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [psychologistToReject, setPsychologistToReject] = useState({ id: '', name: '' });

  const openRejectionDialog = (id, name) => {
    setPsychologistToReject({ id, name });
    setRejectionReason('');
    setRejectionDialogOpen(true);
  };

  const handleReject = async () => {
    await rejectPsychologist(
      psychologistToReject.id, 
      psychologistToReject.name, 
      rejectionReason
    );
    setRejectionDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Psychologist Approvals</h1>
          <p className="text-muted-foreground">Manage psychologist applications</p>
        </div>
      </div>
      
      {loading ? (
        <LoadingState />
      ) : pendingPsychologists.length === 0 ? (
        <EmptyState />
      ) : (
        pendingPsychologists.map(psych => (
          <PsychologistCard 
            key={psych.id}
            psych={psych}
            onApprove={approvePsychologist}
            onReject={openRejectionDialog}
          />
        ))
      )}
      
      {/* Rejection Dialog */}
      <RejectionDialog 
        isOpen={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        psychologistName={psychologistToReject.name}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default AdminPsychologists;
