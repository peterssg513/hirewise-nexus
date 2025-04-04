import { supabase } from '@/integrations/supabase/client';

export interface EvaluationRequest {
  id: string;
  student_id?: string;
  legal_name?: string;
  date_of_birth?: string;
  age?: number | string;
  district_id: string;
  school_id?: string;
  other_relevant_info?: string;
  service_type?: string;
  grade?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  general_education_teacher?: string;
  special_education_teachers?: string;
  parents?: string;
  title?: string;
  description?: string;
  location?: string;
  timeframe?: string;
  skills_required?: string[];
  payment_amount?: string;
  state?: string;
}

export type EvaluationRequestStatus = 
  | 'pending' 
  | 'active' 
  | 'completed' 
  | 'canceled' 
  | 'rejected'
  | 'Open'
  | 'Offered'
  | 'Accepted'
  | 'Evaluation In Progress'
  | 'Closed';

// Fetch evaluation requests for a district
export const fetchEvaluationRequests = async (districtId: string): Promise<EvaluationRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select('*')
      .eq('district_id', districtId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as EvaluationRequest[];
  } catch (error) {
    console.error('Error fetching evaluation requests:', error);
    return [];
  }
};

// Create a new evaluation request
export const createEvaluationRequest = async (evaluationData: Partial<EvaluationRequest>): Promise<EvaluationRequest> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .insert([evaluationData])
      .select()
      .single();
    
    if (error) throw error;
    return data as EvaluationRequest;
  } catch (error) {
    console.error('Error creating evaluation request:', error);
    throw error;
  }
};

// Update an evaluation request
export const updateEvaluationRequest = async (id: string, evaluationData: Partial<EvaluationRequest>): Promise<EvaluationRequest> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .update(evaluationData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as EvaluationRequest;
  } catch (error) {
    console.error('Error updating evaluation request:', error);
    throw error;
  }
};

// Delete an evaluation request
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

// Get evaluation request by id
export const getEvaluationRequestById = async (id: string): Promise<EvaluationRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as EvaluationRequest;
  } catch (error) {
    console.error('Error fetching evaluation request:', error);
    return null;
  }
};
