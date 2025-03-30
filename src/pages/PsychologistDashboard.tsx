
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface PsychologistData {
  id: string;
  experience_years: number | null;
  specialties: string[] | null;
  certifications: string[] | null;
}

const PsychologistDashboard = () => {
  const { profile, user } = useAuth();
  const [psychologist, setPsychologist] = useState<PsychologistData | null>(null);
  const [activeApplications, setActiveApplications] = useState(0);
  const [pendingEvaluations, setPendingEvaluations] = useState(0);
  const [completedReports, setCompletedReports] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch psychologist data
        const { data: psychData, error: psychError } = await supabase
          .from('psychologists')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (psychError) {
          console.error('Error fetching psychologist data:', psychError);
        } else if (psychData) {
          setPsychologist(psychData);
          
          // Fetch applications count
          const { count: applicationsCount, error: appError } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('psychologist_id', psychData.id)
            .in('status', ['submitted', 'under_review']);
          
          if (!appError && applicationsCount !== null) {
            setActiveApplications(applicationsCount);
          }
          
          // Fetch evaluations count
          const { data: evalData, error: evalError } = await supabase
            .from('evaluations')
            .select('id, status, application:applications!inner(psychologist_id)')
            .eq('applications.psychologist_id', psychData.id)
            .in('status', ['assigned', 'in_progress']);
          
          if (!evalError && evalData) {
            setPendingEvaluations(evalData.length);
          }
          
          // Fetch completed reports count
          const { data: reportData, error: reportError } = await supabase
            .from('evaluations')
            .select('id, status, application:applications!inner(psychologist_id)')
            .eq('applications.psychologist_id', psychData.id)
            .in('status', ['submitted', 'approved']);
          
          if (!reportError && reportData) {
            setCompletedReports(reportData.length);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {profile?.name || 'Psychologist'}</h1>
      <p className="text-muted-foreground">Manage your applications and evaluations</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Job Applications</CardTitle>
            <CardDescription>Track your job applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeApplications}</div>
            <p className="text-xs text-muted-foreground">Active Applications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Evaluations</CardTitle>
            <CardDescription>Manage your evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEvaluations}</div>
            <p className="text-xs text-muted-foreground">Pending Evaluations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reports</CardTitle>
            <CardDescription>View your submitted reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReports}</div>
            <p className="text-xs text-muted-foreground">Completed Reports</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Your professional information</CardDescription>
        </CardHeader>
        <CardContent>
          {psychologist ? (
            <div className="space-y-2">
              <div>
                <span className="font-medium">Experience: </span>
                {psychologist.experience_years ? `${psychologist.experience_years} years` : 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Specialties: </span>
                {psychologist.specialties && psychologist.specialties.length > 0 
                  ? psychologist.specialties.join(', ') 
                  : 'None specified'}
              </div>
              <div>
                <span className="font-medium">Certifications: </span>
                {psychologist.certifications && psychologist.certifications.length > 0 
                  ? psychologist.certifications.join(', ') 
                  : 'None specified'}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="text-sm">Complete Your Profile</Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">Profile information not available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent platform activity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">No recent activity</p>
        </CardContent>
      </Card>
    </div>
  );
};

const Button = ({ children, variant = "default", className = "" }) => {
  return (
    <button 
      className={`px-4 py-2 rounded-md ${
        variant === "default" 
          ? "bg-psyched-darkBlue text-white hover:bg-psyched-darkBlue/90" 
          : "border border-gray-300 hover:bg-gray-100"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default PsychologistDashboard;
