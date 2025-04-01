
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
  service_type?: string;
}

export interface EvaluationApplication {
  id: string;
  evaluation_id: string;
  status: string;
  created_at: string;
  documents_urls?: string[];
  notes?: string;
  evaluation?: Evaluation;
}

/**
 * Fetch active evaluations available for psychologists
 */
export const fetchAvailableEvaluations = async (): Promise<Evaluation[]> => {
  try {
    const { data, error } = await supabase
      .from('active_evaluations_with_district')
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
    const { data, error } = await supabase.rpc('apply_to_evaluation', {
      _evaluation_id: evaluationId,
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
export const fetchPsychologistEvaluationApplications = async (): Promise<EvaluationApplication[]> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_applications')
      .select(`
        id,
        evaluation_id,
        status,
        created_at,
        documents_urls,
        notes,
        evaluation:evaluation_id(
          id,
          title,
          description,
          location,
          timeframe,
          district_id,
          district:district_id(
            name,
            location
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform the data to a more convenient format
    const transformedData = data.map((app) => ({
      ...app,
      evaluation: app.evaluation ? {
        ...app.evaluation,
        district_name: app.evaluation.district?.name || 'Unknown District',
        district_location: app.evaluation.district?.location || ''
      } : undefined
    }));
    
    return transformedData || [];
  } catch (error) {
    console.error('Error fetching psychologist evaluation applications:', error);
    throw error;
  }
};
