
import { supabase } from '@/integrations/supabase/client';

export interface EvaluationRequest {
  id: string;
  district_id: string;
  school_id?: string;
  psychologist_id?: string;
  legal_name: string;
  grade_level?: string;
  birthdate?: string;
  service_type: string;
  skills_required?: string[];
  location?: string;
  timeframe?: string;
  description?: string;
  title?: string;
  status: string;
  created_at?: string;
}

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
      .insert([{ ...evaluationData, status: 'Open' }])
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
