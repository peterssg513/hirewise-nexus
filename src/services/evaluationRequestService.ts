
import { supabase } from '@/integrations/supabase/client';

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

export interface EvaluationRequest {
  id: string;
  title?: string;
  description?: string;
  student_id?: string;
  legal_name?: string;
  date_of_birth?: string;
  age?: number;
  grade?: string;
  district_id?: string;
  school_id?: string;
  service_type?: string;
  status?: EvaluationRequestStatus;
  created_at: string;
  updated_at: string;
  other_relevant_info?: string;
  general_education_teacher?: string;
  special_education_teachers?: string;
  parents?: string;
  location?: string;
  timeframe?: string;
  skills_required?: string[];
}

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
    return [];
  }
};

export const fetchEvaluationRequest = async (requestId: string): Promise<EvaluationRequest | null> => {
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
    return null;
  }
};

export const createEvaluationRequest = async (requestData: Partial<EvaluationRequest>): Promise<EvaluationRequest> => {
  try {
    // Ensure age is a number if provided
    if (requestData.age && typeof requestData.age === 'string') {
      requestData.age = parseInt(requestData.age, 10);
    }
    
    const { data, error } = await supabase
      .from('evaluation_requests')
      .insert(requestData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating evaluation request:', error);
    throw new Error('Failed to create evaluation request');
  }
};

export const updateEvaluationRequest = async (requestId: string, updateData: Partial<EvaluationRequest>): Promise<EvaluationRequest> => {
  try {
    // Ensure age is a number if provided
    if (updateData.age && typeof updateData.age === 'string') {
      updateData.age = parseInt(updateData.age, 10);
    }
    
    const { data, error } = await supabase
      .from('evaluation_requests')
      .update(updateData)
      .eq('id', requestId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating evaluation request:', error);
    throw new Error('Failed to update evaluation request');
  }
};

export const deleteEvaluationRequest = async (requestId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('evaluation_requests')
      .delete()
      .eq('id', requestId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting evaluation request:', error);
    throw new Error('Failed to delete evaluation request');
  }
};
