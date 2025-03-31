
import React from 'react';
import { useApprovedDistricts } from '@/hooks/useApprovedDistricts';
import ApprovedDistrictCard from '@/components/admin/districts/ApprovedDistrictCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import EmptyState from '@/components/admin/psychologists/EmptyState';
import LoadingState from '@/components/admin/psychologists/LoadingState';

const AdminApprovedDistricts = () => {
  const { 
    approvedDistricts, 
    loading
  } = useApprovedDistricts();
  
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Approved Districts</h1>
          <p className="text-muted-foreground">View all approved school districts</p>
        </div>
      </div>
      
      <Tabs defaultValue="approved">
        <TabsList>
          <TabsTrigger value="pending" onClick={() => navigate('/admin-dashboard/districts')}>Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <LoadingState />
      ) : approvedDistricts.length === 0 ? (
        <EmptyState message="No approved districts found" />
      ) : (
        approvedDistricts.map(district => (
          <ApprovedDistrictCard 
            key={district.id}
            district={district}
          />
        ))
      )}
    </div>
  );
};

export default AdminApprovedDistricts;
