
import { supabase } from '@/integrations/supabase/client';

export interface EvaluationData {
  id: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  approved_at: string | null;
  report_url: string | null;
  application_id: string;
  // Add the application details
  application?: {
    id: string;
    status: string;
    job_id: string;
    psychologist_id: string;
    job_title?: string;
    district_name?: string;
  };
}

export interface EvaluationFormData {
  studentName: string;
  studentAge: number;
  grade: string;
  evaluationType: string;
  observations: string;
  recommendations: string;
  conclusion: string;
  attachments: File[] | null;
}

/**
 * Gets an evaluation by ID
 */
export const getEvaluationById = async (evaluationId: string): Promise<EvaluationData> => {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select(`
        *,
        applications (
          id,
          status,
          job_id,
          psychologist_id,
          jobs (
            title,
            districts (
              name
            )
          )
        )
      `)
      .eq('id', evaluationId)
      .single();
      
    if (error) throw error;
    
    // Transform the data to a more convenient format
    return {
      ...data,
      application: {
        ...data.applications,
        job_title: data.applications.jobs.title,
        district_name: data.applications.jobs.districts.name
      }
    };
  } catch (error) {
    console.error('Failed to get evaluation:', error);
    throw new Error('Failed to get evaluation. Please try again.');
  }
};

/**
 * Updates an evaluation
 */
export const updateEvaluation = async (
  evaluationId: string, 
  formData: Partial<EvaluationFormData>,
  status?: string
): Promise<void> => {
  try {
    const updates: any = {};
    
    // Convert form data to a JSON string
    if (Object.keys(formData).length > 0) {
      updates.evaluation_data = formData;
    }
    
    // Update status if provided
    if (status) {
      updates.status = status;
      
      // Set timestamps based on status
      if (status === 'submitted') {
        updates.submitted_at = new Date().toISOString();
      } else if (status === 'approved') {
        updates.approved_at = new Date().toISOString();
      }
    }
    
    const { error } = await supabase
      .from('evaluations')
      .update(updates)
      .eq('id', evaluationId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Failed to update evaluation:', error);
    throw new Error('Failed to update evaluation. Please try again.');
  }
};

/**
 * Uploads evaluation attachments
 */
export const uploadEvaluationAttachments = async (
  evaluationId: string,
  files: File[]
): Promise<string[]> => {
  try {
    const fileUrls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `evaluations/${evaluationId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('evaluation_files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('evaluation_files')
        .getPublicUrl(filePath);
        
      fileUrls.push(urlData.publicUrl);
    }
    
    return fileUrls;
  } catch (error) {
    console.error('Failed to upload attachments:', error);
    throw new Error('Failed to upload attachments. Please try again.');
  }
};

/**
 * Gets all evaluations for a psychologist
 */
export const getPsychologistEvaluations = async (psychologistId: string): Promise<EvaluationData[]> => {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select(`
        *,
        applications!inner (
          id,
          status,
          job_id,
          psychologist_id,
          jobs (
            title,
            districts (
              name
            )
          )
        )
      `)
      .eq('applications.psychologist_id', psychologistId);
      
    if (error) throw error;
    
    // Transform the data to a more convenient format
    return data.map(item => ({
      ...item,
      application: {
        ...item.applications,
        job_title: item.applications.jobs.title,
        district_name: item.applications.jobs.districts.name
      }
    }));
  } catch (error) {
    console.error('Failed to get evaluations:', error);
    throw new Error('Failed to get evaluations. Please try again.');
  }
};

/**
 * Submits an evaluation report
 */
export const submitEvaluationReport = async (
  evaluationId: string,
  reportUrl: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('evaluations')
      .update({
        report_url: reportUrl,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', evaluationId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Failed to submit evaluation report:', error);
    throw new Error('Failed to submit evaluation report. Please try again.');
  }
};
