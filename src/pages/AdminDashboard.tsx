import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Import new component tabs
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';
import { DistrictsTab } from '@/components/admin/dashboard/districts/DistrictsTab';
import { PsychologistsTab } from '@/components/admin/dashboard/psychologists/PsychologistsTab';
import { JobsTab } from '@/components/admin/dashboard/jobs/JobsTab';
import { EvaluationsTab } from '@/components/admin/dashboard/evaluations/EvaluationsTab';
import { RejectionDialog } from '@/components/admin/dashboard/RejectionDialog';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Improved function to get initial tab from hash
  const getInitialTab = () => {
    if (location.hash) {
      const tabFromHash = location.hash.substring(1);
      return ['districts', 'psychologists', 'jobs', 'evaluations'].includes(tabFromHash) 
        ? tabFromHash 
        : 'districts';
    }
    return 'districts';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingDistricts: 0,
    pendingPsychologists: 0,
    pendingJobs: 0,
    activeJobs: 0,
    completedEvaluations: 0
  });
  
  const [pendingDistricts, setPendingDistricts] = useState([]);
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingEvaluations, setPendingEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [entityToReject, setEntityToReject] = useState({ type: '', id: '', name: '' });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        const { data: pendingDistrictsData } = await supabase
          .from('districts')
          .select('id, name, user_id, contact_email, contact_phone, location, description, state, job_title, website, district_size')
          .eq('status', 'pending');
        
        if (pendingDistrictsData && pendingDistrictsData.length > 0) {
          const userIds = pendingDistrictsData.map(d => d.user_id);
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, email')
            .in('id', userIds);
            
          const districtsWithProfiles = pendingDistrictsData.map(district => {
            const profile = profilesData?.find(p => p.id === district.user_id);
            return {
              ...district,
              profile_name: profile?.name || null,
              profile_email: profile?.email || district.contact_email
            };
          });
          
          setPendingDistricts(districtsWithProfiles || []);
        } else {
          setPendingDistricts([]);
        }
          
        const { data: pendingPsychologistsData } = await supabase
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
            experience
          `)
          .eq('status', 'pending');
        
        let psychologistsWithProfiles = [];
        if (pendingPsychologistsData && pendingPsychologistsData.length > 0) {
          const userIds = pendingPsychologistsData.map(p => p.user_id);
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, email')
            .in('id', userIds);
            
          psychologistsWithProfiles = pendingPsychologistsData.map(psych => {
            const profile = profilesData?.find(p => p.id === psych.user_id);
            return {
              ...psych,
              profiles: {
                name: profile?.name || 'Unnamed Psychologist',
                email: profile?.email || 'No email provided'
              }
            };
          });
          
          setPendingPsychologists(psychologistsWithProfiles || []);
        } else {
          setPendingPsychologists([]);
        }
          
        const { count: pendingJobsCount, data: pendingJobsData } = await supabase
          .from('jobs')
          .select('*, districts(name)')
          .eq('status', 'pending');
          
        const { count: activeJobsCount } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
          
        const { count: completedEvaluationsCount } = await supabase
          .from('evaluations')
          .select('*', { count: 'exact', head: true })
          .not('report_url', 'is', null);
          
        const { data: pendingEvaluationsData } = await supabase
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
        
        setStats({
          totalUsers: userCount || 0,
          pendingDistricts: pendingDistrictsData?.length || 0,
          pendingPsychologists: psychologistsWithProfiles?.length || 0,
          pendingJobs: pendingJobsCount || 0,
          activeJobs: activeJobsCount || 0,
          completedEvaluations: completedEvaluationsCount || 0
        });
        
        setPendingJobs(pendingJobsData || []);
        setPendingEvaluations(pendingEvaluationsData || []);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast({
          title: 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    
    const channel = supabase
      .channel('admin-dashboard-changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'districts' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'psychologists' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'jobs' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'evaluation_requests' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'evaluations' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'districts' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'psychologists' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'jobs' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'evaluation_requests' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'evaluations' }, 
        () => fetchStats()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    // Set window hash without using navigate to avoid infinite loops
    window.location.hash = activeTab;
  }, [activeTab]);
  
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getInitialTab();
      if (newTab !== activeTab) {
        setActiveTab(newTab);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeTab]);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
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
      
      if (type === 'district') {
        setPendingDistricts(pendingDistricts.filter(d => d.id !== id));
      } else if (type === 'psychologist') {
        setPendingPsychologists(pendingPsychologists.filter(p => p.id !== id));
      } else if (type === 'job') {
        setPendingJobs(pendingJobs.filter(j => j.id !== id));
      } else if (type === 'evaluation') {
        setPendingEvaluations(pendingEvaluations.filter(e => e.id !== id));
      }
      
      await supabase.from('analytics_events').insert({
        event_type: `${type}_approved`,
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: name,
          timestamp: new Date().toISOString()
        }
      });
      
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
      
      if (type === 'district') {
        setPendingDistricts(pendingDistricts.filter(d => d.id !== id));
      } else if (type === 'psychologist') {
        setPendingPsychologists(pendingPsychologists.filter(p => p.id !== id));
      } else if (type === 'job') {
        setPendingJobs(pendingJobs.filter(j => j.id !== id));
      } else if (type === 'evaluation') {
        setPendingEvaluations(pendingEvaluations.filter(e => e.id !== id));
      }
      
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
  
  return (
    <div className="space-y-6">
      <DashboardStats 
        stats={stats} 
        pendingEvaluationsCount={pendingEvaluations.length} 
      />
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="psychologists">Psychologists</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="districts">
          <DistrictsTab 
            loading={loading} 
            pendingDistricts={pendingDistricts}
            onApprove={approveEntity}
            onReject={openRejectionDialog}
          />
        </TabsContent>
        
        <TabsContent value="psychologists">
          <PsychologistsTab 
            loading={loading} 
            pendingPsychologists={pendingPsychologists}
            onApprove={approveEntity}
            onReject={openRejectionDialog}
          />
        </TabsContent>
        
        <TabsContent value="jobs">
          <JobsTab 
            loading={loading} 
            pendingJobs={pendingJobs}
            onApprove={approveEntity}
            onReject={openRejectionDialog}
          />
        </TabsContent>
        
        <TabsContent value="evaluations">
          <EvaluationsTab 
            loading={loading} 
            pendingEvaluations={pendingEvaluations}
            onApprove={approveEntity}
            onReject={openRejectionDialog}
          />
        </TabsContent>
      </Tabs>
      
      <RejectionDialog 
        open={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        entityType={entityToReject.type}
        entityName={entityToReject.name}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default AdminDashboard;
