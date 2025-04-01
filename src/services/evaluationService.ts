
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type Evaluation = {
  id: string;
  title: string;
  description: string;
  district_id: string;
  district_name: string;
  school_id?: string;
  location: string;
  timeframe: string;
  service_type: string;
  skills_required: string[];
  status: 'pending' | 'active' | 'completed' | 'canceled';
  created_at: string;
  updated_at: string;
};

export type EvaluationApplication = {
  id: string;
  evaluation_id: string;
  psychologist_id: string;
  documents_urls?: string[];
  notes?: string;
  status: 'submitted' | 'rejected' | 'approved' | 'completed';
  created_at: string;
  updated_at: string;
  evaluation?: Evaluation;
};

// Fetch active evaluations
export const fetchActiveEvaluations = async (): Promise<Evaluation[]> => {
  try {
    const { data, error } = await supabase
      .from('active_evaluations_with_district')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;
    return data as unknown as Evaluation[];
  } catch (error) {
    console.error('Error fetching active evaluations:', error);
    throw error;
  }
};

// Apply to evaluation
export const applyToEvaluation = async (
  evaluationId: string,
  documents_urls?: string[], 
  notes?: string
): Promise<string> => {
  try {
    const { data, error } = await supabase
      .rpc('apply_to_evaluation', {
        _evaluation_id: evaluationId,
        _documents_urls: documents_urls,
        _notes: notes
      });

    if (error) throw error;
    return data as string;
  } catch (error: any) {
    console.error('Error applying to evaluation:', error);
    throw new Error(error.message || 'Failed to apply to evaluation');
  }
};

// Fetch psychologist's evaluation applications
export const fetchPsychologistEvaluationApplications = async (): Promise<EvaluationApplication[]> => {
  try {
    const { data: applications, error: applicationsError } = await supabase
      .from('evaluation_applications')
      .select(`
        *,
        evaluation:evaluation_id (*)
      `)
      .order('created_at', { ascending: false });

    if (applicationsError) throw applicationsError;

    // Transform the data to the expected format
    const formattedApplications = applications.map(app => ({
      ...app,
      evaluation: app.evaluation
    }));

    return formattedApplications as EvaluationApplication[];
  } catch (error) {
    console.error('Error fetching psychologist evaluation applications:', error);
    throw error;
  }
};

// Check if psychologist has already applied to an evaluation
export const hasAppliedToEvaluation = async (evaluationId: string): Promise<boolean> => {
  try {
    const { data, error, count } = await supabase
      .from('evaluation_applications')
      .select('*', { count: 'exact' })
      .eq('evaluation_id', evaluationId);

    if (error) throw error;
    return count ? count > 0 : false;
  } catch (error) {
    console.error('Error checking evaluation application:', error);
    throw error;
  }
};
