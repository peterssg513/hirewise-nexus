
import { supabase } from '@/integrations/supabase/client';

export interface Evaluation {
  id: string;
  title: string;
  description: string;
  district_name: string;
  location: string;
  timeframe: string;
  skills_required: string[];
  status: string;
  district_id: string;
  created_at: string;
}

/**
 * Fetch active evaluations available for psychologists
 */
export const fetchAvailableEvaluations = async (): Promise<Evaluation[]> => {
  try {
    const { data, error } = await supabase
      .from('active_jobs_with_district')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    throw error;
  }
};

/**
 * Apply for an evaluation
 */
export const applyForEvaluation = async (
  evaluationId: string,
  documentsUrls: string[] = [],
  notes: string = ''
): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('apply_to_job', {
      _job_id: evaluationId,
      _documents_urls: documentsUrls,
      _notes: notes
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error applying for evaluation:', error);
    throw error;
  }
};

/**
 * Fetch evaluations a psychologist has applied for
 */
export const fetchPsychologistEvaluations = async (psychologistId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        created_at,
        documents_urls,
        notes,
        jobs!inner (
          id,
          title,
          description,
          location,
          timeframe,
          districts (
            id,
            name,
            location
          )
        )
      `)
      .eq('psychologist_id', psychologistId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching psychologist evaluations:', error);
    throw error;
  }
};
