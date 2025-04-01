
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
  const [activeTab, setActiveTab] = useState('available');

  // Fetch active jobs with district information - ensure we select all needed fields
  const {
    data: jobs,
    isLoading: isJobsLoading,
    error: jobsError,
    refetch
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
      const matchesSearch = searchQuery === '' || job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.description.toLowerCase().includes(searchQuery.toLowerCase()) || job.district_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSkills = selectedSkills.length === 0 || job.skills_required && selectedSkills.every(skill => job.skills_required.includes(skill));
      return matchesSearch && matchesSkills;
    });
  }, [jobs, searchQuery, selectedSkills]);

  // Apply for job
  const handleApplyForJob = async (jobId: string) => {
    if (isApplying) return; // Prevent multiple clicks

    setIsApplying(true);
    try {
      // Call the apply_to_job RPC function
      const {
        data,
        error
      } = await supabase.rpc('apply_to_job', {
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

  // Fetch user's job applications
  const {
    data: myApplications,
    isLoading: isApplicationsLoading,
    error: applicationsError
  } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          created_at,
          job_id,
          jobs (
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
            district_id,
            districts (
              id,
              name,
              location
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match the expected structure
      return data.map(app => ({
        id: app.id,
        status: app.status,
        created_at: app.created_at,
        job: app.jobs ? {
          id: app.jobs.id,
          title: app.jobs.title,
          district_name: app.jobs.districts?.name || 'Unknown District',
          district_location: app.jobs.districts?.location || '',
          description: app.jobs.description,
          skills_required: app.jobs.skills_required || [],
          location: app.jobs.location || '',
          timeframe: app.jobs.timeframe || '',
          status: app.jobs.status,
          created_at: app.jobs.created_at,
          work_type: app.jobs.work_type || '',
          work_location: app.jobs.work_location || ''
        } : null
      }));
    }
  });

  if (jobsError) {
    return <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-500">Error loading jobs</h3>
          <p className="text-muted-foreground">{(jobsError as Error).message}</p>
          <button className="mt-4 px-4 py-2 border rounded hover:bg-gray-100" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 mb-4">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 px-1 relative ${
              activeTab === 'available' 
                ? 'text-psyched-lightBlue font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Available Jobs
            {activeTab === 'available' && (
              <span className="absolute -bottom-px left-0 w-full h-0.5 bg-psyched-lightBlue"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-2 px-1 relative ${
              activeTab === 'applications' 
                ? 'text-psyched-lightBlue font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Applications
            {activeTab === 'applications' && (
              <span className="absolute -bottom-px left-0 w-full h-0.5 bg-psyched-lightBlue"></span>
            )}
          </button>
        </div>
      </div>
      
      {activeTab === 'available' && (
        <>
          <JobsFilter 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            selectedSkills={selectedSkills} 
            setSelectedSkills={setSelectedSkills} 
            allSkills={allSkills} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {isJobsLoading ? (
              <JobsSkeletonLoader />
            ) : filteredJobs?.length === 0 ? (
              <NoJobsFound hasFilters={hasFilters} onClearFilters={clearFilters} />
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
        </>
      )}
      
      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isApplicationsLoading ? (
            <div className="col-span-full flex justify-center py-16">
              <div className="animate-pulse space-y-4">
                <div className="h-7 bg-gray-200 rounded w-64"></div>
                <div className="h-24 bg-gray-200 rounded w-96"></div>
              </div>
            </div>
          ) : myApplications?.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700">No Applications Found</h3>
              <p className="text-gray-500 mt-2">You haven't applied to any jobs yet.</p>
              <button 
                className="mt-4 px-4 py-2 text-psyched-lightBlue hover:underline"
                onClick={() => setActiveTab('available')}
              >
                Browse Available Jobs
              </button>
            </div>
          ) : (
            myApplications?.map(application => (
              <div key={application.id} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">{application.job?.title}</h3>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      application.status === 'offered' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'accepted' ? 'bg-purple-100 text-purple-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{application.job?.district_name}</p>
                  <p className="text-xs text-gray-500 mt-1">Applied on {new Date(application.created_at).toLocaleDateString()}</p>
                  <p className="line-clamp-2 text-sm text-gray-700 mt-2">{application.job?.description}</p>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t flex justify-end">
                  <button 
                    className="text-sm text-psyched-lightBlue hover:underline"
                    onClick={() => setSelectedJob(application.job)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
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
