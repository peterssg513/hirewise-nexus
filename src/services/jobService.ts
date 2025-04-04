
import { supabase } from '@/integrations/supabase/client';
import { WORK_TYPES } from './stateSalaryService';

export interface Job {
  id: string;
  district_id: string;
  school_id?: string;
  title: string;
  description: string;
  city?: string;
  state?: string;
  country?: string;
  work_location?: string;
  work_type?: string;
  qualifications?: string[];
  benefits?: string[];
  languages_required?: string[];
  salary_range?: string;
  status: string;
  created_at?: string;
}

// Common Job Constants
export const JOB_TITLES = [
  "School Psychologist",
  "Bilingual School Psychologist",
  "Lead School Psychologist",
  "Psychologist Evaluator",
  "School Psychology Specialist",
  "Educational Psychologist",
  "Clinical School Psychologist"
];

// Re-export WORK_TYPES from stateSalaryService to maintain compatibility
export { WORK_TYPES };

export const DEFAULT_BENEFITS = [
  "Competitive Salary",
  "Health Insurance",
  "Dental Insurance",
  "Vision Insurance",
  "Retirement Plan",
  "Paid Time Off",
  "Professional Development"
];

export const TOP_LANGUAGES = [
  "Spanish",
  "Chinese (Mandarin)",
  "Vietnamese",
  "Arabic",
  "Tagalog",
  "Korean",
  "Russian",
  "Haitian Creole",
  "Portuguese",
  "French",
  "Hindi",
  "Urdu",
  "Bengali",
  "Gujarati",
  "Punjabi",
  "Japanese"
];

// Fetch jobs for a district
export const fetchJobs = async (districtId: string): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('district_id', districtId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Job[];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

// Create a new job
export const createJob = async (jobData: Partial<Job>): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...jobData, status: 'Open' }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Job;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Update a job
export const updateJob = async (id: string, jobData: Partial<Job>): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(jobData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Job;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// Get job by id
export const getJobById = async (id: string): Promise<Job | null> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Job;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
};

// Fetch applications for a job
export const fetchJobApplications = async (jobId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        psychologists:psychologist_id (
          id,
          experience_years,
          certifications,
          specialties,
          city,
          state,
          profiles:user_id (
            name,
            email,
            profile_picture_url
          )
        )
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return [];
  }
};
