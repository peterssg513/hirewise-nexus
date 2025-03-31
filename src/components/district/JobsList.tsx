import React, { useState, useEffect } from 'react';
import { Job, fetchJobs, deleteJob } from '@/services/jobService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Building, Calendar, DollarSign, Edit, Plus, Trash, AlertTriangle, FileText, Eye, CheckCircle, Clock, Briefcase } from 'lucide-react';
import { CreateJobDialog } from './CreateJobDialog';
import { EditJobDialog } from './EditJobDialog';
import { JobDetailsDialog } from './JobDetailsDialog';
import { fetchSchoolById } from '@/services/schoolService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

interface JobsListProps {
  districtId: string;
}

export const JobsList: React.FC<JobsListProps> = ({ districtId }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, [districtId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await fetchJobs(districtId);
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      toast({
        title: 'Error loading jobs',
        description: 'Failed to load jobs. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs(prev => [...prev, newJob]);
    toast({
      title: 'Job created',
      description: `${newJob.title} has been created successfully.`,
    });
  };

  const handleJobUpdated = (updatedJob: Job) => {
    setJobs(prev => prev.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    ));
    toast({
      title: 'Job updated',
      description: `${updatedJob.title} has been updated successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full text-xs">
            {status}
          </div>
        );
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Job Listings</h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Job
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No job listings</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new job listing.</p>
              <div className="mt-6">
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Job
                </Button>
              </div>
            </div>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg cursor-pointer hover:text-psyched-darkBlue" onClick={() => setSelectedJob(job)}>
                      {job.title}
                    </CardTitle>
                    {getStatusBadge(job.status)}
                  </div>
                  <CardDescription>
                    {job.location || (job.city && job.state) ? (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        {job.location || `${job.city}, ${job.state}`}
                      </div>
                    ) : null}

                    {job.timeframe && (
                      <div className="flex items-center text-sm mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        {job.timeframe}
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {job.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-psyched-darkBlue hover:text-psyched-darkBlue hover:bg-psyched-darkBlue/10"
                    onClick={() => setSelectedJob(job)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingJob(job)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteJob(job.id)}
                  >
                    <Trash className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      <CreateJobDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        districtId={districtId}
        onJobCreated={handleJobCreated}
      />

      {editingJob && (
        <EditJobDialog
          open={!!editingJob}
          onOpenChange={(isOpen) => !isOpen && setEditingJob(null)}
          job={editingJob}
          onJobUpdated={handleJobUpdated}
        />
      )}

      {selectedJob && (
        <JobDetailsDialog
          open={!!selectedJob}
          onOpenChange={(isOpen) => !isOpen && setSelectedJob(null)}
          job={selectedJob}
          onJobUpdated={handleJobUpdated}
        />
      )}
    </>
  );
};
