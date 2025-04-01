
import { supabase } from '@/integrations/supabase/client';

export const SERVICE_TYPES = [
  'Psycho-educational Evaluation',
  'Psychological Evaluation',
  'Intellectual Assessment',
  'Achievement Assessment',
  'Emotional/Behavioral Assessment',
  'Autism Spectrum Assessment',
  'ADHD Assessment',
  'Functional Behavioral Assessment',
  'Speech-Language Evaluation',
  'Occupational Therapy Evaluation',
  'Physical Therapy Evaluation',
  'Social Skills Assessment',
  'Gifted and Talented Evaluation',
  'Transition Assessment',
  'Other'
];

export interface EvaluationRequest {
  id: string;
  legal_name?: string;
  date_of_birth?: string;
  age?: number;
  grade?: string;
  school_id?: string;
  student_id?: string;
  general_education_teacher?: string;
  special_education_teachers?: string;
  parents?: string;
  other_relevant_info?: string;
  service_type?: string;
  district_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  schools?: {
    id: string;
    name: string;
  };
}

/**
 * Create a new evaluation request
 */
export const createEvaluationRequest = async (evaluationData: any): Promise<EvaluationRequest> => {
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
 * Fetch evaluation requests for a district
 */
export const fetchEvaluationRequests = async (districtId: string): Promise<EvaluationRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select(`
        *,
        schools:school_id (
          id,
          name
        )
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
 * Update an evaluation request
 */
export const updateEvaluationRequest = async (id: string, evaluationData: any): Promise<EvaluationRequest> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .update(evaluationData)
      .eq('id', id)
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
 * Delete an evaluation request
 */
export const deleteEvaluationRequest = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('evaluation_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting evaluation request:', error);
    throw error;
  }
};

/**
 * Create a new evaluation posting
 */
export const createEvaluationPosting = async (evaluationData: any): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_postings')
      .insert(evaluationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating evaluation posting:', error);
    throw error;
  }
};

/**
 * Fetch evaluation postings for a district
 */
export const fetchEvaluationPostings = async (districtId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_postings')
      .select('*')
      .eq('district_id', districtId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching evaluation postings:', error);
    throw error;
  }
};
