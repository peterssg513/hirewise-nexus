
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users, Briefcase, ClipboardCheck, Activity, AlertTriangle, UserPlus, FileText } from 'lucide-react';
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get counts from all relevant tables
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        const { count: pendingDistrictsCount, data: pendingDistrictsData } = await supabase
          .from('districts')
          .select('*, profiles(name, email)')
          .eq('status', 'pending');
          
        const { count: pendingPsychologistsCount, data: pendingPsychologistsData } = await supabase
          .from('psychologists')
          .select('*, profiles(name, email)')
          .eq('status', 'pending');
          
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
          pendingDistricts: pendingDistrictsCount || 0,
          pendingPsychologists: pendingPsychologistsCount || 0,
          pendingJobs: pendingJobsCount || 0,
          activeJobs: activeJobsCount || 0,
          completedEvaluations: completedEvaluationsCount || 0
        });
        
        setPendingDistricts(pendingDistrictsData || []);
        setPendingPsychologists(pendingPsychologistsData || []);
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
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('admin-dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchStats();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const approveEntity = async (type, id) => {
    try {
      let result;
      
      switch(type) {
        case 'district':
          result = await supabase.rpc('approve_district', { district_id: id });
          break;
        case 'psychologist':
          result = await supabase.rpc('approve_psychologist', { psychologist_id: id });
          break;
        case 'job':
          result = await supabase.rpc('approve_job', { job_id: id });
          break;
        case 'evaluation':
          // Update the evaluation status from pending to active
          result = await supabase
            .from('evaluation_requests')
            .update({ status: 'active' })
            .eq('id', id);
          break;
        default:
          throw new Error('Invalid entity type');
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully`
      });
      
      // Update local state to reflect the approval
      if (type === 'district') {
        setPendingDistricts(pendingDistricts.filter(d => d.id !== id));
      } else if (type === 'psychologist') {
        setPendingPsychologists(pendingPsychologists.filter(p => p.id !== id));
      } else if (type === 'job') {
        setPendingJobs(pendingJobs.filter(j => j.id !== id));
      } else if (type === 'evaluation') {
        setPendingEvaluations(pendingEvaluations.filter(e => e.id !== id));
      }
      
      // Log this approval action
      await supabase.from('analytics_events').insert({
        event_type: `${type}_approved`,
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
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

  const denyEntity = async (type, id) => {
    try {
      let result;
      
      // For simplicity, denial just changes status to 'rejected'
      // In a real system, you might want different handling
      switch(type) {
        case 'district':
          result = await supabase
            .from('districts')
            .update({ status: 'rejected' })
            .eq('id', id);
          break;
        case 'psychologist':
          result = await supabase
            .from('psychologists')
            .update({ status: 'rejected' })
            .eq('id', id);
          break;
        case 'job':
          result = await supabase
            .from('jobs')
            .update({ status: 'rejected' })
            .eq('id', id);
          break;
        case 'evaluation':
          result = await supabase
            .from('evaluation_requests')
            .update({ status: 'rejected' })
            .eq('id', id);
          break;
        default:
          throw new Error('Invalid entity type');
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: 'Rejected',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been rejected`
      });
      
      // Update local state to reflect the rejection
      if (type === 'district') {
        setPendingDistricts(pendingDistricts.filter(d => d.id !== id));
      } else if (type === 'psychologist') {
        setPendingPsychologists(pendingPsychologists.filter(p => p.id !== id));
      } else if (type === 'job') {
        setPendingJobs(pendingJobs.filter(j => j.id !== id));
      } else if (type === 'evaluation') {
        setPendingEvaluations(pendingEvaluations.filter(e => e.id !== id));
      }
      
      // Log this denial action
      await supabase.from('analytics_events').insert({
        event_type: `${type}_rejected`,
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error(`Error rejecting ${type}:`, error);
      toast({
        title: `Failed to reject ${type}`,
        variant: 'destructive'
      });
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
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{district.description || 'No description provided'}</p>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => denyEntity('district', district.id)}
                    >
                      Reject
                    </Button>
                    <Button 
                      onClick={() => approveEntity('district', district.id)}
                    >
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
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => denyEntity('psychologist', psych.id)}
                    >
                      Reject
                    </Button>
                    <Button onClick={() => approveEntity('psychologist', psych.id)}>
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
                      <p className="text-sm text-muted-foreground">{job.location || 'Remote/Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Timeframe</p>
                      <p className="text-sm text-muted-foreground">{job.timeframe || 'Not specified'}</p>
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
                  <div className="mt-6 flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => denyEntity('job', job.id)}
                    >
                      Reject
                    </Button>
                    <Button onClick={() => approveEntity('job', job.id)}>
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
                    {evaluation.service_type || 'General Evaluation'} - 
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
                      onClick={() => denyEntity('evaluation', evaluation.id)}
                    >
                      Reject
                    </Button>
                    <Button onClick={() => approveEntity('evaluation', evaluation.id)}>
                      Approve Evaluation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
