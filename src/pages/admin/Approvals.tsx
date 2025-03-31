
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { TabsWithSearch } from '@/components/admin/TabsWithSearch';
import { useAuth } from '@/contexts/AuthContext';

export default function Approvals() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('districts');
  const [activeStatusTab, setActiveStatusTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('');
  
  const [pendingDistricts, setPendingDistricts] = useState([]);
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingEvaluations, setPendingEvaluations] = useState([]);
  
  const [rejectedDistricts, setRejectedDistricts] = useState([]);
  const [rejectedPsychologists, setRejectedPsychologists] = useState([]);
  const [rejectedJobs, setRejectedJobs] = useState([]);
  const [rejectedEvaluations, setRejectedEvaluations] = useState([]);
  
  const [approvedDistricts, setApprovedDistricts] = useState([]);
  const [approvedPsychologists, setApprovedPsychologists] = useState([]);
  const [approvedJobs, setApprovedJobs] = useState([]);
  const [approvedEvaluations, setApprovedEvaluations] = useState([]);
  
  const [loading, setLoading] = useState(true);
  
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [entityToReject, setEntityToReject] = useState({ type: '', id: '', name: '' });

  useEffect(() => {
    loadData();
    
    const channel = supabase
      .channel('combined-approvals-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'districts' }, 
        () => loadData()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'psychologists' }, 
        () => loadData()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' }, 
        () => loadData()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'evaluation_requests' }, 
        () => loadData()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab, activeStatusTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'districts':
          await loadDistricts();
          break;
        case 'psychologists':
          await loadPsychologists();
          break;
        case 'jobs':
          await loadJobs();
          break;
        case 'evaluations':
          await loadEvaluations();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error loading ${activeTab}:`, error);
      toast({
        title: `Failed to load ${activeTab}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDistricts = async () => {
    try {
      const { data: districtsData, error } = await supabase
        .from('districts')
        .select('id, name, user_id, contact_email, contact_phone, location, description, state, job_title, website, district_size, status')
        .eq('status', activeStatusTab);
      
      if (error) throw error;
      
      if (districtsData && districtsData.length > 0) {
        const userIds = districtsData.map(d => d.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', userIds);
          
        const districtsWithProfiles = districtsData.map(district => {
          const profile = profilesData?.find(p => p.id === district.user_id);
          return {
            ...district,
            profile_name: profile?.name || null,
            profile_email: profile?.email || district.contact_email
          };
        });
        
        if (activeStatusTab === 'pending') {
          setPendingDistricts(districtsWithProfiles);
        } else if (activeStatusTab === 'rejected') {
          setRejectedDistricts(districtsWithProfiles);
        } else {
          setApprovedDistricts(districtsWithProfiles);
        }
      } else {
        if (activeStatusTab === 'pending') {
          setPendingDistricts([]);
        } else if (activeStatusTab === 'rejected') {
          setRejectedDistricts([]);
        } else {
          setApprovedDistricts([]);
        }
      }
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  const loadPsychologists = async () => {
    try {
      const { data: psychologistsData, error } = await supabase
        .from('psychologists')
        .select(`
          id, 
          user_id,
          education,
          experience_years,
          specialties,
          certification_details,
          phone_number,
          city,
          state,
          work_types,
          evaluation_types,
          experience,
          status
        `)
        .eq('status', activeStatusTab);
      
      if (error) throw error;
      
      if (psychologistsData && psychologistsData.length > 0) {
        const userIds = psychologistsData.map(p => p.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', userIds);
          
        const psychologistsWithProfiles = psychologistsData.map(psych => {
          const profile = profilesData?.find(p => p.id === psych.user_id);
          return {
            ...psych,
            profiles: {
              name: profile?.name || 'Unnamed Psychologist',
              email: profile?.email || 'No email provided'
            }
          };
        });
        
        if (activeStatusTab === 'pending') {
          setPendingPsychologists(psychologistsWithProfiles);
        } else if (activeStatusTab === 'rejected') {
          setRejectedPsychologists(psychologistsWithProfiles);
        } else {
          setApprovedPsychologists(psychologistsWithProfiles);
        }
      } else {
        if (activeStatusTab === 'pending') {
          setPendingPsychologists([]);
        } else if (activeStatusTab === 'rejected') {
          setRejectedPsychologists([]);
        } else {
          setApprovedPsychologists([]);
        }
      }
    } catch (error) {
      console.error('Error loading psychologists:', error);
    }
  };

  const loadJobs = async () => {
    try {
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*, districts(name)')
        .eq('status', activeStatusTab);
      
      if (error) throw error;
      
      if (activeStatusTab === 'pending') {
        setPendingJobs(jobsData || []);
      } else if (activeStatusTab === 'rejected') {
        setRejectedJobs(jobsData || []);
      } else {
        setApprovedJobs(jobsData || []);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const loadEvaluations = async () => {
    try {
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
        .eq('status', activeStatusTab)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (activeStatusTab === 'pending') {
        setPendingEvaluations(evaluationsData || []);
      } else if (activeStatusTab === 'rejected') {
        setRejectedEvaluations(evaluationsData || []);
      } else {
        setApprovedEvaluations(evaluationsData || []);
      }
    } catch (error) {
      console.error('Error loading evaluations:', error);
    }
  };

  const approveEntity = async (type, id, name) => {
    try {
      let result;
      let recipientId;
      let notificationMessage = '';
      
      switch(type) {
        case 'district':
          result = await supabase.rpc('approve_district', { district_id: id });
          
          const { data: districtData } = await supabase
            .from('districts')
            .select('user_id, name')
            .eq('id', id)
            .single();
            
          recipientId = districtData?.user_id;
          notificationMessage = `Your district "${districtData?.name}" has been approved! You can now create jobs and evaluations.`;
          
          // Update the local state to move from pending to approved
          setPendingDistricts(prev => prev.filter(d => d.id !== id));
          break;
          
        case 'psychologist':
          result = await supabase.rpc('approve_psychologist', { psychologist_id: id });
          
          const { data: psychData } = await supabase
            .from('psychologists')
            .select('user_id, profiles:user_id(name)')
            .eq('id', id)
            .single();
            
          recipientId = psychData?.user_id;
          notificationMessage = `Your psychologist profile has been approved! You can now apply for jobs and evaluations.`;
          
          // Update the local state to move from pending to approved
          setPendingPsychologists(prev => prev.filter(p => p.id !== id));
          break;
          
        case 'job':
          result = await supabase.rpc('approve_job', { job_id: id });
          
          const { data: jobData } = await supabase
            .from('jobs')
            .select('title, district_id, districts!inner(user_id)')
            .eq('id', id)
            .single();
            
          recipientId = jobData?.districts?.user_id;
          notificationMessage = `Your job "${jobData?.title}" has been approved and is now visible to psychologists!`;
          
          // Update the local state to move from pending to approved
          setPendingJobs(prev => prev.filter(j => j.id !== id));
          break;
          
        case 'evaluation':
          result = await supabase
            .from('evaluation_requests')
            .update({ status: 'active' })
            .eq('id', id);
          
          const { data: evalData } = await supabase
            .from('evaluation_requests')
            .select('legal_name, district_id, districts!inner(user_id)')
            .eq('id', id)
            .single();
            
          recipientId = evalData?.districts?.user_id;
          notificationMessage = `Evaluation request for "${evalData?.legal_name}" has been approved!`;
          
          // Update the local state to move from pending to approved
          setPendingEvaluations(prev => prev.filter(e => e.id !== id));
          break;
          
        default:
          throw new Error('Invalid entity type');
      }
      
      if (result.error) throw result.error;
      
      if (recipientId && notificationMessage) {
        await supabase.from('notifications').insert({
          user_id: recipientId,
          message: notificationMessage,
          type: `${type}_approved`,
          related_id: id
        });
      }
      
      toast({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully`
      });
      
      await supabase.from('analytics_events').insert({
        event_type: `${type}_approved`,
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: name,
          timestamp: new Date().toISOString()
        }
      });
      
      loadData();
    } catch (error) {
      console.error(`Error approving ${type}:`, error);
      toast({
        title: `Failed to approve ${type}`,
        variant: 'destructive'
      });
    }
  };

  const openRejectionDialog = (type, id, name) => {
    setEntityToReject({ type, id, name });
    setRejectionReason('');
    setRejectionDialogOpen(true);
  };

  const handleReject = async () => {
    const { type, id, name } = entityToReject;
    
    try {
      let result;
      let recipientId;
      let notificationMessage = '';
      
      switch(type) {
        case 'district':
          result = await supabase
            .from('districts')
            .update({ 
              status: 'rejected'
            })
            .eq('id', id);
          
          const { data: districtData } = await supabase
            .from('districts')
            .select('user_id, name')
            .eq('id', id)
            .single();
            
          recipientId = districtData?.user_id;
          notificationMessage = `Your district "${districtData?.name}" registration was not approved.`;
          
          // Update the local state to move from pending to rejected
          setPendingDistricts(prev => prev.filter(d => d.id !== id));
          break;
          
        case 'psychologist':
          result = await supabase
            .from('psychologists')
            .update({ 
              status: 'rejected'
            })
            .eq('id', id);
          
          const { data: psychData } = await supabase
            .from('psychologists')
            .select('user_id')
            .eq('id', id)
            .single();
            
          recipientId = psychData?.user_id;
          notificationMessage = `Your psychologist profile was not approved.`;
          
          // Update the local state to move from pending to rejected
          setPendingPsychologists(prev => prev.filter(p => p.id !== id));
          break;
          
        case 'job':
          result = await supabase
            .from('jobs')
            .update({ 
              status: 'rejected'
            })
            .eq('id', id);
          
          const { data: jobData } = await supabase
            .from('jobs')
            .select('title, district_id, districts!inner(user_id)')
            .eq('id', id)
            .single();
            
          recipientId = jobData?.districts?.user_id;
          notificationMessage = `Your job "${jobData?.title}" was not approved.`;
          
          // Update the local state to move from pending to rejected
          setPendingJobs(prev => prev.filter(j => j.id !== id));
          break;
          
        case 'evaluation':
          result = await supabase
            .from('evaluation_requests')
            .update({ 
              status: 'rejected'
            })
            .eq('id', id);
          
          const { data: evalData } = await supabase
            .from('evaluation_requests')
            .select('legal_name, district_id, districts!inner(user_id)')
            .eq('id', id)
            .single();
            
          recipientId = evalData?.districts?.user_id;
          notificationMessage = `Evaluation request for "${evalData?.legal_name}" was not approved.`;
          
          // Update the local state to move from pending to rejected
          setPendingEvaluations(prev => prev.filter(e => e.id !== id));
          break;
          
        default:
          throw new Error('Invalid entity type');
      }
      
      if (result.error) throw result.error;
      
      if (recipientId && notificationMessage) {
        await supabase.from('notifications').insert({
          user_id: recipientId,
          message: `${notificationMessage} Reason: ${rejectionReason}`,
          type: `${type}_rejected`,
          related_id: id
        });
      }
      
      toast({
        title: 'Rejected',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been rejected`
      });
      
      await supabase.from('analytics_events').insert({
        event_type: `${type}_rejected`,
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: name,
          reason: rejectionReason,
          timestamp: new Date().toISOString()
        }
      });
      
      loadData();
    } catch (error) {
      console.error(`Error rejecting ${type}:`, error);
      toast({
        title: `Failed to reject ${type}`,
        variant: 'destructive'
      });
    } finally {
      setRejectionDialogOpen(false);
    }
  };

  const renderCurrentTabContent = () => {
    if (loading) {
      return <p className="text-center py-8">Loading...</p>;
    }

    let data = [];
    if (activeTab === 'districts') {
      data = activeStatusTab === 'pending' ? pendingDistricts : activeStatusTab === 'rejected' ? rejectedDistricts : approvedDistricts;
      return renderDistrictsCards(data);
    } else if (activeTab === 'psychologists') {
      data = activeStatusTab === 'pending' ? pendingPsychologists : activeStatusTab === 'rejected' ? rejectedPsychologists : approvedPsychologists;
      return renderPsychologistsCards(data);
    } else if (activeTab === 'jobs') {
      data = activeStatusTab === 'pending' ? pendingJobs : activeStatusTab === 'rejected' ? rejectedJobs : approvedJobs;
      return renderJobsCards(data);
    } else if (activeTab === 'evaluations') {
      data = activeStatusTab === 'pending' ? pendingEvaluations : activeStatusTab === 'rejected' ? rejectedEvaluations : approvedEvaluations;
      return renderEvaluationsCards(data);
    }
    return null;
  };

  const renderDistrictsCards = (districts) => {
    if (districts.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No {activeStatusTab} districts found</p>
          </CardContent>
        </Card>
      );
    }

    return districts.map(district => (
      <Card key={district.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{district.name}</CardTitle>
            <Badge variant={activeStatusTab === 'pending' ? 'outline' : activeStatusTab === 'rejected' ? 'destructive' : 'secondary'}>
              {activeStatusTab.charAt(0).toUpperCase() + activeStatusTab.slice(1)}
            </Badge>
          </div>
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
          </div>
          {activeStatusTab === 'pending' && (
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => openRejectionDialog('district', district.id, district.name)}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => approveEntity('district', district.id, district.name)}>
                <Check className="mr-1 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    ));
  };

  const renderPsychologistsCards = (psychologists) => {
    if (psychologists.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No {activeStatusTab} psychologists found</p>
          </CardContent>
        </Card>
      );
    }

    return psychologists.map(psych => (
      <Card key={psych.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{psych.profiles?.name || 'Unnamed Psychologist'}</CardTitle>
            <Badge variant={activeStatusTab === 'pending' ? 'outline' : activeStatusTab === 'rejected' ? 'destructive' : 'secondary'}>
              {activeStatusTab.charAt(0).toUpperCase() + activeStatusTab.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Education</p>
              <p className="text-sm text-muted-foreground">{psych.education || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Experience</p>
              <p className="text-sm text-muted-foreground">{psych.experience_years ? `${psych.experience_years} years` : 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">
                {psych.city && psych.state ? `${psych.city}, ${psych.state}` : 'Not specified'}
              </p>
            </div>
          </div>
          {activeStatusTab === 'pending' && (
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => openRejectionDialog('psychologist', psych.id, psych.profiles?.name || 'Unnamed Psychologist')}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => approveEntity('psychologist', psych.id, psych.profiles?.name || 'Unnamed Psychologist')}>
                <Check className="mr-1 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    ));
  };

  const renderJobsCards = (jobs) => {
    if (jobs.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No {activeStatusTab} jobs found</p>
          </CardContent>
        </Card>
      );
    }

    return jobs.map(job => (
      <Card key={job.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{job.title}</CardTitle>
            <Badge variant={activeStatusTab === 'pending' ? 'outline' : activeStatusTab === 'rejected' ? 'destructive' : 'secondary'}>
              {activeStatusTab.charAt(0).toUpperCase() + activeStatusTab.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Posted by {job.districts?.name}</p>
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
          </div>
          {activeStatusTab === 'pending' && (
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => openRejectionDialog('job', job.id, job.title)}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => approveEntity('job', job.id, job.title)}>
                <Check className="mr-1 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    ));
  };

  const renderEvaluationsCards = (evaluations) => {
    if (evaluations.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No {activeStatusTab} evaluations found</p>
          </CardContent>
        </Card>
      );
    }

    return evaluations.map(evaluation => (
      <Card key={evaluation.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>{evaluation.legal_name || 'Unnamed Student'}</CardTitle>
            <Badge variant={activeStatusTab === 'pending' ? 'outline' : activeStatusTab === 'rejected' ? 'destructive' : 'secondary'}>
              {activeStatusTab.charAt(0).toUpperCase() + activeStatusTab.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {evaluation.service_type || 'General Evaluation'} - {' '}
            {evaluation.districts?.name || 'Unknown District'}
          </p>
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
          {activeStatusTab === 'pending' && (
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => openRejectionDialog('evaluation', evaluation.id, evaluation.legal_name || 'Unnamed Student')}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => approveEntity('evaluation', evaluation.id, evaluation.legal_name || 'Unnamed Student')}>
                <Check className="mr-1 h-4 w-4" />
                Approve
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    ));
  };

  const entityTypes = [
    { value: 'districts', label: 'Districts' },
    { value: 'psychologists', label: 'Psychologists' },
    { value: 'jobs', label: 'Jobs' },
    { value: 'evaluations', label: 'Evaluations' },
  ];

  const statusTabs = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Approvals</h1>
        <p className="text-muted-foreground">Manage pending approvals across the platform</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {entityTypes.map(type => (
            <TabsTrigger key={type.value} value={type.value}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <TabsWithSearch
        tabs={statusTabs}
        onSearch={setSearchTerm}
        onTabChange={setActiveStatusTab}
        defaultTab="pending"
        searchPlaceholder={`Search ${activeTab}...`}
      >
        {statusTabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {renderCurrentTabContent()}
          </TabsContent>
        ))}
      </TabsWithSearch>

      <AlertDialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject {entityToReject.type}</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting "{entityToReject.name}". This will be shared with the user.
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
}
