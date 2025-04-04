
import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/district/jobs/JobCard';
import { CreateJobDialog } from '@/components/district/jobs/CreateJobDialog';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { JobDetailsDialog } from '@/components/district/jobs/JobDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import { Job, fetchJobs, deleteJob } from '@/services/jobService';
import { JobsFilter } from '@/components/district/jobs/JobsFilter';

interface JobsListProps {
  districtId: string;
}

export const JobsList: React.FC<JobsListProps> = ({ districtId }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [jobTypeFilter, setJobTypeFilter] = useState<string | null>(null);
  const [createJobDialogOpen, setCreateJobDialogOpen] = useState(false);
  const [jobToView, setJobToView] = useState<Job | null>(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const jobsData = await fetchJobs(districtId);
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error('Error loading jobs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load jobs. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (districtId) {
      loadJobs();
    }
  }, [districtId, toast]);

  useEffect(() => {
    if (!jobs.length) return;

    let result = [...jobs];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        job => 
          job.title.toLowerCase().includes(term) ||
          job.description.toLowerCase().includes(term) ||
          (job.city && job.city.toLowerCase().includes(term)) ||
          (job.state && job.state.toLowerCase().includes(term))
      );
    }

    if (statusFilter) {
      result = result.filter(job => job.status === statusFilter);
    }

    if (locationFilter) {
      result = result.filter(job => job.work_location === locationFilter);
    }

    if (jobTypeFilter) {
      result = result.filter(job => job.work_type === jobTypeFilter);
    }

    setFilteredJobs(result);
  }, [jobs, searchTerm, statusFilter, locationFilter, jobTypeFilter]);

  const handleCreateJob = (job: Job) => {
    setJobs([job, ...jobs]);
    toast({
      title: 'Job Created',
      description: 'Your job posting has been created and is pending approval.',
    });
  };

  const handleViewJob = (job: Job) => {
    setJobToView(job);
    setJobDetailsOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      await deleteJob(jobToDelete);
      setJobs(jobs.filter(job => job.id !== jobToDelete));
      toast({
        title: 'Job Deleted',
        description: 'The job posting has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete job. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setJobToDelete(null);
    }
  };

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
        <Button onClick={() => setCreateJobDialogOpen(true)}>
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
          icon={<Filter className="h-10 w-10 text-muted-foreground" />}
          actionLabel="Create Job"
          onAction={() => setCreateJobDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job}
              onView={handleViewJob}
              onDelete={(id) => setJobToDelete(id)}
            />
          ))}
        </div>
      )}
      
      <CreateJobDialog
        open={createJobDialogOpen}
        onOpenChange={setCreateJobDialogOpen}
        districtId={districtId}
        onJobCreated={handleCreateJob}
      />

      {jobToView && (
        <JobDetailsDialog
          job={jobToView}
          open={jobDetailsOpen}
          onOpenChange={setJobDetailsOpen}
        />
      )}

      <ConfirmDeleteDialog
        open={!!jobToDelete}
        onOpenChange={() => setJobToDelete(null)}
        title="Delete Job"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        onConfirm={handleDeleteJob}
      />
    </div>
  );
};
