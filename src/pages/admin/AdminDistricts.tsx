import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { TabsContent } from '@/components/ui/tabs';
import { TabsWithSearch } from '@/components/admin/TabsWithSearch';

interface DistrictWithProfile {
  id: string;
  name: string;
  contact_email: string;
  status: string;
  location?: string;
  contact_phone?: string;
  state?: string;
  district_size?: number;
  website?: string;
  job_title?: string;
  description?: string;
  user_id: string;
  profile_name?: string;
  profile_email?: string;
}

const AdminDistricts = () => {
  const { profile } = useAuth();
  const [pendingDistricts, setPendingDistricts] = useState<DistrictWithProfile[]>([]);
  const [approvedDistricts, setApprovedDistricts] = useState<DistrictWithProfile[]>([]);
  const [rejectedDistricts, setRejectedDistricts] = useState<DistrictWithProfile[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<DistrictWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [filterBy, setFilterBy] = useState('');
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [districtToReject, setDistrictToReject] = useState({ id: '', name: '' });
  
  useEffect(() => {
    fetchDistricts();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('admin-districts-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'districts'
        }, 
        (payload) => {
          console.log('Districts table changed:', payload);
          fetchDistricts();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    // Set filtered districts based on active tab
    switch (activeTab) {
      case 'pending':
        setFilteredDistricts(pendingDistricts);
        break;
      case 'approved':
        setFilteredDistricts(approvedDistricts);
        break;
      case 'rejected':
        setFilteredDistricts(rejectedDistricts);
        break;
      default:
        setFilteredDistricts(pendingDistricts);
    }
  }, [activeTab, pendingDistricts, approvedDistricts, rejectedDistricts]);
  
  const fetchDistricts = async () => {
    try {
      setLoading(true);
      console.log('Fetching districts...');
      
      // Fetch all districts
      const { data: districtsData, error } = await supabase
        .from('districts')
        .select('*');
        
      if (error) {
        console.error('Error fetching districts:', error);
        throw error;
      }
      
      // If there are districts, fetch the associated user profiles
      const districtsWithProfiles: DistrictWithProfile[] = [];
      
      if (districtsData && districtsData.length > 0) {
        for (const district of districtsData) {
          try {
            // Fetch profile data for the district's user_id
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('id', district.user_id)
              .single();
              
            districtsWithProfiles.push({
              ...district,
              profile_name: profileData?.name || null,
              profile_email: profileData?.email || district.contact_email
            });
          } catch (profileError) {
            console.error(`Error fetching profile for user_id ${district.user_id}:`, profileError);
            districtsWithProfiles.push({
              ...district,
              profile_name: null,
              profile_email: district.contact_email
            });
          }
        }
      }
      
      // Split districts by status
      const pending = districtsWithProfiles.filter(d => d.status === 'pending');
      const approved = districtsWithProfiles.filter(d => d.status === 'approved');
      const rejected = districtsWithProfiles.filter(d => d.status === 'rejected');
      
      setPendingDistricts(pending);
      setApprovedDistricts(approved);
      setRejectedDistricts(rejected);
      setFilteredDistricts(pending);
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
  
  const approveDistrict = async (id: string, name: string) => {
    try {
      const result = await supabase.rpc('approve_district', { district_id: id });
      
      if (result.error) throw result.error;
      
      // Get district user_id for notification
      const { data: districtData } = await supabase
        .from('districts')
        .select('user_id, name')
        .eq('id', id)
        .single();
        
      // Create notification for the user
      if (districtData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: districtData.user_id,
          message: `Your district "${districtData.name}" has been approved! You can now create jobs and evaluations.`,
          type: 'district_approved',
          related_id: id
        });
      }
      
      toast({
        title: 'Success',
        description: `District approved successfully`
      });
      
      // Update local state to reflect the approval
      setPendingDistricts(pendingDistricts.filter(d => d.id !== id));
      
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

  const openRejectionDialog = (id: string, name: string) => {
    setDistrictToReject({ id, name });
    setRejectionReason('');
    setRejectionDialogOpen(true);
  };

  const handleReject = async () => {
    try {
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
        .select('user_id, name')
        .eq('id', districtToReject.id)
        .single();
        
      // Create notification for the user
      if (districtData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: districtData.user_id,
          message: `Your district "${districtData.name}" registration was not approved. Reason: ${rejectionReason}`,
          type: 'district_rejected',
          related_id: districtToReject.id
        });
      }
      
      toast({
        title: 'Rejected',
        description: `District has been rejected`
      });
      
      // Update local state to reflect the rejection
      setPendingDistricts(pendingDistricts.filter(d => d.id !== districtToReject.id));
      
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
  
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // Reset to the current tab's full data
      switch (activeTab) {
        case 'pending':
          setFilteredDistricts(pendingDistricts);
          break;
        case 'approved':
          setFilteredDistricts(approvedDistricts);
          break;
        case 'rejected':
          setFilteredDistricts(rejectedDistricts);
          break;
      }
      return;
    }
    
    // Get the current tab's data
    let dataToFilter;
    switch (activeTab) {
      case 'pending':
        dataToFilter = pendingDistricts;
        break;
      case 'approved':
        dataToFilter = approvedDistricts;
        break;
      case 'rejected':
        dataToFilter = rejectedDistricts;
        break;
      default:
        dataToFilter = pendingDistricts;
    }
    
    // Filter based on search term
    const search = searchTerm.toLowerCase();
    const filtered = dataToFilter.filter(district => 
      district.name?.toLowerCase().includes(search) ||
      district.profile_name?.toLowerCase().includes(search) ||
      district.profile_email?.toLowerCase().includes(search) ||
      district.location?.toLowerCase().includes(search) ||
      district.state?.toLowerCase().includes(search) ||
      district.job_title?.toLowerCase().includes(search)
    );
    
    setFilteredDistricts(filtered);
  };
  
  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    
    // Get the current tab's data
    let dataToFilter;
    switch (activeTab) {
      case 'pending':
        dataToFilter = pendingDistricts;
        break;
      case 'approved':
        dataToFilter = approvedDistricts;
        break;
      case 'rejected':
        dataToFilter = rejectedDistricts;
        break;
      default:
        dataToFilter = pendingDistricts;
    }
    
    // Apply filter based on selected value
    if (value === 'all' || !value) {
      setFilteredDistricts(dataToFilter);
    } else if (value === 'state') {
      // Group by state
      const filtered = dataToFilter.filter(d => d.state);
      setFilteredDistricts(filtered);
    } else if (value === 'size') {
      // Has district size defined
      const filtered = dataToFilter.filter(d => d.district_size && d.district_size > 0);
      setFilteredDistricts(filtered);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">District Approvals</h1>
          <p className="text-muted-foreground">Manage district applications</p>
        </div>
      </div>
      
      <TabsWithSearch
        tabs={[
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' }
        ]}
        filterOptions={[
          { value: 'all', label: 'All' },
          { value: 'state', label: 'By State' },
          { value: 'size', label: 'By Size' }
        ]}
        onSearch={handleSearch}
        onTabChange={setActiveTab}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search districts..."
        filterPlaceholder="Filter by"
      >
        <TabsContent value="pending" className="space-y-4">
          {renderDistrictsList(pendingDistricts, filteredDistricts, loading, activeTab)}
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          {renderDistrictsList(approvedDistricts, filteredDistricts, loading, activeTab)}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {renderDistrictsList(rejectedDistricts, filteredDistricts, loading, activeTab)}
        </TabsContent>
      </TabsWithSearch>
      
      {/* Rejection Dialog */}
      <AlertDialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject District</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting "{districtToReject.name}". This will be shared with the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Enter rejection reason..." 
              value={rejectionReason} 
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
  
  function renderDistrictsList(sourceData, filteredData, isLoading, tab) {
    if (isLoading) {
      return (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
        </div>
      );
    }
    
    if (sourceData.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-muted-foreground p-8">
              <ShieldCheck className="mr-2 h-5 w-5" />
              <span>No {tab} district approvals</span>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    if (filteredData.length === 0 && tab === activeTab) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-muted-foreground p-8">
              <ShieldCheck className="mr-2 h-5 w-5" />
              <span>No matching districts found</span>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <>
        {filteredData.map(district => (
          <Card key={district.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{district.name}</CardTitle>
                {getStatusBadge(district.status)}
              </div>
              <CardDescription>{district.profile_email || district.contact_email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{district.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">{district.contact_phone || 'No phone provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">State</p>
                  <p className="text-sm text-muted-foreground">{district.state || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Size</p>
                  <p className="text-sm text-muted-foreground">{district.district_size ? `${district.district_size} students` : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <p className="text-sm text-muted-foreground">{district.website ? <a href={district.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{district.website}</a> : 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Job Title</p>
                  <p className="text-sm text-muted-foreground">{district.job_title || 'Not specified'}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{district.description || 'No description provided'}</p>
              </div>
              
              {district.status === 'pending' && (
                <div className="mt-6 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => openRejectionDialog(district.id, district.name)}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => approveDistrict(district.id, district.name)}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Approve District
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </>
    );
  }
};

export default AdminDistricts;
