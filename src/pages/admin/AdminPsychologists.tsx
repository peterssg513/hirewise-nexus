
import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { usePendingPsychologists } from '@/hooks/usePendingPsychologists';
import { useApprovedPsychologists } from '@/hooks/useApprovedPsychologists';
import PsychologistCard from '@/components/admin/psychologists/PsychologistCard';
import RejectionDialog from '@/components/admin/psychologists/RejectionDialog';
import EmptyState from '@/components/admin/psychologists/EmptyState';
import LoadingState from '@/components/admin/psychologists/LoadingState';
import ApprovedPsychologistCard from '@/components/admin/psychologists/ApprovedPsychologistCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPsychologists = () => {
  const [activeTab, setActiveTab] = useState('pending');
  
  const { 
    pendingPsychologists, 
    loading: pendingLoading, 
    approvePsychologist, 
    rejectPsychologist 
  } = usePendingPsychologists();
  
  const {
    approvedPsychologists,
    loading: approvedLoading
  } = useApprovedPsychologists();
  
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
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Psychologists</h1>
          <p className="text-muted-foreground">Manage psychologist applications and approved psychologists</p>
        </div>
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          {pendingLoading ? (
            <LoadingState />
          ) : pendingPsychologists.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {pendingPsychologists.map(psych => (
                <PsychologistCard 
                  key={psych.id}
                  psych={psych}
                  onApprove={approvePsychologist}
                  onReject={openRejectionDialog}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          {approvedLoading ? (
            <LoadingState />
          ) : approvedPsychologists.length === 0 ? (
            <EmptyState message="No approved psychologists found" />
          ) : (
            <div className="space-y-4">
              {approvedPsychologists.map(psych => (
                <ApprovedPsychologistCard 
                  key={psych.id}
                  psych={psych}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
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
