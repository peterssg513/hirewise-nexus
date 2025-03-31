
import React from 'react';
import { User, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const AdminDistricts = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">District Approvals</h1>
          <p className="text-muted-foreground">Manage district applications</p>
        </div>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved" onClick={() => navigate('/admin-dashboard/approved-districts')}>Approved</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed">
        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
          <Users className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No pending districts</h3>
        <p className="mt-2 text-sm text-gray-500 text-center">
          There are no districts waiting for approval at this time.
        </p>
      </div>
    </div>
  );
};

export default AdminDistricts;
