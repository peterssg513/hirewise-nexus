
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Consistent status types for evaluation requests
export type EvaluationRequestStatus = 
  'pending' | 'active' | 'completed' | 'canceled' | 'rejected' | 
  'Open' | 'Offered' | 'Accepted' | 'Evaluation In Progress' | 'Closed';

export type EvaluationRequest = {
  id: string;
  title: string;
  description: string;
  district_id: string;
  school_id?: string;
  student_id?: string;
  skills_required: string[];
  location: string;
  timeframe: string;
  service_type?: string;
  status: EvaluationRequestStatus;
  created_at: string;
  updated_at: string;
  // Additional fields
  legal_name?: string;
  date_of_birth?: string;
  age?: number;
  grade?: string;
  general_education_teacher?: string;
  special_education_teachers?: string;
  parents?: string;
  other_relevant_info?: string;
  state?: string;
  payment_amount?: string;
};

export type EvaluationApplication = {
  id: string;
  evaluation_id: string;
  psychologist_id: string;
  psychologist?: {
    name?: string;
    email?: string;
    profile_picture_url?: string;
  };
  documents_urls?: string[];
  notes?: string;
  status: 'submitted' | 'rejected' | 'approved' | 'completed';
  created_at: string;
  updated_at: string;
};

export const SERVICE_TYPES = [
  'Initial Evaluation',
  'Triennial Evaluation',
  'Functional Behavior Assessment',
  'Behavior Support Plan',
  'Psychoeducational Assessment',
  'Other'
];

// Create evaluation request
export const createEvaluationRequest = async (
  evaluationData: Partial<Omit<EvaluationRequest, 'id' | 'created_at' | 'updated_at'>>
): Promise<EvaluationRequest> => {
  try {
    // Make sure district_id is required
    if (!evaluationData.district_id) {
      throw new Error('District ID is required');
    }
    
    // Add default values
    const newEvaluation = {
      district_id: evaluationData.district_id,
      status: evaluationData.status || 'pending' as EvaluationRequestStatus,
      title: evaluationData.title || evaluationData.service_type || 'New Evaluation',
      description: evaluationData.description || `Evaluation request for ${evaluationData.legal_name || 'student'}`,
      skills_required: evaluationData.skills_required || [],
      location: evaluationData.location || '',
      timeframe: evaluationData.timeframe || '',
      service_type: evaluationData.service_type || '',
      // Include the rest of the fields
      school_id: evaluationData.school_id,
      student_id: evaluationData.student_id,
      legal_name: evaluationData.legal_name,
      date_of_birth: evaluationData.date_of_birth,
      age: evaluationData.age,
      grade: evaluationData.grade,
      general_education_teacher: evaluationData.general_education_teacher,
      special_education_teachers: evaluationData.special_education_teachers,
      parents: evaluationData.parents,
      other_relevant_info: evaluationData.other_relevant_info,
      state: evaluationData.state,
      payment_amount: evaluationData.payment_amount
    };

    const { data, error } = await supabase
      .from('evaluation_postings')
      .insert(newEvaluation)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as EvaluationRequest;
  } catch (error: any) {
    console.error('Error creating evaluation request:', error);
    throw new Error(error.message || 'Failed to create evaluation request');
  }
};

// Update evaluation request
export const updateEvaluationRequest = async (
  id: string,
  evaluationData: Partial<Omit<EvaluationRequest, 'id' | 'created_at' | 'updated_at'>>
): Promise<EvaluationRequest> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_postings')
      .update(evaluationData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as EvaluationRequest;
  } catch (error: any) {
    console.error('Error updating evaluation request:', error);
    throw new Error(error.message || 'Failed to update evaluation request');
  }
};

// Delete evaluation request
export const deleteEvaluationRequest = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('evaluation_postings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error deleting evaluation request:', error);
    throw new Error(error.message || 'Failed to delete evaluation request');
  }
};

// Fetch district's evaluation requests
export const fetchEvaluationRequests = async (districtId: string): Promise<EvaluationRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_postings')
      .select('*')
      .eq('district_id', districtId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as unknown as EvaluationRequest[];
  } catch (error) {
    console.error('Error fetching district evaluation requests:', error);
    throw error;
  }
};

// Fetch a single evaluation request
export const fetchEvaluationRequest = async (id: string): Promise<EvaluationRequest> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_postings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as unknown as EvaluationRequest;
  } catch (error) {
    console.error('Error fetching evaluation request:', error);
    throw error;
  }
};

// Fetch applications for a specific evaluation
export const fetchEvaluationApplications = async (evaluationId: string): Promise<EvaluationApplication[]> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_applications')
      .select(`
        *,
        psychologist:psychologist_id (
          user_id,
          profile_picture_url
        )
      `)
      .eq('evaluation_id', evaluationId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get psychologist profile details
    const applications = await Promise.all(data.map(async (app) => {
      if (app.psychologist?.user_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', app.psychologist.user_id)
          .single();

        if (!profileError && profileData) {
          return {
            ...app,
            psychologist: {
              ...app.psychologist,
              name: profileData.name,
              email: profileData.email
            }
          };
        }
      }
      return app;
    }));

    return applications as unknown as EvaluationApplication[];
  } catch (error) {
    console.error('Error fetching evaluation applications:', error);
    throw error;
  }
};

// Approve or reject an evaluation application
export const updateApplicationStatus = async (
  applicationId: string,
  status: 'approved' | 'rejected'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('evaluation_applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) throw error;
  } catch (error: any) {
    console.error('Error updating application status:', error);
    throw new Error(error.message || `Failed to ${status} application`);
  }
};
