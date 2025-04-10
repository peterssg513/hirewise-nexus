
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, Users, Briefcase, ClipboardCheck, Activity, AlertTriangle, UserPlus, FileText, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
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
  const [activeTab, setActiveTab] = useState('districts');
  
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
          
        // Fetch districts with correct name from profiles
        const { data: pendingDistrictsData } = await supabase
          .from('districts')
          .select('id, name, user_id, contact_email, contact_phone, location, description, state, job_title, website, district_size')
          .eq('status', 'pending');
        
        // Get profiles for these districts to ensure we have names
        if (pendingDistrictsData && pendingDistrictsData.length > 0) {
          const userIds = pendingDistrictsData.map(d => d.user_id);
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, email')
            .in('id', userIds);
            
          // Merge profile data with district data
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
          
        // Fix psychologist fetch to join with profiles correctly
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
        
        // Get profiles for these psychologists to ensure we have names
        let psychologistsWithProfiles = [];
        if (pendingPsychologistsData && pendingPsychologistsData.length > 0) {
          const userIds = pendingPsychologistsData.map(p => p.user_id);
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, email')
            .in('id', userIds);
            
          // Merge profile data with psychologist data
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {profile?.name || 'Admin'}</h1>
          <p className="text-muted-foreground">Platform administration and oversight</p>
        </div>
        <Button 
          variant="default" 
          className="flex items-center" 
          onClick={() => navigate('/admin-dashboard/create-admin')}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Create Admin
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className={stats.pendingDistricts > 0 ? "border-yellow-400" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Districts
            </CardTitle>
            <CardDescription>Manage district accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDistricts}</div>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
            {stats.pendingDistricts > 0 && (
              <Badge className="mt-2 bg-yellow-500 hover:bg-yellow-600">
                Action Required
              </Badge>
            )}
          </CardContent>
        </Card>
        
        <Card className={stats.pendingPsychologists > 0 ? "border-yellow-400" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Psychologists
            </CardTitle>
            <CardDescription>Manage psychologist accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPsychologists}</div>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
            {stats.pendingPsychologists > 0 && (
              <Badge className="mt-2 bg-yellow-500 hover:bg-yellow-600">
                Action Required
              </Badge>
            )}
          </CardContent>
        </Card>
        
        <Card className={stats.pendingJobs > 0 ? "border-yellow-400" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              Job Postings
            </CardTitle>
            <CardDescription>Review and approve job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.pendingJobs}</div>
                <p className="text-xs text-muted-foreground">Pending Approval</p>
                {stats.pendingJobs > 0 && (
                  <Badge className="mt-2 bg-yellow-500 hover:bg-yellow-600">
                    Action Required
                  </Badge>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.activeJobs}</div>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={pendingEvaluations.length > 0 ? "border-yellow-400" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Evaluations
            </CardTitle>
            <CardDescription>Review evaluation requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">{pendingEvaluations.length}</div>
                <p className="text-xs text-muted-foreground">Pending Approval</p>
                {pendingEvaluations.length > 0 && (
                  <Badge className="mt-2 bg-yellow-500 hover:bg-yellow-600">
                    Action Required
                  </Badge>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.completedEvaluations}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Platform Activity
            </CardTitle>
            <CardDescription>Monitor system activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Platform Status</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="psychologists">Psychologists</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="districts">
          {loading ? (
            <p>Loading pending districts...</p>
          ) : pendingDistricts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center text-muted-foreground">
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
                      onClick={() => openRejectionDialog('district', district.id, district.name)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      onClick={() => approveEntity('district', district.id, district.name)}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Approve District
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="psychologists">
          {loading ? (
            <p>Loading pending psychologists...</p>
          ) : pendingPsychologists.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center text-muted-foreground">
                  <Users className="mr-2 h-5 w-5" />
                  <span>No pending psychologist approvals</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            pendingPsychologists.map(psych => (
              <Card key={psych.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{psych.profiles?.name || 'Unnamed Psychologist'}</CardTitle>
                    <Badge className="bg-yellow-500">Pending</Badge>
                  </div>
                  <CardDescription>{psych.profiles?.email}</CardDescription>
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
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {psych.phone_number || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Specialties</p>
                      <p className="text-sm text-muted-foreground">
                        {psych.specialties?.length ? psych.specialties.join(', ') : 'None specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Certifications</p>
                      <p className="text-sm text-muted-foreground">
                        {psych.certifications?.length ? psych.certifications.join(', ') : 'None specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Work Types</p>
                      <p className="text-sm text-muted-foreground">
                        {psych.work_types?.length ? psych.work_types.join(', ') : 'None specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Evaluation Types</p>
                      <p className="text-sm text-muted-foreground">
                        {psych.evaluation_types?.length ? psych.evaluation_types.join(', ') : 'None specified'}
                      </p>
                    </div>
                  </div>
                  
                  {psych.experience && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Experience</p>
                      <div className="text-sm text-muted-foreground mt-1">
                        {Array.isArray(JSON.parse(psych.experience || '[]')) ? (
                          <div className="border rounded-md p-2 bg-gray-50">
                            {JSON.parse(psych.experience).map((exp, i) => (
                              <div key={i} className="mb-2 pb-2 border-b last:border-b-0">
                                <p className="font-medium">{exp.organization} - {exp.position}</p>
                                <p className="text-xs">{exp.startDate} to {exp.current ? 'Present' : exp.endDate}</p>
                                <p className="mt-1">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          psych.experience
                        )}
                      </div>
                    </div>
                  )}
                  
                  {psych.certification_details && Object.keys(psych.certification_details).length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium">Certification Details</p>
                      <div className="border rounded-md p-2 bg-gray-50 mt-1">
                        {Object.entries(psych.certification_details).map(([key, value], i) => (
                          <div key={i} className="mb-2">
                            <p className="text-xs font-medium">{key}</p>
                            <p className="text-sm">{value.toString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
                      Approve Psychologist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="jobs">
          {loading ? (
            <p>Loading pending jobs...</p>
          ) : pendingJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center text-muted-foreground">
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
                      onClick={() => openRejectionDialog('job', job.id, job.title)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button onClick={() => approveEntity('job', job.id, job.title)}>
                      <Check className="mr-1 h-4 w-4" />
                      Approve Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="evaluations">
          {loading ? (
            <p>Loading pending evaluations...</p>
          ) : pendingEvaluations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center text-muted-foreground">
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
                    <div>
                      <p className="text-sm font-medium">Grade</p>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.grade || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Age</p>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.age ? `${evaluation.age} years` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  
                  {evaluation.general_education_teacher && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">General Education Teacher</p>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.general_education_teacher}
                      </p>
                    </div>
                  )}
                  
                  {evaluation.parents && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Parents/Guardians</p>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.parents}
                      </p>
                    </div>
                  )}
                  
                  {evaluation.other_relevant_info && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Additional Information</p>
                      <p className="text-sm text-muted-foreground">
                        {evaluation.other_relevant_info}
                      </p>
                    </div>
                  )}
                  
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
                      Approve Evaluation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      
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
};

export default AdminDashboard;
