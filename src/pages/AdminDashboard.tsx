
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Import admin pages
import AdminDistricts from '@/pages/admin/AdminDistricts';
import AdminPsychologists from '@/pages/admin/AdminPsychologists';
import AdminJobs from '@/pages/admin/AdminJobs';
import AdminEvaluations from '@/pages/admin/AdminEvaluations';
import { DashboardStats } from '@/components/admin/dashboard/DashboardStats';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get active tab from hash (default to 'districts' if no hash present)
  const getTabFromHash = () => {
    if (location.hash) {
      const hash = location.hash.substring(1); // Remove the # character
      return ['districts', 'psychologists', 'jobs', 'evaluations'].includes(hash) 
        ? hash 
        : 'districts'; // Default tab
    }
    return 'districts'; // Default tab if no hash
  };
  
  // Initialize the active tab state based on the current URL hash
  const [activeTab, setActiveTab] = useState(getTabFromHash());
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingDistricts: 0,
    pendingPsychologists: 0,
    pendingJobs: 0,
    activeJobs: 0,
    completedEvaluations: 0,
    pendingEvaluations: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        const { data: pendingDistrictsData } = await supabase
          .from('districts')
          .select('id')
          .eq('status', 'pending');
        
        const { data: pendingPsychologistsData } = await supabase
          .from('psychologists')
          .select('id')
          .eq('status', 'pending');
          
        const { count: pendingJobsCount } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })
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
          .select('id')
          .eq('status', 'pending');
        
        setStats({
          totalUsers: userCount || 0,
          pendingDistricts: pendingDistrictsData?.length || 0,
          pendingPsychologists: pendingPsychologistsData?.length || 0,
          pendingJobs: pendingJobsCount || 0,
          activeJobs: activeJobsCount || 0,
          completedEvaluations: completedEvaluationsCount || 0,
          pendingEvaluations: pendingEvaluationsData?.length || 0
        });
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
        { event: '*', schema: 'public', table: 'districts' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'psychologists' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'evaluation_requests' }, 
        () => fetchStats()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'evaluations' }, 
        () => fetchStats()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Listen for hash changes
  useEffect(() => {
    // Update the active tab when the hash changes
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once to set the initial state
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location.hash]);
  
  // Update the URL hash when changing tabs
  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(`#${value}`, { replace: true });
  };
  
  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <DashboardStats 
        stats={stats} 
        pendingEvaluationsCount={stats.pendingEvaluations} 
      />
      
      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="psychologists">Psychologists</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
        </TabsList>
        
        {/* Tab Content */}
        <TabsContent value="districts" className="mt-6">
          <AdminDistricts />
        </TabsContent>
        
        <TabsContent value="psychologists" className="mt-6">
          <AdminPsychologists />
        </TabsContent>
        
        <TabsContent value="jobs" className="mt-6">
          <AdminJobs />
        </TabsContent>
        
        <TabsContent value="evaluations" className="mt-6">
          <AdminEvaluations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
