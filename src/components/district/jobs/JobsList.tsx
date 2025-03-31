
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { fetchJobs, Job, deleteJob } from '@/services/jobService';
import { useToast } from '@/hooks/use-toast';
import { CreateJobDialog } from './CreateJobDialog';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { JobCard } from './JobCard';
import { JobDetailsDialog } from './JobDetailsDialog';
import { JobsFilter } from './JobsFilter';

interface JobsListProps {
  districtId: string;
}

export const JobsList: React.FC<JobsListProps> = ({ districtId }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateJobDialog, setShowCreateJobDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [jobTypeFilter, setJobTypeFilter] = useState<string | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const { toast } = useToast();

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const jobsData = await fetchJobs(districtId);
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job listings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [districtId]);

  const handleCreateJob = (job: Job) => {
    setJobs(prevJobs => [job, ...prevJobs]);
    toast({
      title: 'Job Created',
      description: 'Your job posting has been created and is pending approval.',
    });
  };

  const handleDeleteJob = async () => {
    if (!deleteJobId) return;
    
    try {
      await deleteJob(deleteJobId);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== deleteJobId));
      toast({
        title: 'Job Deleted',
        description: 'The job posting has been successfully deleted.',
      });
    } catch (error) {
      console.error('Failed to delete job:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete job posting.',
        variant: 'destructive',
      });
    } finally {
      setDeleteJobId(null);
    }
  };

  const handleViewJobDetails = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const filteredJobs = jobs
    .filter(job => !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(job => !statusFilter || job.status === statusFilter)
    .filter(job => !locationFilter || job.work_location === locationFilter)
    .filter(job => !jobTypeFilter || job.work_type === jobTypeFilter);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Listings</h2>
        <Button onClick={() => setShowCreateJobDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>
      
      <JobsFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        jobTypeFilter={jobTypeFilter}
        setJobTypeFilter={setJobTypeFilter}
      />
      
      {filteredJobs.length === 0 ? (
        <EmptyState
          title="No job listings found"
          description="No job listings match your criteria. Try adjusting your filters or create your first job."
          icon={<Filter className="h-10 w-10" />}
          action={
            <Button onClick={() => setShowCreateJobDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Job
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={handleViewJobDetails}
              onDelete={(jobId) => setDeleteJobId(jobId)}
            />
          ))}
        </div>
      )}
      
      <CreateJobDialog
        open={showCreateJobDialog}
        onOpenChange={setShowCreateJobDialog}
        districtId={districtId}
        onJobCreated={handleCreateJob}
      />

      <ConfirmDeleteDialog
        open={!!deleteJobId}
        onOpenChange={() => setDeleteJobId(null)}
        title="Delete Job"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        onConfirm={handleDeleteJob}
      />
      
      <JobDetailsDialog
        job={selectedJob}
        open={showJobDetails}
        onOpenChange={setShowJobDetails}
      />
    </div>
  );
};
