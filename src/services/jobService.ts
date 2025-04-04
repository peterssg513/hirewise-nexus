
import { supabase } from '@/integrations/supabase/client';

export interface Job {
  id: string;
  district_id: string;
  title: string;
  description: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  school_id?: string;
  city?: string;
  state?: string;
  country?: string;
  work_location?: string;
  work_type?: string;
  qualifications?: string[];
  benefits?: string[];
  languages_required?: string[];
  documents_required?: string[];
  salary?: number;
  location?: string;
  timeframe?: string;
  job_type?: string;
  skills_required?: string[];
  district_name?: string;
  district_location?: string;
}

export interface CreateJobParams {
  title: string;
  description: string;
  district_id: string;
  school_id?: string;
  city?: string;
  state?: string;
  country?: string;
  work_location?: string;
  work_type?: string;
  qualifications?: string[];
  benefits?: string[];
  languages_required?: string[];
  salary?: number;
  location?: string;
  timeframe?: string;
  job_type?: string;
  skills_required?: string[];
  documents_required?: string[];
}

export const JOB_TITLES = [
  "School Psychologist",
  "Clinical Psychologist",
  "Educational Psychologist",
  "Counseling Psychologist",
  "Child Psychologist",
  "Adolescent Psychologist",
  "Developmental Psychologist",
  "Special Education Psychologist",
  "Behavioral Psychologist",
  "School Counselor",
  "School Social Worker",
  "Mental Health Therapist",
  "Psychological Evaluator"
];

export const WORK_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Seasonal",
  "Internship"
];

export const DEFAULT_BENEFITS = [
  "Spread Pay Plan: Enjoy a consistent income throughout the year",
  "Wellness & Professional Growth Stipends - Invest in your success and well-being!",
  "Professional Development Stipends: We invest in YOU!",
  "401(k) Plan: Secure your future with our retirement savings plan",
  "Online Resources: Access NASP-approved webinars, therapy ideas, and free CEUs",
  "Travel Positions Available - Explore new places while doing what you love!",
  "Referral Program: Share the opportunity!",
  "A workplace where you're supported, respected, and encouraged to do your best work every day"
];

export const TOP_LANGUAGES = [
  "English",
  "Spanish",
  "Mandarin Chinese",
  "Cantonese",
  "Vietnamese",
  "Korean",
  "French",
  "Arabic",
  "Tagalog",
  "Portuguese",
  "Russian",
  "Japanese",
  "German",
  "Haitian Creole",
  "Italian",
  "Polish",
  "Hindi",
  "Urdu",
  "Greek",
  "American Sign Language (ASL)"
];

export const fetchJobs = async (districtId?: string): Promise<Job[]> => {
  try {
    let query = supabase.from('jobs').select('*');
    
    if (districtId) {
      query = query.eq('district_id', districtId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

export const fetchJob = async (jobId: string): Promise<Job | null> => {
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
    return null;
  }
};

export const createJob = async (jobData: CreateJobParams): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        ...jobData,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw new Error('Failed to create job');
  }
};

export const updateJob = async (jobId: string, updateData: Partial<Job>): Promise<Job> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update(updateData)
      .eq('id', jobId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw new Error('Failed to update job');
  }
};

export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw new Error('Failed to delete job');
  }
};

export const fetchJobApplications = async (jobId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        psychologist:psychologist_id (id, name, city, state, certifications, experience_years)
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
