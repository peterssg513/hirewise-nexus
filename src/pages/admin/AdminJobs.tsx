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
import { TabsContent } from '@/components/ui/tabs';
import { TabsWithSearch } from '@/components/admin/TabsWithSearch';

const AdminJobs = () => {
  const { profile } = useAuth();
  const [pendingJobs, setPendingJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [rejectedJobs, setRejectedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [filterBy, setFilterBy] = useState('');
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [jobToReject, setJobToReject] = useState({ id: '', title: '' });
  
  useEffect(() => {
    fetchJobs();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('admin-jobs-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'jobs'
        }, 
        () => {
          fetchJobs();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    // Set filtered jobs based on active tab
    switch (activeTab) {
      case 'pending':
        setFilteredJobs(pendingJobs);
        break;
      case 'active':
        setFilteredJobs(activeJobs);
        break;
      case 'rejected':
        setFilteredJobs(rejectedJobs);
        break;
      default:
        setFilteredJobs(pendingJobs);
    }
  }, [activeTab, pendingJobs, activeJobs, rejectedJobs]);
  
  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*, districts(name)');
        
      if (error) throw error;
      
      // Split jobs by status
      const pending = jobsData.filter(job => job.status === 'pending');
      const active = jobsData.filter(job => job.status === 'active');
      const rejected = jobsData.filter(job => job.status === 'rejected');
      
      setPendingJobs(pending || []);
      setActiveJobs(active || []);
      setRejectedJobs(rejected || []);
      setFilteredJobs(pending || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Failed to load jobs',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
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
  
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // Reset to the current tab's full data
      switch (activeTab) {
        case 'pending':
          setFilteredJobs(pendingJobs);
          break;
        case 'active':
          setFilteredJobs(activeJobs);
          break;
        case 'rejected':
          setFilteredJobs(rejectedJobs);
          break;
      }
      return;
    }
    
    // Get the current tab's data
    let dataToFilter;
    switch (activeTab) {
      case 'pending':
        dataToFilter = pendingJobs;
        break;
      case 'active':
        dataToFilter = activeJobs;
        break;
      case 'rejected':
        dataToFilter = rejectedJobs;
        break;
      default:
        dataToFilter = pendingJobs;
    }
    
    // Filter based on search term
    const search = searchTerm.toLowerCase();
    const filtered = dataToFilter.filter(job => 
      job.title?.toLowerCase().includes(search) ||
      job.description?.toLowerCase().includes(search) ||
      job.districts?.name?.toLowerCase().includes(search) ||
      job.city?.toLowerCase().includes(search) ||
      job.state?.toLowerCase().includes(search) ||
      job.job_type?.toLowerCase().includes(search) ||
      (job.skills_required && job.skills_required.some(s => s.toLowerCase().includes(search)))
    );
    
    setFilteredJobs(filtered);
  };
  
  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    
    // Get the current tab's data
    let dataToFilter;
    switch (activeTab) {
      case 'pending':
        dataToFilter = pendingJobs;
        break;
      case 'active':
        dataToFilter = activeJobs;
        break;
      case 'rejected':
        dataToFilter = rejectedJobs;
        break;
      default:
        dataToFilter = pendingJobs;
    }
    
    // Apply filter based on selected value
    if (value === 'all' || !value) {
      setFilteredJobs(dataToFilter);
    } else if (value === 'type') {
      // Group by job type
      const filtered = dataToFilter.filter(j => j.job_type);
      setFilteredJobs(filtered);
    } else if (value === 'location') {
      // Has location defined
      const filtered = dataToFilter.filter(j => j.city && j.state);
      setFilteredJobs(filtered);
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
          <h1 className="text-2xl font-bold">Job Approvals</h1>
          <p className="text-muted-foreground">Manage job postings</p>
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
          { value: 'location', label: 'By Location' }
        ]}
        onSearch={handleSearch}
        onTabChange={setActiveTab}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search jobs..."
        filterPlaceholder="Filter by"
      >
        <TabsContent value="pending" className="space-y-4">
          {renderJobsList(pendingJobs, filteredJobs, loading, activeTab)}
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          {renderJobsList(activeJobs, filteredJobs, loading, activeTab)}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {renderJobsList(rejectedJobs, filteredJobs, loading, activeTab)}
        </TabsContent>
      </TabsWithSearch>
      
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
  
  function renderJobsList(sourceData, filteredData, isLoading, tab) {
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
              <Briefcase className="mr-2 h-5 w-5" />
              <span>No {tab} job approvals</span>
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
              <Briefcase className="mr-2 h-5 w-5" />
              <span>No matching jobs found</span>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <>
        {filteredData.map(job => (
          <Card key={job.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{job.title}</CardTitle>
                {getStatusBadge(job.status)}
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
              
              {job.status === 'pending' && (
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
              )}
            </CardContent>
          </Card>
        ))}
      </>
    );
  }
};

export default AdminJobs;
