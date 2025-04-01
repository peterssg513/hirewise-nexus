
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobCard } from '@/components/psychologist/jobs/JobCard';
import { JobDetailsDialog } from '@/components/psychologist/jobs/JobDetailsDialog';
import { JobsFilter } from '@/components/psychologist/jobs/JobsFilter';
import { JobsSkeletonLoader } from '@/components/psychologist/jobs/JobsSkeletonLoader';
import { NoJobsFound } from '@/components/psychologist/jobs/NoJobsFound';
import { useJobApplications } from '@/contexts/JobApplicationContext';
import { Job } from '@/components/psychologist/jobs/JobCard';

interface AvailableJobsProps {
  searchQuery: string;
  selectedSkills: string[];
  setSearchQuery: (query: string) => void;
  setSelectedSkills: (skills: string[]) => void;
}

export const AvailableJobs: React.FC<AvailableJobsProps> = ({
  searchQuery,
  selectedSkills,
  setSearchQuery,
  setSelectedSkills
}) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { applyForJob, isApplying, hasAppliedToJob, getApplicationForJob } = useJobApplications();

  // Fetch active jobs with district information
  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['active-jobs'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('jobs').select(`
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
        `).eq('status', 'active');
      if (error) throw error;

      // Transform the data to match the Job interface
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
      const matchesSearch = searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.district_name.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesSkills = selectedSkills.length === 0 || 
        job.skills_required && selectedSkills.every(skill => job.skills_required.includes(skill));
        
      return matchesSearch && matchesSkills;
    });
  }, [jobs, searchQuery, selectedSkills]);

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
          <button className="mt-4 px-4 py-2 border rounded hover:bg-gray-100" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
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
          <NoJobsFound hasFilters={hasFilters} onClearFilters={clearFilters} />
        ) : (
          filteredJobs?.map(job => {
            const hasApplied = hasAppliedToJob(job.id);
            const application = getApplicationForJob(job.id);
            
            return (
              <JobCard 
                key={job.id} 
                job={job} 
                onViewDetails={setSelectedJob} 
                onApply={applyForJob} 
                isApplying={isApplying && selectedJob?.id === job.id}
                hasApplied={hasApplied}
                applicationStatus={application?.status}
              />
            );
          })
        )}
      </div>
      
      <JobDetailsDialog 
        job={selectedJob} 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        onApply={applyForJob} 
        isApplying={isApplying}
        hasApplied={selectedJob ? hasAppliedToJob(selectedJob.id) : false}
        applicationStatus={selectedJob ? getApplicationForJob(selectedJob.id)?.status : undefined}
      />
    </>
  );
};
