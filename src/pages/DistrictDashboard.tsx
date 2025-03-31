
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import DistrictNavigation from '@/components/district/DistrictNavigation';
import { StudentsList } from '@/components/district/students/StudentsList';
import { SchoolsList } from '@/components/district/schools/SchoolsList';
import { JobsList } from '@/components/district/JobsList';
import { EvaluationsList } from '@/components/district/EvaluationsList';

const DistrictDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
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
          <JobsList />
        </TabsContent>
        
        <TabsContent value="schools">
          <SchoolsList />
        </TabsContent>
        
        <TabsContent value="students">
          <StudentsList />
        </TabsContent>
        
        <TabsContent value="evaluations">
          <EvaluationsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistrictDashboard;
