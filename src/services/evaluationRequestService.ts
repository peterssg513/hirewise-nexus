
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
    const { data: evaluation, error } = await supabase
      .from('evaluation_requests')
      .insert({
        ...data,
        status: 'pending' as EvaluationRequestStatus
      })
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

export async function getEvaluationRequests(): Promise<EvaluationRequest[]> {
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select('*')
      .order('created_at', { ascending: false });
      
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
    const { data: updatedEvaluation, error } = await supabase
      .from('evaluation_requests')
      .update(data as any)
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
  try {
    const { data, error } = await supabase
      .from('evaluation_requests')
      .select('*')
      .eq('district_id', districtId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data as EvaluationRequest[];
  } catch (error: any) {
    console.error(`Error fetching evaluation requests for district ${districtId}:`, error);
    toast.error('Failed to fetch evaluation requests', {
      description: error.message || 'Please try again later'
    });
    return [];
  }
}
