
import { supabase } from '@/integrations/supabase/client';

export interface Job {
  id: string;
  title: string;
  description: string;
  district_id: string;
  school_id?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  salary?: number;
  job_type?: string;
  timeframe?: string;
  skills_required?: string[];
  qualifications?: string[];
  benefits?: string[];
  documents_required?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJobParams {
  title: string;
  description: string;
  district_id: string;
  school_id?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  salary?: number;
  job_type?: string;
  timeframe?: string;
  skills_required?: string[];
  qualifications?: string[];
  documents_required?: string[];
}

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Per diem"
];

/**
 * Fetches all jobs for a district
 */
export const fetchJobs = async (districtId: string): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('district_id', districtId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Fetches all jobs for a specific school
 */
export const fetchJobsBySchool = async (schoolId: string): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching jobs by school:', error);
    throw error;
  }
};

/**
 * Fetch a single job by ID
 */
export const fetchJobById = async (jobId: string): Promise<Job | null> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

/**
 * Creates a new job
 */
export const createJob = async (jobData: CreateJobParams): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

/**
 * Updates an existing job
 */
export const updateJob = async (jobId: string, jobData: Partial<Job>): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

/**
 * Deletes a job
 */
export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

/**
 * Fetches applications for a job
 */
export const fetchJobApplications = async (jobId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        notes,
        documents_urls,
        created_at,
        psychologist_id,
        psychologists:psychologists!inner(
          id,
          user_id,
          profiles:profiles!inner(
            name
          ),
          experience_years,
          certifications,
          specialties,
          evaluation_types,
          work_types,
          desired_locations,
          city,
          state,
          open_to_relocation
        )
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

/**
 * Approves or rejects an application
 */
export const updateApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) throw error;
  } catch (error) {
    console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} application:`, error);
    throw error;
  }
};
