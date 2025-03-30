
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users, Briefcase, ClipboardCheck, Activity, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { profile } = useAuth();
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
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('Failed to load dashboard data');
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
        default:
          throw new Error('Invalid entity type');
      }
      
      if (result.error) throw result.error;
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully`);
      
      // Update local state to reflect the approval
      if (type === 'district') {
        setPendingDistricts(pendingDistricts.filter(d => d.id !== id));
      } else if (type === 'psychologist') {
        setPendingPsychologists(pendingPsychologists.filter(p => p.id !== id));
      } else if (type === 'job') {
        setPendingJobs(pendingJobs.filter(j => j.id !== id));
      }
      
    } catch (error) {
      console.error(`Error approving ${type}:`, error);
      toast.error(`Failed to approve ${type}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {profile?.name || 'Admin'}</h1>
      <p className="text-muted-foreground">Platform administration and oversight</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Users
            </CardTitle>
            <CardDescription>Manage platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        
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
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.activeJobs}</div>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Evaluations
            </CardTitle>
            <CardDescription>Review submitted evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedEvaluations}</div>
            <p className="text-xs text-muted-foreground">Completed Evaluations</p>
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
      
      <Tabs defaultValue="districts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="districts">Pending Districts</TabsTrigger>
          <TabsTrigger value="psychologists">Pending Psychologists</TabsTrigger>
          <TabsTrigger value="jobs">Pending Jobs</TabsTrigger>
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
                  <CardTitle>{district.name}</CardTitle>
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
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => approveEntity('district', district.id)}>
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
                  <CardTitle>{psych.profiles?.name || 'Unnamed Psychologist'}</CardTitle>
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
                  <div className="mt-4 flex justify-end">
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
                  <CardTitle>{job.title}</CardTitle>
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
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => approveEntity('job', job.id)}>
                      Approve Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            System Alerts
          </CardTitle>
          <CardDescription>Recent platform alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">No critical alerts at this time</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
