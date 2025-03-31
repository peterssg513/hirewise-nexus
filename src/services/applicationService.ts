
import { supabase } from '@/integrations/supabase/client';

export interface Application {
  id: string;
  job_id: string;
  psychologist_id: string;
  status: string;
  documents_urls?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches all applications for a district
 */
export const fetchDistrictApplications = async (districtId: string): Promise<any[]> => {
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
        jobs!inner(
          id, 
          title, 
          district_id
        ),
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
          work_types
        )
      `)
      .eq('jobs.district_id', districtId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching district applications:', error);
    throw error;
  }
};

/**
 * Approves an application
 */
export const approveApplication = async (applicationId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('approve_application', {
      application_id: applicationId
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error approving application:', error);
    throw error;
  }
};

/**
 * Rejects an application
 */
export const rejectApplication = async (applicationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('applications')
      .update({ status: 'rejected' })
      .eq('id', applicationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error rejecting application:', error);
    throw error;
  }
};
