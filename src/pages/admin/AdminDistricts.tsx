
import React, { useState } from 'react';
import { User, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApprovedDistricts } from '@/hooks/useApprovedDistricts';
import { usePendingDistricts } from '@/hooks/usePendingDistricts';
import ApprovedDistrictCard from '@/components/admin/districts/ApprovedDistrictCard';
import EmptyState from '@/components/admin/psychologists/EmptyState';
import LoadingState from '@/components/admin/psychologists/LoadingState';

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
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Districts</h1>
          <p className="text-muted-foreground">Manage district applications and approved districts</p>
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
          ) : pendingDistricts?.length === 0 ? (
            <EmptyState message="No pending districts found" />
          ) : (
            <div className="space-y-4">
              {pendingDistricts?.map(district => (
                <div key={district.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{district.name || 'Unnamed District'}</h3>
                      <p className="text-sm text-muted-foreground">{district.profile?.email || 'No email'}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Status: <span className="text-amber-600 font-medium">Pending</span>
                      </p>
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
      
      {/* Rejection Dialog - we'll reuse the dialog from psychologists with slight modifications */}
      {rejectionDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Reject District: {districtToReject.name}</h3>
            <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              className="w-full border rounded-md p-2 mb-4 h-24"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Rejection reason..."
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setRejectionDialogOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDistricts;
