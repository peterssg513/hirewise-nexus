
import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/district/jobs/JobCard';
import { JobsFilter } from '@/components/district/jobs/JobsFilter';
import { CreateJobDialog } from '@/components/district/jobs/CreateJobDialog';
import { JobDetailsDialog } from '@/components/district/jobs/JobDetailsDialog';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { useToast } from '@/hooks/use-toast';
import { Job, fetchJobs, deleteJob } from '@/services/jobService';

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
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Load jobs data
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

  // Apply filters whenever filter states change
  useEffect(() => {
    if (!jobs.length) return;

    let result = [...jobs];

    // Apply search term filter
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

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(job => job.status === statusFilter);
    }

    // Apply location filter
    if (locationFilter && locationFilter !== 'all') {
      result = result.filter(job => job.work_location === locationFilter);
    }

    // Apply job type filter
    if (jobTypeFilter && jobTypeFilter !== 'all') {
      result = result.filter(job => job.work_type === jobTypeFilter);
    }

    setFilteredJobs(result);
  }, [jobs, searchTerm, statusFilter, locationFilter, jobTypeFilter]);

  const handleJobCreated = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
    toast({
      title: 'Success',
      description: 'Job created successfully!',
    });
  };

  const handleViewJob = (job: Job) => {
    setJobToView(job);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      setIsDeleting(true);
      await deleteJob(jobToDelete);
      setJobs(prev => prev.filter(job => job.id !== jobToDelete));
      toast({
        title: 'Success',
        description: 'Job deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete job. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setJobToDelete(null);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Job Listings</h2>
        <Button onClick={() => setCreateJobDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Job
        </Button>
      </div>

      {/* Filters */}
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

      {/* Jobs grid */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={<Filter className="h-10 w-10 text-muted-foreground" />}
          title="No jobs found"
          description="No jobs match your search criteria. Try adjusting your filters or create a new job."
          action={
            <Button onClick={() => setCreateJobDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create New Job
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onView={handleViewJob}
              onDelete={setJobToDelete}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateJobDialog
        open={createJobDialogOpen}
        onOpenChange={setCreateJobDialogOpen}
        districtId={districtId}
        onJobCreated={handleJobCreated}
      />

      {jobToView && (
        <JobDetailsDialog
          open={!!jobToView}
          onOpenChange={() => setJobToView(null)}
          job={jobToView}
        />
      )}

      <ConfirmDeleteDialog
        open={!!jobToDelete}
        onOpenChange={() => setJobToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
      />
    </div>
  );
};
