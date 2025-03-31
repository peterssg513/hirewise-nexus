
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Calendar, MapPin, Plus, School, Users, FileText, Briefcase, Award } from 'lucide-react';
import { District } from '@/types/district';
import { useNavigate } from 'react-router-dom';

interface DistrictOverviewProps {
  district: District;
  jobsCount: {
    active: number;
    pending: number;
    offered?: number;
    accepted?: number;
    total: number;
  };
  schoolsCount: number;
  evaluationsCount?: number;
}

export const DistrictOverview: React.FC<DistrictOverviewProps> = ({
  district,
  jobsCount,
  schoolsCount,
  evaluationsCount = 0
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Jobs</CardTitle>
            <CardDescription>
              <div className="flex items-center text-sm">
                <Briefcase className="h-3.5 w-3.5 mr-1" />
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
              {jobsCount.offered !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1 text-blue-500" />
                    Offered
                  </span>
                  <span className="font-medium">{jobsCount.offered}</span>
                </div>
              )}
              {jobsCount.accepted !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm flex items-center">
                    <Award className="h-3.5 w-3.5 mr-1 text-purple-500" />
                    Accepted
                  </span>
                  <span className="font-medium">{jobsCount.accepted}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm">Total Job Posts</span>
                <span className="font-medium">{jobsCount.total}</span>
              </div>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs mt-2"
              onClick={() => navigate('/district-dashboard/jobs')}
            >
              View all jobs
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Schools</CardTitle>
            <CardDescription>
              <div className="flex items-center text-sm">
                <School className="h-3.5 w-3.5 mr-1" />
                District schools
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Schools</span>
              <span className="text-2xl font-bold">{schoolsCount}</span>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs mt-2"
              onClick={() => navigate('/district-dashboard/schools')}
            >
              Manage schools
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Evaluations</CardTitle>
            <CardDescription>
              <div className="flex items-center text-sm">
                <FileText className="h-3.5 w-3.5 mr-1" />
                Evaluation requests
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Evaluations</span>
              <span className="text-2xl font-bold">{evaluationsCount}</span>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs mt-2"
              onClick={() => navigate('/district-dashboard/evaluations')}
            >
              Manage evaluations
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
