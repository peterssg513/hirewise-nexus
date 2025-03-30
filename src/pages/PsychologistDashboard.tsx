
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, ClipboardList, ListChecks, CheckCircle, 
  Clock, XCircle, BarChart4, TrendingUp, Calendar, Users
} from 'lucide-react';

interface PsychologistData {
  id: string;
  experience_years: number | null;
  specialties: string[] | null;
  certifications: string[] | null;
  signup_completed: boolean;
}

interface DashboardStats {
  activeApplications: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  activeJobs: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  entity: string;
  date: string;
  status?: string;
}

const PsychologistDashboard = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  
  // Fetch psychologist data
  const { data: psychologist, isLoading: isLoadingPsychologist } = useQuery({
    queryKey: ['psychologist'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('psychologists')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as PsychologistData;
    },
    enabled: !!user,
  });
  
  // Fetch dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      if (!psychologist) return null;
      
      // Fetch active applications count
      const { count: applicationsCount, error: appError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('psychologist_id', psychologist.id)
        .in('status', ['submitted', 'under_review']);
      
      if (appError) throw appError;
      
      // Fetch active jobs count
      const { count: jobsCount, error: jobsError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (jobsError) throw jobsError;
      
      // Fetch evaluations counts
      const { data: allEvaluations, error: evalError } = await supabase
        .from('evaluations')
        .select('id, status, application:applications!inner(psychologist_id)')
        .eq('applications.psychologist_id', psychologist.id);
      
      if (evalError) throw evalError;
      
      const pendingEvaluations = allEvaluations.filter(e => 
        ['assigned', 'in_progress'].includes(e.status)
      ).length;
      
      const completedEvaluations = allEvaluations.filter(e => 
        ['submitted', 'approved'].includes(e.status)
      ).length;
      
      return {
        activeApplications: applicationsCount || 0,
        pendingEvaluations,
        completedEvaluations,
        activeJobs: jobsCount || 0,
      };
    },
    enabled: !!psychologist,
  });
  
  // Generate simulated recent activity
  useEffect(() => {
    if (psychologist) {
      // In a real app, this would be fetched from the database
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'application',
          title: 'School Psychologist - Full Time',
          entity: 'Riverside School District',
          date: '2023-05-15',
          status: 'under_review'
        },
        {
          id: '2',
          type: 'evaluation',
          title: 'Cognitive Assessment',
          entity: 'Maple Elementary School',
          date: '2023-05-10',
          status: 'in_progress'
        },
        {
          id: '3',
          type: 'application',
          title: 'Special Education Psychologist',
          entity: 'Summit School District',
          date: '2023-05-05',
          status: 'approved'
        },
        {
          id: '4',
          type: 'evaluation',
          title: 'Behavioral Assessment',
          entity: 'Pine Ridge Middle School',
          date: '2023-05-01',
          status: 'submitted'
        },
        {
          id: '5',
          type: 'application',
          title: 'Consulting Psychologist',
          entity: 'Golden Valley Schools',
          date: '2023-04-28',
          status: 'rejected'
        }
      ];
      
      setRecentActivity(mockActivity);
    }
  }, [psychologist]);
  
  // Handle profile completion button click
  const handleCompleteProfile = () => {
    navigate('/psychologist-dashboard/profile');
  };
  
  const isLoading = isLoadingPsychologist || isLoadingStats;
  
  // Status icon component
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'approved':
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'under_review':
      case 'in_progress':
      case 'assigned':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Progress percentage calculation
  const calculateProfileProgress = () => {
    if (!psychologist) return 0;
    
    let total = 0;
    let completed = 0;
    
    // Check basic info
    if (profile?.name) completed++;
    total++;
    
    // Check professional info
    if (psychologist.experience_years) completed++;
    total++;
    
    if (psychologist.specialties && psychologist.specialties.length > 0) completed++;
    total++;
    
    if (psychologist.certifications && psychologist.certifications.length > 0) completed++;
    total++;
    
    return Math.round((completed / total) * 100);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {profile?.name || 'Psychologist'}</h1>
          <p className="text-muted-foreground">Your psychologist dashboard</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/psychologist-dashboard/jobs')}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Browse Jobs
          </Button>
          <Button 
            variant="default" 
            className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
            onClick={() => navigate('/psychologist-dashboard/applications')}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            My Applications
          </Button>
        </div>
      </div>
      
      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Job Applications</CardTitle>
            <CardDescription>Your active applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeApplications || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Track your submissions</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="ghost" 
              className="w-full justify-center text-xs"
              onClick={() => navigate('/psychologist-dashboard/applications')}
            >
              View All Applications
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Pending Evaluations</CardTitle>
            <CardDescription>Evaluations needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingEvaluations || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ListChecks className="h-3 w-3" />
              <span>Assigned to you</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="ghost" 
              className="w-full justify-center text-xs"
              onClick={() => navigate('/psychologist-dashboard/applications')}
            >
              Continue Working
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Available Jobs</CardTitle>
            <CardDescription>Openings you can apply for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BarChart4 className="h-3 w-3" />
              <span>Current opportunities</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="ghost" 
              className="w-full justify-center text-xs"
              onClick={() => navigate('/psychologist-dashboard/jobs')}
            >
              Browse Job Listings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Completed Reports</CardTitle>
            <CardDescription>Your submitted evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedEvaluations || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3" />
              <span>Finished evaluations</span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="ghost" 
              className="w-full justify-center text-xs"
            >
              View Submitted Reports
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Profile Completion Card */}
      {!psychologist?.signup_completed && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg">Complete Your Profile</CardTitle>
            <CardDescription>
              Enhance your visibility to school districts by completing your professional profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-psyched-darkBlue"
                  style={{ width: `${calculateProfileProgress()}%` }}
                ></div>
              </div>
              
              <div className="text-sm">
                <span className="font-medium">{calculateProfileProgress()}% complete</span>
                <span className="text-muted-foreground"> - Add more details to improve your profile</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
              onClick={handleCompleteProfile}
            >
              Complete Your Profile
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Activity Card */}
        <Card className="md:col-span-2 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest applications and evaluations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {recentActivity.length > 0 ? (
              <div className="divide-y">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {activity.type === 'application' ? (
                            <Briefcase className="h-5 w-5 text-blue-500" />
                          ) : (
                            <ListChecks className="h-5 w-5 text-purple-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">{activity.entity}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant="outline" 
                          className="flex items-center gap-1 px-2 py-0.5 text-xs"
                        >
                          <StatusIcon status={activity.status || ''} />
                          <span>
                            {activity.status === 'under_review' ? 'Under Review' :
                             activity.status === 'in_progress' ? 'In Progress' :
                             activity.status === 'approved' ? 'Approved' : 
                             activity.status === 'submitted' ? 'Submitted' : 
                             activity.status === 'rejected' ? 'Rejected' : 'Pending'}
                          </span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(activity.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t bg-gray-50/80 py-2">
            <Button variant="ghost" className="w-full text-xs">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
        
        {/* Upcoming Events Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Your schedule for the week</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <Calendar className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="font-medium">Evaluation Due</div>
                    <div className="text-sm text-muted-foreground">Cognitive Assessment - John D.</div>
                    <div className="text-xs text-muted-foreground mt-1">Tomorrow at 5:00 PM</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">Interview</div>
                    <div className="text-sm text-muted-foreground">Riverside School District</div>
                    <div className="text-xs text-muted-foreground mt-1">Friday at 10:00 AM</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <ListChecks className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-medium">Assessment Session</div>
                    <div className="text-sm text-muted-foreground">Behavioral Evaluation - Sarah M.</div>
                    <div className="text-xs text-muted-foreground mt-1">Monday at 2:30 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50/80 py-2">
            <Button variant="ghost" className="w-full text-xs">
              View Calendar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PsychologistDashboard;
