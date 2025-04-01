
import { supabase } from '@/integrations/supabase/client';

/**
 * Apply for an evaluation request
 * @param evaluationId ID of the evaluation to apply for
 * @param documentsUrls Optional array of document URLs
 * @param notes Optional notes for the application
 * @returns The application ID
 */
export const applyToEvaluation = async (
  evaluationId: string,
  documentsUrls?: string[],
  notes?: string
): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc(
      'apply_to_evaluation',
      {
        _evaluation_id: evaluationId,
        _documents_urls: documentsUrls || null,
        _notes: notes || null,
      }
    );

    if (error) throw error;
    return data as string;
  } catch (error: any) {
    console.error('Error applying for evaluation:', error);
    throw new Error(error.message || 'Failed to apply for evaluation');
  }
};

/**
 * Fetch evaluations available to a psychologist
 * @returns Array of available evaluations
 */
export const fetchAvailableEvaluations = async () => {
  try {
    const { data, error } = await supabase
      .from('active_evaluations_with_district')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching available evaluations:', error);
    throw error;
  }
};

/**
 * Fetch evaluation applications for a psychologist
 * @returns Array of evaluation applications
 */
export const fetchPsychologistEvaluationApplications = async () => {
  try {
    const { data: psychologist, error: psychologistError } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (psychologistError) throw psychologistError;

    const psychologistId = psychologist[0]?.id;
    if (!psychologistId) throw new Error('Psychologist profile not found');

    const { data, error } = await supabase
      .from('evaluation_applications')
      .select(`
        *,
        evaluation:evaluation_id (*)
      `)
      .eq('psychologist_id', psychologistId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching evaluation applications:', error);
    throw error;
  }
};
