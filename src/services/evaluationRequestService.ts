
import { supabase } from '@/integrations/supabase/client';
import { EvaluationRequest, EvaluationRequestStatus } from '@/types/evaluationRequest';
import { toast } from 'sonner';

export interface CreateEvaluationRequestParams {
  legal_name?: string;
  date_of_birth?: string;
  age?: number | string;
  district_id?: string;
  school_id?: string;
  grade?: string;
  general_education_teacher?: string;
  parents?: string;
  special_education_teachers?: string;
  other_relevant_info?: string;
  service_type?: string;
  timeframe?: string;
  skills_required?: string[];
}

export async function createEvaluationRequest(data: CreateEvaluationRequestParams): Promise<EvaluationRequest | null> {
  try {
    // Convert age to number if it's a numeric string
    const ageValue = typeof data.age === 'string' && !isNaN(Number(data.age)) ? 
      Number(data.age) : data.age;
    
    const insertData = {
      ...data,
      age: ageValue,
      status: 'pending' as EvaluationRequestStatus
    };
      
    const { data: evaluation, error } = await supabase
      .from('evaluation_requests')
      .insert(insertData)
      .select('*')
      .single();
      
    if (error) throw error;
    
    return evaluation as EvaluationRequest;
  } catch (error: any) {
    console.error('Error creating evaluation request:', error);
    toast.error('Failed to create evaluation request', {
      description: error.message || 'Please try again later'
    });
    return null;
  }
}

export async function getEvaluationRequests(districtId?: string): Promise<EvaluationRequest[]> {
  try {
    let query = supabase
      .from('evaluation_requests')
      .select('*');
      
    if (districtId) {
      query = query.eq('district_id', districtId);
    }
    
    query = query.order('created_at', { ascending: false });
      
    const { data, error } = await query;
      
    if (error) throw error;
    
    return data as EvaluationRequest[];
  } catch (error: any) {
    console.error('Error fetching evaluation requests:', error);
    toast.error('Failed to fetch evaluation requests', {
      description: error.message || 'Please try again later'
    });
    return [];
  }
}

// Alias to maintain compatibility with existing code
export const fetchEvaluationRequests = getEvaluationRequests;

export async function getEvaluationRequestById(id: string): Promise<EvaluationRequest | null> {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data as EvaluationRequest;
  } catch (error: any) {
    console.error(`Error fetching evaluation request with ID ${id}:`, error);
    toast.error('Failed to fetch evaluation request', {
      description: error.message || 'Please try again later'
    });
    return null;
  }
}

export async function updateEvaluationRequest(id: string, data: Partial<EvaluationRequest>): Promise<EvaluationRequest | null> {
  try {
    // Convert age to number if it's a numeric string
    if (data.age && typeof data.age === 'string' && !isNaN(Number(data.age))) {
      data.age = Number(data.age);
    }
    
    const { data: updatedEvaluation, error } = await supabase
      .from('evaluation_requests')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) throw error;
    
    return updatedEvaluation as EvaluationRequest;
  } catch (error: any) {
    console.error(`Error updating evaluation request with ID ${id}:`, error);
    toast.error('Failed to update evaluation request', {
      description: error.message || 'Please try again later'
    });
    return null;
  }
}

export async function deleteEvaluationRequest(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('evaluation_requests')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error(`Error deleting evaluation request with ID ${id}:`, error);
    toast.error('Failed to delete evaluation request', {
      description: error.message || 'Please try again later'
    });
    return false;
  }
}

export async function getDistrictEvaluationRequests(districtId: string): Promise<EvaluationRequest[]> {
  return getEvaluationRequests(districtId);
}
