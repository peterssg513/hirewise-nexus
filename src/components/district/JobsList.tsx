import React, { useState, useEffect } from 'react';
import { Job, fetchJobs, deleteJob, JOB_TYPES } from '@/services/jobService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Building, Calendar, DollarSign, Edit, Plus, Trash, AlertTriangle, FileText, Eye, CheckCircle, Clock, Briefcase } from 'lucide-react';
import { CreateJobDialog } from './CreateJobDialog';
import { EditJobDialog } from './EditJobDialog';
import { JobDetailsDialog } from './JobDetailsDialog';
import { fetchSchoolById } from '@/services/schoolService';
import { SearchFilterBar } from './SearchFilterBar';
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
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, [districtId]);

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

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

  const confirmDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      await deleteJob(jobToDelete.id);
      setJobs(prev => prev.filter(job => job.id !== jobToDelete.id));
      toast({
        title: 'Job deleted',
        description: `${jobToDelete.title} has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Failed to delete job:', error);
      toast({
        title: 'Error deleting job',
        description: 'Failed to delete job. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = jobs.filter(job => 
      job.title.toLowerCase().includes(lowerCaseSearch) || 
      job.description.toLowerCase().includes(lowerCaseSearch) ||
      (job.location && job.location.toLowerCase().includes(lowerCaseSearch)) ||
      (job.city && job.city.toLowerCase().includes(lowerCaseSearch)) ||
      (job.state && job.state.toLowerCase().includes(lowerCaseSearch))
    );
    
    setFilteredJobs(filtered);
  };

  const handleFilter = (filterValue: string) => {
    if (!filterValue) {
      setFilteredJobs(jobs);
      return;
    }
    
    const filtered = jobs.filter(job => 
      job.status === filterValue || job.job_type === filterValue
    );
    
    setFilteredJobs(filtered);
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

  const filterOptions = [
    { value: "active", label: "Active Jobs" },
    { value: "pending", label: "Pending Jobs" },
    ...JOB_TYPES.map(type => ({ value: type, label: type }))
  ];

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

      <SearchFilterBar 
        placeholder="Search jobs by title, description, location..."
        filterOptions={filterOptions}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.length === 0 ? (
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
            filteredJobs.map((job) => (
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
                    onClick={() => confirmDeleteJob(job)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the job listing{' '}
              <span className="font-semibold">{jobToDelete?.title}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteJob} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
