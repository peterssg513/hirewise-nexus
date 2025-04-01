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
  work_location?: string;
  work_type?: string;
  timeframe?: string;
  skills_required?: string[];
  qualifications?: string[];
  benefits?: string[];
  documents_required?: string[];
  languages_required?: string[];
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
  work_location?: string;
  work_type?: string;
  timeframe?: string;
  skills_required?: string[];
  qualifications?: string[];
  benefits?: string[];
  documents_required?: string[];
  languages_required?: string[];
}

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Per diem"
];

export const JOB_STATUSES = [
  "pending",
  "active",
  "offered",
  "accepted",
  "closed"
];

export const JOB_TITLES = [
  "School Psychologist",
  "Bilingual School Psychologist",
  "Early Intervention School Psychologist",
  "Licensed Specialist in School Psychology (LSSP)",
  "Educational Diagnostician",
  "School Psychological Examiner",
  "School Psychometrist",
  "Consulting Psychologist"
];

export const WORK_TYPES = [
  "Full Time", 
  "Part Time", 
  "As Needed"
];

export const DEFAULT_BENEFITS = [
  "Health, dental, and vision insurance",
  "Paid Sick Time",
  "Online resources, NASP approved webinars, therapy ideas and free CEUs",
  "Health & Wellness Stipend",
  "401(k)"
];

export const TOP_LANGUAGES = [
  "English",
  "Spanish",
  "Chinese (Mandarin/Cantonese)",
  "Tagalog",
  "Vietnamese",
  "Arabic",
  "French",
  "Korean",
  "Russian",
  "German",
  "Haitian Creole",
  "Hindi",
  "Portuguese",
  "Italian",
  "Polish",
  "Urdu",
  "Japanese",
  "Persian (Farsi)",
  "Gujarati",
  "Bengali"
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
    // Set default status to 'pending' for admin approval and include default benefits
    const jobWithDefaults = {
      ...jobData,
      status: 'pending',
      benefits: jobData.benefits || DEFAULT_BENEFITS
    };
    
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobWithDefaults)
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
