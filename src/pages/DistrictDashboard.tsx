
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import DistrictNavigation from '@/components/district/DistrictNavigation';
import { StudentsList } from '@/components/district/students/StudentsList';
import { SchoolsList } from '@/components/district/schools/SchoolsList';
import { JobsList } from '@/components/district/JobsList';
import { EvaluationsList } from '@/components/district/EvaluationsList';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDistrictProfile } from '@/services/districtProfileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const DistrictDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const getDistrictProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const districtProfile = await fetchDistrictProfile(user.id);
        
        if (districtProfile) {
          setDistrictId(districtProfile.id);
        } else {
          toast({
            title: "Error loading district profile",
            description: "Could not find your district profile. Please contact support.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching district profile:', error);
        toast({
          title: "Error loading district profile",
          description: "Failed to load your district information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    getDistrictProfile();
  }, [user, toast]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!districtId) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold mb-4">District Profile Not Found</h2>
        <p className="text-muted-foreground">
          We couldn't find your district profile. Please contact support for assistance.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">District Dashboard</h1>
      </div>
      
      <Tabs defaultValue="dashboard" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Welcome to Your District Dashboard</h2>
              <p className="text-muted-foreground">
                This is your central hub for managing your district's resources, jobs, and evaluations.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium">Quick Actions</h3>
                <ul className="mt-2 space-y-1">
                  <li>Post a new job</li>
                  <li>Request an evaluation</li>
                  <li>Add a school</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium">Recent Activity</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  No recent activity to display.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium">Status</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Jobs:</span>
                    <span className="text-sm font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Evaluations:</span>
                    <span className="text-sm font-medium">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs">
          <JobsList districtId={districtId} />
        </TabsContent>
        
        <TabsContent value="schools">
          <SchoolsList districtId={districtId} />
        </TabsContent>
        
        <TabsContent value="students">
          <StudentsList districtId={districtId} />
        </TabsContent>
        
        <TabsContent value="evaluations">
          <EvaluationsList districtId={districtId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistrictDashboard;
