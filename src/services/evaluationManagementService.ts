
import { supabase } from '@/integrations/supabase/client';

export interface EvaluationRequest {
  id: string;
  district_id: string;
  school_id?: string;
  student_id?: string;
  legal_name?: string;
  date_of_birth?: string;
  age?: number;
  grade?: string;
  general_education_teacher?: string;
  special_education_teachers?: string;
  parents?: string;
  service_type?: string;
  other_relevant_info?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEvaluationParams {
  district_id: string;
  school_id?: string;
  student_id?: string;
  legal_name?: string;
  date_of_birth?: string;
  age?: number;
  grade?: string;
  general_education_teacher?: string;
  special_education_teachers?: string;
  parents?: string;
  service_type?: string;
  other_relevant_info?: string;
}

/**
 * Fetches evaluation requests for a district
 */
export const fetchEvaluationRequests = async (districtId: string): Promise<EvaluationRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select(`
        *,
        schools:school_id (name),
        students:student_id (first_name, last_name)
      `)
      .eq('district_id', districtId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching evaluation requests:', error);
    throw error;
  }
};

/**
 * Fetch a single evaluation request by ID
 */
export const fetchEvaluationRequestById = async (evaluationId: string): Promise<EvaluationRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select(`
        *,
        schools:school_id (name),
        students:student_id (first_name, last_name)
      `)
      .eq('id', evaluationId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching evaluation request:', error);
    throw error;
  }
};

/**
 * Creates a new evaluation request
 */
export const createEvaluationRequest = async (evaluationData: CreateEvaluationParams): Promise<EvaluationRequest> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .insert(evaluationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating evaluation request:', error);
    throw error;
  }
};

/**
 * Updates an existing evaluation request
 */
export const updateEvaluationRequest = async (evaluationId: string, evaluationData: Partial<EvaluationRequest>): Promise<EvaluationRequest> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .update(evaluationData)
      .eq('id', evaluationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating evaluation request:', error);
    throw error;
  }
};

/**
 * Deletes an evaluation request
 */
export const deleteEvaluationRequest = async (evaluationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('evaluation_requests')
      .delete()
      .eq('id', evaluationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting evaluation request:', error);
    throw error;
  }
};
