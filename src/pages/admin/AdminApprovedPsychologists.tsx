
import React from 'react';
import { useApprovedPsychologists } from '@/hooks/useApprovedPsychologists';
import ApprovedPsychologistCard from '@/components/admin/psychologists/ApprovedPsychologistCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import EmptyState from '@/components/admin/psychologists/EmptyState';
import LoadingState from '@/components/admin/psychologists/LoadingState';

const AdminApprovedPsychologists = () => {
  const { 
    approvedPsychologists, 
    loading
  } = useApprovedPsychologists();
  
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Approved Psychologists</h1>
          <p className="text-muted-foreground">View all approved psychologists</p>
        </div>
      </div>
      
      <Tabs defaultValue="approved">
        <TabsList>
          <TabsTrigger value="pending" onClick={() => navigate('/admin-dashboard/psychologists')}>Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <LoadingState />
      ) : approvedPsychologists.length === 0 ? (
        <EmptyState message="No approved psychologists found" />
      ) : (
        approvedPsychologists.map(psych => (
          <ApprovedPsychologistCard 
            key={psych.id}
            psych={psych}
          />
        ))
      )}
    </div>
  );
};

export default AdminApprovedPsychologists;
