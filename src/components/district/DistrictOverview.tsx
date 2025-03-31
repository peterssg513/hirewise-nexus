
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Calendar, MapPin, Plus, School, Users, FileText } from 'lucide-react';
import { District } from '@/types/district';

interface DistrictOverviewProps {
  district: District;
  jobsCount: {
    active: number;
    pending: number;
    total: number;
  };
  schoolsCount: number;
}

export const DistrictOverview: React.FC<DistrictOverviewProps> = ({
  district,
  jobsCount,
  schoolsCount
}) => {
  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Welcome, {district.name}</CardTitle>
            <CardDescription>
              {district.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {district.location}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage your district's resources, post jobs, and request evaluations from your dashboard.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Job Postings</CardTitle>
            <CardDescription>
              <div className="flex items-center text-sm">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Current job statistics
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                  Active Jobs
                </span>
                <span className="font-medium">{jobsCount.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  Pending Approval
                </span>
                <span className="font-medium">{jobsCount.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Job Posts</span>
                <span className="font-medium">{jobsCount.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resources</CardTitle>
            <CardDescription>
              Quick links to manage district resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm flex items-center">
                  <School className="h-3.5 w-3.5 mr-1 text-blue-500" />
                  Schools
                </span>
                <span className="font-medium">{schoolsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1 text-purple-500" />
                  Students
                </span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                  Evaluations
                </span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90">
              <Plus className="mr-2 h-4 w-4" /> Post New Job
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Request Evaluation
            </Button>
            <Button variant="outline">
              <School className="mr-2 h-4 w-4" /> Add School
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
