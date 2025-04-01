
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/components/psychologist/jobs/JobCard';

interface JobApplication {
  id: string;
  status: string;
  created_at: string;
  job_id: string;
  job: Job | null;
}

interface JobApplicationContextType {
  isApplying: boolean;
  applications: JobApplication[];
  isApplicationsLoading: boolean;
  applicationsError: Error | null;
  applyForJob: (jobId: string) => Promise<void>;
  hasAppliedToJob: (jobId: string) => boolean;
  getApplicationForJob: (jobId: string) => JobApplication | undefined;
  refetchApplications: () => void;
}

const JobApplicationContext = createContext<JobApplicationContextType | undefined>(undefined);

export const JobApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isApplying, setIsApplying] = useState(false);

  // Fetch user's job applications
  const {
    data: applications = [],
    isLoading: isApplicationsLoading,
    error: applicationsError,
    refetch: refetchApplications
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
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match expected structure
      return data.map(app => ({
        id: app.id,
        status: app.status,
        created_at: app.created_at,
        job_id: app.job_id,
        job: app.jobs ? {
          id: app.jobs.id,
          title: app.jobs.title,
          district_name: app.jobs.districts?.name || 'Unknown District',
          district_location: app.jobs.districts?.location || '',
          description: app.jobs.description,
          skills_required: app.jobs.skills_required || [],
          location: app.jobs.location || (app.jobs.city && app.jobs.state ? `${app.jobs.city}, ${app.jobs.state}` : ''),
          timeframe: app.jobs.timeframe || '',
          status: app.jobs.status,
          created_at: app.jobs.created_at,
          work_type: app.jobs.work_type || '',
          work_location: app.jobs.work_location || '',
          languages_required: app.jobs.languages_required || [],
          qualifications: app.jobs.qualifications || [],
          benefits: app.jobs.benefits || [],
          city: app.jobs.city || '',
          state: app.jobs.state || '',
          country: app.jobs.country || 'USA'
        } : null
      }));
    }
  });

  // Apply for job mutation
  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { data, error } = await supabase.rpc('apply_to_job', {
        _job_id: jobId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
        variant: "default"
      });
      // Refetch applications to update the list
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
    onError: (error: Error) => {
      console.error('Error applying for job:', error);
      // Check if it's already applied error
      if (error.message.includes('already applied')) {
        toast({
          title: "Already applied",
          description: "You have already applied for this job.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error submitting application",
          description: error.message || "An error occurred while submitting your application.",
          variant: "destructive"
        });
      }
    }
  });

  // Apply for job function
  const applyForJob = useCallback(async (jobId: string) => {
    if (isApplying) return; // Prevent multiple submissions
    
    setIsApplying(true);
    try {
      await applyMutation.mutateAsync(jobId);
    } finally {
      setIsApplying(false);
    }
  }, [isApplying, applyMutation]);

  // Check if user has already applied for a job
  const hasAppliedToJob = useCallback((jobId: string) => {
    return applications.some(app => app.job_id === jobId);
  }, [applications]);
  
  // Get application for specific job
  const getApplicationForJob = useCallback((jobId: string) => {
    return applications.find(app => app.job_id === jobId);
  }, [applications]);

  const value = {
    isApplying,
    applications,
    isApplicationsLoading,
    applicationsError: applicationsError as Error | null,
    applyForJob,
    hasAppliedToJob,
    getApplicationForJob,
    refetchApplications
  };

  return (
    <JobApplicationContext.Provider value={value}>
      {children}
    </JobApplicationContext.Provider>
  );
};

export const useJobApplications = () => {
  const context = useContext(JobApplicationContext);
  if (context === undefined) {
    throw new Error('useJobApplications must be used within a JobApplicationProvider');
  }
  return context;
};
