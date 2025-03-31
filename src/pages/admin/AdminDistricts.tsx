
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

const AdminDistricts = () => {
  const { profile } = useAuth();
  const [pendingDistricts, setPendingDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [districtToReject, setDistrictToReject] = useState({ id: '', name: '' });
  
  useEffect(() => {
    const fetchPendingDistricts = async () => {
      try {
        setLoading(true);
        console.log('Fetching pending districts...');
        
        const { data: pendingDistrictsData, error } = await supabase
          .from('districts')
          .select('*, profiles(name, email)')
          .eq('status', 'pending');
          
        if (error) {
          console.error('Error fetching pending districts:', error);
          throw error;
        }
        
        console.log('Pending districts data:', pendingDistrictsData);
        setPendingDistricts(pendingDistrictsData || []);
      } catch (error) {
        console.error('Error fetching pending districts:', error);
        toast({
          title: 'Failed to load districts',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingDistricts();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('admin-districts-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'districts',
          filter: 'status=eq.pending'
        }, 
        (payload) => {
          console.log('Districts table changed:', payload);
          fetchPendingDistricts();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const approveDistrict = async (id, name) => {
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

  const openRejectionDialog = (id, name) => {
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">District Approvals</h1>
          <p className="text-muted-foreground">Manage district applications</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
        </div>
      ) : pendingDistricts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-muted-foreground p-8">
              <ShieldCheck className="mr-2 h-5 w-5" />
              <span>No pending district approvals</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        pendingDistricts.map(district => (
          <Card key={district.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{district.name}</CardTitle>
                <Badge className="bg-yellow-500">Pending</Badge>
              </div>
              <CardDescription>{district.profiles?.email}</CardDescription>
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
            </CardContent>
          </Card>
        ))
      )}
      
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
};

export default AdminDistricts;
