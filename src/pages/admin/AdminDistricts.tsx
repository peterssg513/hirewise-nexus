
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApprovedDistricts } from '@/hooks/useApprovedDistricts';
import { usePendingDistricts } from '@/hooks/usePendingDistricts';
import ApprovedDistrictCard from '@/components/admin/districts/ApprovedDistrictCard';
import EmptyState from '@/components/admin/psychologists/EmptyState';
import LoadingState from '@/components/admin/psychologists/LoadingState';
import { RejectionDialog } from '@/components/admin/dashboard/RejectionDialog';

const AdminDistricts = () => {
  const [activeTab, setActiveTab] = useState('pending');
  
  const { 
    approvedDistricts, 
    loading: approvedLoading 
  } = useApprovedDistricts();
  
  const {
    pendingDistricts,
    loading: pendingLoading,
    approveDistrict,
    rejectDistrict
  } = usePendingDistricts();
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [districtToReject, setDistrictToReject] = useState({ id: '', name: '' });

  const openRejectionDialog = (id, name) => {
    setDistrictToReject({ id, name });
    setRejectionReason('');
    setRejectionDialogOpen(true);
  };

  const handleReject = async () => {
    await rejectDistrict(
      districtToReject.id, 
      districtToReject.name, 
      rejectionReason
    );
    setRejectionDialogOpen(false);
  };
  
  console.log('Pending districts:', pendingDistricts);
  console.log('Approved districts:', approvedDistricts);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Districts</h1>
          <p className="text-muted-foreground">Manage district applications and approved districts</p>
        </div>
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          {pendingLoading ? (
            <LoadingState />
          ) : pendingDistricts?.length === 0 ? (
            <EmptyState message="No pending districts found" />
          ) : (
            <div className="space-y-4">
              {pendingDistricts?.map(district => (
                <div key={district.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{district.name || 'Unnamed District'}</h3>
                      <p className="text-sm text-muted-foreground">{district.profile?.email || district.contact_email || 'No email'}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Status: <span className="text-amber-600 font-medium">Pending</span>
                      </p>
                      
                      {/* Display more district details */}
                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <span className="font-medium">Location:</span> {district.location || 'Not specified'}
                        </div>
                        <div>
                          <span className="font-medium">Contact:</span> {district.contact_phone || 'No phone provided'}
                        </div>
                        <div>
                          <span className="font-medium">State:</span> {district.state || 'Not specified'}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span> {district.district_size ? `${district.district_size} students` : 'Not specified'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => approveDistrict(district.id, district.name || 'Unnamed District')}
                        className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => openRejectionDialog(district.id, district.name || 'Unnamed District')}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          {approvedLoading ? (
            <LoadingState />
          ) : approvedDistricts.length === 0 ? (
            <EmptyState message="No approved districts found" />
          ) : (
            <div className="space-y-4">
              {approvedDistricts.map(district => (
                <ApprovedDistrictCard 
                  key={district.id}
                  district={district}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Rejection Dialog */}
      <RejectionDialog 
        open={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        entityType="district"
        entityName={districtToReject.name}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default AdminDistricts;
