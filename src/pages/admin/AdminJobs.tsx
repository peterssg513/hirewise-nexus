
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const AdminJobs = () => {
  const { profile } = useAuth();
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [jobToReject, setJobToReject] = useState({ id: '', title: '' });
  
  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        setLoading(true);
        
        const { data: pendingJobsData, error } = await supabase
          .from('jobs')
          .select('*, districts(name)')
          .eq('status', 'pending');
          
        if (error) throw error;
        
        setPendingJobs(pendingJobsData || []);
      } catch (error) {
        console.error('Error fetching pending jobs:', error);
        toast({
          title: 'Failed to load jobs',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingJobs();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('admin-jobs-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'jobs',
          filter: 'status=eq.pending'
        }, 
        () => {
          fetchPendingJobs();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const approveJob = async (id, title) => {
    try {
      const result = await supabase.rpc('approve_job', { job_id: id });
      
      if (result.error) throw result.error;
      
      // Get job details for notification
      const { data: jobData } = await supabase
        .from('jobs')
        .select('title, district_id, districts!inner(user_id)')
        .eq('id', id)
        .single();
        
      // Create notification for the user
      if (jobData?.districts?.user_id) {
        await supabase.from('notifications').insert({
          user_id: jobData.districts.user_id,
          message: `Your job "${jobData?.title}" has been approved and is now visible to psychologists!`,
          type: 'job_approved',
          related_id: id
        });
      }
      
      toast({
        title: 'Success',
        description: `Job approved successfully`
      });
      
      // Update local state to reflect the approval
      setPendingJobs(pendingJobs.filter(j => j.id !== id));
      
      // Log this approval action
      await supabase.from('analytics_events').insert({
        event_type: 'job_approved',
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: title,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error(`Error approving job:`, error);
      toast({
        title: `Failed to approve job`,
        variant: 'destructive'
      });
    }
  };

  const openRejectionDialog = (id, title) => {
    setJobToReject({ id, title });
    setRejectionReason('');
    setRejectionDialogOpen(true);
  };

  const handleReject = async () => {
    try {
      const result = await supabase
        .from('jobs')
        .update({ 
          status: 'rejected'
        })
        .eq('id', jobToReject.id);
      
      if (result.error) throw result.error;
      
      // Get job details for notification
      const { data: jobData } = await supabase
        .from('jobs')
        .select('title, district_id, districts!inner(user_id)')
        .eq('id', jobToReject.id)
        .single();
        
      // Create notification for the user
      if (jobData?.districts?.user_id) {
        await supabase.from('notifications').insert({
          user_id: jobData.districts.user_id,
          message: `Your job "${jobData?.title}" was not approved. Reason: ${rejectionReason}`,
          type: 'job_rejected',
          related_id: jobToReject.id
        });
      }
      
      toast({
        title: 'Rejected',
        description: `Job has been rejected`
      });
      
      // Update local state to reflect the rejection
      setPendingJobs(pendingJobs.filter(j => j.id !== jobToReject.id));
      
      // Log this rejection action
      await supabase.from('analytics_events').insert({
        event_type: 'job_rejected',
        user_id: profile?.id,
        event_data: { 
          entity_id: jobToReject.id,
          entity_name: jobToReject.title,
          reason: rejectionReason,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error(`Error rejecting job:`, error);
      toast({
        title: `Failed to reject job`,
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
          <h1 className="text-2xl font-bold">Job Approvals</h1>
          <p className="text-muted-foreground">Manage job postings</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
        </div>
      ) : pendingJobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-muted-foreground p-8">
              <Briefcase className="mr-2 h-5 w-5" />
              <span>No pending job approvals</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        pendingJobs.map(job => (
          <Card key={job.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{job.title}</CardTitle>
                <Badge className="bg-yellow-500">Pending</Badge>
              </div>
              <CardDescription>Posted by {job.districts?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {job.city && job.state 
                      ? `${job.city}, ${job.state}` 
                      : job.location || 'Remote/Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Job Type</p>
                  <p className="text-sm text-muted-foreground">{job.job_type || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Timeframe</p>
                  <p className="text-sm text-muted-foreground">{job.timeframe || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Salary</p>
                  <p className="text-sm text-muted-foreground">
                    {job.salary 
                      ? `$${job.salary.toLocaleString()}` 
                      : 'Not specified'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">Skills Required</p>
                <p className="text-sm text-muted-foreground">
                  {job.skills_required?.length ? job.skills_required.join(', ') : 'None specified'}
                </p>
              </div>
              {job.qualifications?.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Qualifications</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {job.qualifications.map((qual, idx) => (
                      <li key={idx}>{qual}</li>
                    ))}
                  </ul>
                </div>
              )}
              {job.benefits?.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Benefits</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {job.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => openRejectionDialog(job.id, job.title)}
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={() => approveJob(job.id, job.title)}>
                  <Check className="mr-1 h-4 w-4" />
                  Approve Job
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
            <AlertDialogTitle>Reject Job</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting "{jobToReject.title}". This will be shared with the user.
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

export default AdminJobs;
