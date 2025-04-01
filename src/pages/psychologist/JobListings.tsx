
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { JobCard, Job } from '@/components/psychologist/jobs/JobCard';
import { JobDetailsDialog } from '@/components/psychologist/jobs/JobDetailsDialog';
import { JobsFilter } from '@/components/psychologist/jobs/JobsFilter';
import { JobsSkeletonLoader } from '@/components/psychologist/jobs/JobsSkeletonLoader';
import { NoJobsFound } from '@/components/psychologist/jobs/NoJobsFound';

const JobListings = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  
  // Fetch active jobs with district information - ensure we select all needed fields
  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ['active-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          description,
          skills_required,
          location,
          timeframe,
          status,
          created_at,
          work_type,
          work_location,
          languages_required,
          qualifications,
          benefits,
          city,
          state,
          country,
          district_id,
          districts (
            id,
            name,
            location
          )
        `)
        .eq('status', 'active');
      
      if (error) throw error;
      
      // Transform the data to match the Job interface and handle potential null values
      return data.map(job => ({
        id: job.id,
        title: job.title,
        district_name: job.districts?.name || 'Unknown District',
        district_location: job.districts?.location || '',
        description: job.description,
        skills_required: job.skills_required || [],
        location: job.location || (job.city && job.state ? `${job.city}, ${job.state}` : ''),
        timeframe: job.timeframe || '',
        status: job.status,
        created_at: job.created_at,
        work_type: job.work_type || '',
        work_location: job.work_location || '',
        languages_required: job.languages_required || [],
        qualifications: job.qualifications || [],
        benefits: job.benefits || [],
        city: job.city || '',
        state: job.state || '',
        country: job.country || 'USA'
      }));
    }
  });
  
  // Filter jobs based on search and skills
  const filteredJobs = React.useMemo(() => {
    return jobs?.filter(job => {
      const matchesSearch = 
        searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.district_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSkills = 
        selectedSkills.length === 0 || 
        (job.skills_required && selectedSkills.every(skill => job.skills_required.includes(skill)));
      
      return matchesSearch && matchesSkills;
    });
  }, [jobs, searchQuery, selectedSkills]);
  
  // Apply for job
  const handleApplyForJob = async (jobId: string) => {
    if (isApplying) return; // Prevent multiple clicks
    
    setIsApplying(true);
    try {
      // Call the apply_to_job RPC function
      const { data, error } = await supabase.rpc('apply_to_job', {
        _job_id: jobId
      });
      
      if (error) throw error;
      
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
        variant: "default"
      });
      
      // Close the dialog if open
      setSelectedJob(null);
      
      // Refresh jobs list to update applied status if needed
      refetch();
    } catch (error: any) {
      console.error('Error applying for job:', error);
      toast({
        title: "Error submitting application",
        description: error.message || "An error occurred while submitting your application.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  // Extract all unique skills from jobs for filtering
  const allSkills = React.useMemo(() => {
    if (!jobs) return [];
    const skillsSet = new Set<string>();
    jobs.forEach(job => {
      if (job.skills_required) {
        job.skills_required.forEach(skill => skillsSet.add(skill));
      }
    });
    return Array.from(skillsSet);
  }, [jobs]);
  
  const clearFilters = () => {
    setSelectedSkills([]);
    setSearchQuery('');
  };
  
  const hasFilters = selectedSkills.length > 0 || searchQuery !== '';
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-500">Error loading jobs</h3>
          <p className="text-muted-foreground">{(error as Error).message}</p>
          <button 
            className="mt-4 px-4 py-2 border rounded hover:bg-gray-100"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Job Listings</h1>
        <p className="text-gray-600">Find and apply for school psychology positions</p>
      </div>
      
      <JobsFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
        allSkills={allSkills}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <JobsSkeletonLoader />
        ) : filteredJobs?.length === 0 ? (
          <NoJobsFound 
            hasFilters={hasFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          filteredJobs?.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={setSelectedJob}
              onApply={handleApplyForJob}
              isApplying={isApplying && selectedJob?.id === job.id}
            />
          ))
        )}
      </div>
      
      <JobDetailsDialog
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={handleApplyForJob}
        isApplying={isApplying}
      />
    </div>
  );
};

export default JobListings;
