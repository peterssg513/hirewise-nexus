
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { DataTable } from '@/components/admin/dashboard/DataTable';
import { RejectionDialog } from '@/components/admin/dashboard/RejectionDialog';
import EmptyState from '@/components/admin/psychologists/EmptyState';

const AdminDistricts = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingDistricts, setPendingDistricts] = useState([]);
  const [approvedDistricts, setApprovedDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [districtToReject, setDistrictToReject] = useState({ id: '', name: '' });

  useEffect(() => {
    fetchDistricts();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('admin-districts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'districts' }, 
        () => fetchDistricts()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchDistricts = async () => {
    try {
      setLoading(true);
      
      // Fetch pending districts
      const { data: pendingData, error: pendingError } = await supabase
        .from('districts')
        .select(`
          id, 
          name, 
          location, 
          description, 
          contact_email, 
          contact_phone,
          state,
          district_size,
          job_title,
          website,
          first_name,
          last_name,
          created_at,
          profiles:user_id(email, name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (pendingError) throw pendingError;
      
      // Fetch approved districts
      const { data: approvedData, error: approvedError } = await supabase
        .from('districts')
        .select(`
          id, 
          name, 
          location, 
          description, 
          contact_email, 
          contact_phone,
          state,
          district_size,
          job_title,
          website,
          first_name,
          last_name,
          created_at,
          profiles:user_id(email, name)
        `)
        .eq('status', 'approved')
        .order('name', { ascending: true });
        
      if (approvedError) throw approvedError;
      
      setPendingDistricts(pendingData || []);
      setApprovedDistricts(approvedData || []);
      
    } catch (error) {
      console.error('Error fetching districts:', error);
      toast({
        title: 'Failed to load districts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const approveDistrict = async (id, name) => {
    try {
      await supabase.rpc('approve_district', { district_id: id });
      
      // Get district user_id for notification
      const { data: districtData } = await supabase
        .from('districts')
        .select('user_id')
        .eq('id', id)
        .single();
        
      // Create notification for the user
      if (districtData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: districtData.user_id,
          message: `Your district "${name}" has been approved!`,
          type: 'district_approved',
          related_id: id
        });
      }
      
      toast({
        title: 'Success',
        description: `District "${name}" approved successfully`
      });
      
      // Log this approval action
      await supabase.from('analytics_events').insert({
        event_type: 'district_approved',
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: name,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error(`Error approving district:`, error);
      toast({
        title: `Failed to approve district`,
        variant: 'destructive'
      });
    }
  };

  const openRejectionDialog = (id, name) => {
    setDistrictToReject({ id, name });
    setRejectionReason('');
    setRejectionDialogOpen(true);
  };

  const handleReject = async () => {
    try {
      // Update district status
      const result = await supabase
        .from('districts')
        .update({ 
          status: 'rejected'
        })
        .eq('id', districtToReject.id);
      
      if (result.error) throw result.error;
      
      // Get district user_id for notification
      const { data: districtData } = await supabase
        .from('districts')
        .select('user_id')
        .eq('id', districtToReject.id)
        .single();
        
      // Create notification for the user
      if (districtData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: districtData.user_id,
          message: `Your district "${districtToReject.name}" was not approved. Reason: ${rejectionReason}`,
          type: 'district_rejected',
          related_id: districtToReject.id
        });
      }
      
      toast({
        title: 'District rejected',
        description: `District "${districtToReject.name}" has been rejected`
      });
      
      // Log this rejection action
      await supabase.from('analytics_events').insert({
        event_type: 'district_rejected',
        user_id: profile?.id,
        event_data: { 
          entity_id: districtToReject.id,
          entity_name: districtToReject.name,
          reason: rejectionReason,
          timestamp: new Date().toISOString()
        }
      });
      
      // Refresh the list
      fetchDistricts();
      
    } catch (error) {
      console.error(`Error rejecting district:`, error);
      toast({
        title: `Failed to reject district`,
        variant: 'destructive'
      });
    } finally {
      setRejectionDialogOpen(false);
    }
  };
  
  const pendingColumns = [
    {
      key: 'name',
      header: 'District Name',
      cell: (district) => (
        <div className="font-medium">{district.name || 'Unnamed District'}</div>
      )
    },
    {
      key: 'contact_email',
      header: 'Contact Email',
      cell: (district) => (
        <div>{district.contact_email || district.profiles?.email || 'No email'}</div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      cell: (district) => (
        <div>{district.state ? `${district.location}, ${district.state}` : (district.location || 'Not specified')}</div>
      )
    },
    {
      key: 'district_size',
      header: 'Size',
      cell: (district) => (
        <div>{district.district_size ? `${district.district_size} students` : 'Not specified'}</div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (district) => (
        <Badge className="bg-yellow-500">Pending</Badge>
      )
    }
  ];
  
  const approvedColumns = [
    {
      key: 'name',
      header: 'District Name',
      cell: (district) => (
        <div className="font-medium">{district.name || 'Unnamed District'}</div>
      )
    },
    {
      key: 'contact_email',
      header: 'Contact Email',
      cell: (district) => (
        <div>{district.contact_email || district.profiles?.email || 'No email'}</div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      cell: (district) => (
        <div>{district.state ? `${district.location}, ${district.state}` : (district.location || 'Not specified')}</div>
      )
    },
    {
      key: 'district_size',
      header: 'Size',
      cell: (district) => (
        <div>{district.district_size ? `${district.district_size} students` : 'Not specified'}</div>
      )
    },
    {
      key: 'website',
      header: 'Website',
      cell: (district) => (
        <div>
          {district.website ? (
            <a href={district.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {district.website}
            </a>
          ) : 'Not provided'}
        </div>
      )
    }
  ];
  
  const pendingDistrictActions = (district) => (
    <div className="flex gap-2 justify-end">
      <Button 
        variant="outline" 
        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-2"
        onClick={() => openRejectionDialog(district.id, district.name || 'Unnamed District')}
      >
        <X className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 h-8 px-2"
        onClick={() => approveDistrict(district.id, district.name || 'Unnamed District')}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        className="h-8 px-2"
        onClick={() => {
          // TODO: Implement view details functionality
          toast({
            title: 'View Details',
            description: `Viewing details for ${district.name}`
          });
        }}
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>
  );
  
  const approvedDistrictActions = (district) => (
    <div className="flex justify-end">
      <Button 
        variant="outline" 
        className="h-8 px-2"
        onClick={() => {
          // TODO: Implement view details functionality
          toast({
            title: 'View Details',
            description: `Viewing details for ${district.name}`
          });
        }}
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>
  );
  
  const emptyPendingState = (
    <Card>
      <CardContent className="pt-6 pb-6 flex items-center justify-center">
        <EmptyState message="No pending districts found" />
      </CardContent>
    </Card>
  );
  
  const emptyApprovedState = (
    <Card>
      <CardContent className="pt-6 pb-6 flex items-center justify-center">
        <EmptyState message="No approved districts found" />
      </CardContent>
    </Card>
  );

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
          <DataTable 
            columns={pendingColumns} 
            data={pendingDistricts}
            loading={loading}
            emptyState={emptyPendingState}
            actions={pendingDistrictActions}
            searchPlaceholder="Search pending districts..."
          />
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          <DataTable 
            columns={approvedColumns} 
            data={approvedDistricts}
            loading={loading}
            emptyState={emptyApprovedState}
            actions={approvedDistrictActions}
            searchPlaceholder="Search approved districts..."
          />
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
