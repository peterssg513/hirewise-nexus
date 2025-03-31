import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { TabsContent } from '@/components/ui/tabs';
import { TabsWithSearch } from '@/components/admin/TabsWithSearch';

const AdminEvaluations = () => {
  const { profile } = useAuth();
  const [pendingEvaluations, setPendingEvaluations] = useState([]);
  const [activeEvaluations, setActiveEvaluations] = useState([]);
  const [rejectedEvaluations, setRejectedEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [filterBy, setFilterBy] = useState('');
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [evaluationToReject, setEvaluationToReject] = useState({ id: '', name: '' });
  
  useEffect(() => {
    fetchEvaluations();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('admin-evaluations-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'evaluation_requests',
        }, 
        () => {
          fetchEvaluations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    // Set filtered evaluations based on active tab
    switch (activeTab) {
      case 'pending':
        setFilteredEvaluations(pendingEvaluations);
        break;
      case 'active':
        setFilteredEvaluations(activeEvaluations);
        break;
      case 'rejected':
        setFilteredEvaluations(rejectedEvaluations);
        break;
      default:
        setFilteredEvaluations(pendingEvaluations);
    }
  }, [activeTab, pendingEvaluations, activeEvaluations, rejectedEvaluations]);
  
  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      
      const { data: evaluationsData, error } = await supabase
        .from('evaluation_requests')
        .select(`
          id, 
          legal_name,
          service_type, 
          created_at,
          status,
          districts:district_id(name),
          schools:school_id(name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Split evaluations by status
      const pending = evaluationsData.filter(eval => eval.status === 'pending');
      const active = evaluationsData.filter(eval => eval.status === 'active');
      const rejected = evaluationsData.filter(eval => eval.status === 'rejected');
      
      setPendingEvaluations(pending || []);
      setActiveEvaluations(active || []);
      setRejectedEvaluations(rejected || []);
      setFilteredEvaluations(pending || []);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      toast({
        title: 'Failed to load evaluations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const approveEvaluation = async (id, name) => {
    try {
      // Update the evaluation status from pending to active
      const result = await supabase
        .from('evaluation_requests')
        .update({ status: 'active' })
        .eq('id', id);
      
      if (result.error) throw result.error;
      
      // Get evaluation district user_id for notification
      const { data: evalData } = await supabase
        .from('evaluation_requests')
        .select('legal_name, district_id, districts!inner(user_id, name)')
        .eq('id', id)
        .single();
        
      // Create notification for the user
      if (evalData?.districts?.user_id) {
        await supabase.from('notifications').insert({
          user_id: evalData.districts.user_id,
          message: `Evaluation request for "${evalData?.legal_name}" has been approved!`,
          type: 'evaluation_approved',
          related_id: id
        });
      }
      
      toast({
        title: 'Success',
        description: `Evaluation approved successfully`
      });
      
      // Update local state to reflect the approval
      setPendingEvaluations(pendingEvaluations.filter(e => e.id !== id));
      
      // Log this approval action
      await supabase.from('analytics_events').insert({
        event_type: 'evaluation_approved',
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: name,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error(`Error approving evaluation:`, error);
      toast({
        title: `Failed to approve evaluation`,
        variant: 'destructive'
      });
    }
  };

  const openRejectionDialog = (id, name) => {
    setEvaluationToReject({ id, name });
    setRejectionReason('');
    setRejectionDialogOpen(true);
  };

  const handleReject = async () => {
    try {
      const result = await supabase
        .from('evaluation_requests')
        .update({ 
          status: 'rejected'
        })
        .eq('id', evaluationToReject.id);
      
      if (result.error) throw result.error;
      
      // Get evaluation district user_id for notification
      const { data: evalData } = await supabase
        .from('evaluation_requests')
        .select('legal_name, district_id, districts!inner(user_id)')
        .eq('id', evaluationToReject.id)
        .single();
        
      // Create notification for the user
      if (evalData?.districts?.user_id) {
        await supabase.from('notifications').insert({
          user_id: evalData.districts.user_id,
          message: `Evaluation request for "${evalData?.legal_name}" was not approved. Reason: ${rejectionReason}`,
          type: 'evaluation_rejected',
          related_id: evaluationToReject.id
        });
      }
      
      toast({
        title: 'Rejected',
        description: `Evaluation has been rejected`
      });
      
      // Update local state to reflect the rejection
      setPendingEvaluations(pendingEvaluations.filter(e => e.id !== evaluationToReject.id));
      
      // Log this rejection action
      await supabase.from('analytics_events').insert({
        event_type: 'evaluation_rejected',
        user_id: profile?.id,
        event_data: { 
          entity_id: evaluationToReject.id,
          entity_name: evaluationToReject.name,
          reason: rejectionReason,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error(`Error rejecting evaluation:`, error);
      toast({
        title: `Failed to reject evaluation`,
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
          setFilteredEvaluations(pendingEvaluations);
          break;
        case 'active':
          setFilteredEvaluations(activeEvaluations);
          break;
        case 'rejected':
          setFilteredEvaluations(rejectedEvaluations);
          break;
      }
      return;
    }
    
    // Get the current tab's data
    let dataToFilter;
    switch (activeTab) {
      case 'pending':
        dataToFilter = pendingEvaluations;
        break;
      case 'active':
        dataToFilter = activeEvaluations;
        break;
      case 'rejected':
        dataToFilter = rejectedEvaluations;
        break;
      default:
        dataToFilter = pendingEvaluations;
    }
    
    // Filter based on search term
    const search = searchTerm.toLowerCase();
    const filtered = dataToFilter.filter(evaluation => 
      evaluation.legal_name?.toLowerCase().includes(search) ||
      evaluation.service_type?.toLowerCase().includes(search) ||
      evaluation.districts?.name?.toLowerCase().includes(search) ||
      evaluation.schools?.name?.toLowerCase().includes(search)
    );
    
    setFilteredEvaluations(filtered);
  };
  
  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    
    // Get the current tab's data
    let dataToFilter;
    switch (activeTab) {
      case 'pending':
        dataToFilter = pendingEvaluations;
        break;
      case 'active':
        dataToFilter = activeEvaluations;
        break;
      case 'rejected':
        dataToFilter = rejectedEvaluations;
        break;
      default:
        dataToFilter = pendingEvaluations;
    }
    
    // Apply filter based on selected value
    if (value === 'all' || !value) {
      setFilteredEvaluations(dataToFilter);
    } else if (value === 'type') {
      // Group by service type
      const filtered = dataToFilter.filter(e => e.service_type);
      setFilteredEvaluations(filtered);
    } else if (value === 'district') {
      // Filter by district data available
      const filtered = dataToFilter.filter(e => e.districts?.name);
      setFilteredEvaluations(filtered);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
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
          <h1 className="text-2xl font-bold">Evaluation Approvals</h1>
          <p className="text-muted-foreground">Manage evaluation requests</p>
        </div>
      </div>
      
      <TabsWithSearch
        tabs={[
          { value: 'pending', label: 'Pending' },
          { value: 'active', label: 'Active' },
          { value: 'rejected', label: 'Rejected' }
        ]}
        filterOptions={[
          { value: 'all', label: 'All' },
          { value: 'type', label: 'By Type' },
          { value: 'district', label: 'By District' }
        ]}
        onSearch={handleSearch}
        onTabChange={setActiveTab}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search evaluations..."
        filterPlaceholder="Filter by"
      >
        <TabsContent value="pending" className="space-y-4">
          {renderEvaluationsList(pendingEvaluations, filteredEvaluations, loading, activeTab)}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          {renderEvaluationsList(activeEvaluations, filteredEvaluations, loading, activeTab)}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {renderEvaluationsList(rejectedEvaluations, filteredEvaluations, loading, activeTab)}
        </TabsContent>
      </TabsWithSearch>
      
      {/* Rejection Dialog */}
      <AlertDialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Evaluation</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting "{evaluationToReject.name}". This will be shared with the user.
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
  
  function renderEvaluationsList(sourceData, filteredData, isLoading, tab) {
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
              <FileText className="mr-2 h-5 w-5" />
              <span>No {tab} evaluation approvals</span>
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
              <FileText className="mr-2 h-5 w-5" />
              <span>No matching evaluations found</span>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <>
        {filteredData.map(evaluation => (
          <Card key={evaluation.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{evaluation.legal_name || 'Unnamed Student'}</CardTitle>
                {getStatusBadge(evaluation.status)}
              </div>
              <CardDescription>
                {evaluation.service_type || 'General Evaluation'} - {' '}
                {evaluation.districts?.name || 'Unknown District'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">School</p>
                  <p className="text-sm text-muted-foreground">{evaluation.schools?.name || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Submission Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(evaluation.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {evaluation.status === 'pending' && (
                <div className="mt-6 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => openRejectionDialog(evaluation.id, evaluation.legal_name || 'Unnamed Student')}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button onClick={() => approveEvaluation(evaluation.id, evaluation.legal_name || 'Unnamed Student')}>
                    <Check className="mr-1 h-4 w-4" />
                    Approve Evaluation
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

export default AdminEvaluations;
