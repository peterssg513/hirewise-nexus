
import { supabase } from '@/integrations/supabase/client';

export interface EvaluationRequest {
  id: string;
  student_id?: string;
  legal_name?: string;
  date_of_birth?: string;
  age?: number;
  grade?: string;
  district_id: string;
  school_id?: string;
  general_education_teacher?: string;
  special_education_teachers?: string;
  parents?: string;
  other_relevant_info?: string;
  service_type?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEvaluationRequestParams {
  student_id?: string;
  legal_name?: string;
  date_of_birth?: string;
  age?: number;
  grade?: string;
  district_id: string;
  school_id?: string;
  general_education_teacher?: string;
  special_education_teachers?: string;
  parents?: string;
  other_relevant_info?: string;
  service_type?: string;
}

export const SERVICE_TYPES = [
  "Evaluation Only",
  "Initial Referral/Evaluation Planning Meeting",
  "Re-evaluation Review Meeting",
  "Manifestation Determination",
  "BIP Review",
  "Change of Placement"
];

/**
 * Fetches all evaluation requests for a district
 */
export const fetchEvaluationRequests = async (districtId: string): Promise<EvaluationRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select('*')
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
 * Fetches evaluation requests for a specific school
 */
export const fetchEvaluationRequestsBySchool = async (schoolId: string): Promise<EvaluationRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching evaluation requests by school:', error);
    throw error;
  }
};

/**
 * Fetch a single evaluation request by ID
 */
export const fetchEvaluationRequestById = async (requestId: string): Promise<EvaluationRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select('*')
      .eq('id', requestId)
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
export const createEvaluationRequest = async (requestData: CreateEvaluationRequestParams): Promise<EvaluationRequest> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .insert(requestData)
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
export const updateEvaluationRequest = async (requestId: string, requestData: Partial<EvaluationRequest>): Promise<EvaluationRequest> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .update(requestData)
      .eq('id', requestId)
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
export const deleteEvaluationRequest = async (requestId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('evaluation_requests')
      .delete()
      .eq('id', requestId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting evaluation request:', error);
    throw error;
  }
};
