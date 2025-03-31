
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

const AdminEvaluations = () => {
  const { profile } = useAuth();
  const [pendingEvaluations, setPendingEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [evaluationToReject, setEvaluationToReject] = useState({ id: '', name: '' });
  
  useEffect(() => {
    const fetchPendingEvaluations = async () => {
      try {
        setLoading(true);
        
        const { data: pendingEvaluationsData, error } = await supabase
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
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setPendingEvaluations(pendingEvaluationsData || []);
      } catch (error) {
        console.error('Error fetching pending evaluations:', error);
        toast({
          title: 'Failed to load evaluations',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingEvaluations();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('admin-evaluations-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'evaluation_requests',
          filter: 'status=eq.pending'
        }, 
        () => {
          fetchPendingEvaluations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Evaluation Approvals</h1>
          <p className="text-muted-foreground">Manage evaluation requests</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
        </div>
      ) : pendingEvaluations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-muted-foreground p-8">
              <FileText className="mr-2 h-5 w-5" />
              <span>No pending evaluation approvals</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        pendingEvaluations.map(evaluation => (
          <Card key={evaluation.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{evaluation.legal_name || 'Unnamed Student'}</CardTitle>
                <Badge className="bg-yellow-500">Pending</Badge>
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
            </CardContent>
          </Card>
        ))
      )}
      
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
};

export default AdminEvaluations;
