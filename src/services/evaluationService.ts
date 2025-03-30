
import { supabase } from '@/integrations/supabase/client';

export interface EvaluationData {
  id: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  psychologist_id: string;
  application_id: string;
  data: Record<string, any>; // Use data instead of evaluation_data
}

export interface EvaluationFormField {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  description?: string;
  section: string;
}

export interface EvaluationTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  fields: EvaluationFormField[];
}

export const getEvaluationById = async (evaluationId: string): Promise<EvaluationData> => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('id, status, created_at, submitted_at, psychologist_id, application_id, data')
    .eq('id', evaluationId)
    .single();

  if (error) {
    console.error('Error fetching evaluation:', error);
    throw error;
  }

  return data as EvaluationData;
};

export const getEvaluationTemplate = async (templateId: string): Promise<EvaluationTemplate> => {
  // For now, we'll use a mock template
  // In a real application, this would fetch from the database
  return {
    id: templateId,
    name: 'Standard Psychological Evaluation',
    description: 'Comprehensive evaluation for K-12 students',
    sections: [
      'Background Information',
      'Assessment Results',
      'Observations',
      'Recommendations'
    ],
    fields: [
      {
        id: 'student_name',
        type: 'text',
        label: 'Student Name',
        placeholder: 'Enter student name',
        required: true,
        section: 'Background Information'
      },
      {
        id: 'date_of_birth',
        type: 'date',
        label: 'Date of Birth',
        required: true,
        section: 'Background Information'
      },
      {
        id: 'grade',
        type: 'select',
        label: 'Grade',
        options: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        required: true,
        section: 'Background Information'
      },
      {
        id: 'referral_reason',
        type: 'textarea',
        label: 'Reason for Referral',
        placeholder: 'Describe the reason for referral',
        required: true,
        section: 'Background Information'
      },
      {
        id: 'assessment_tools',
        type: 'multiselect',
        label: 'Assessment Tools Used',
        options: [
          'WISC-V', 'WAIS-IV', 'WJ-IV', 'BASC-3', 'Conners-3', 'BRIEF-2',
          'Vineland-3', 'ADOS-2', 'ADHD Rating Scale', 'Other'
        ],
        required: true,
        section: 'Assessment Results'
      },
      {
        id: 'cognitive_results',
        type: 'textarea',
        label: 'Cognitive Assessment Results',
        placeholder: 'Summarize cognitive assessment findings',
        required: true,
        section: 'Assessment Results'
      },
      {
        id: 'behavioral_observations',
        type: 'textarea',
        label: 'Behavioral Observations',
        placeholder: 'Describe student behavior during assessment',
        required: true,
        section: 'Observations'
      },
      {
        id: 'recommendations',
        type: 'textarea',
        label: 'Recommendations',
        placeholder: 'List recommended interventions and accommodations',
        required: true,
        section: 'Recommendations'
      }
    ]
  };
};

export const saveEvaluationData = async (
  evaluationId: string, 
  formData: Record<string, any>
): Promise<void> => {
  const { error } = await supabase
    .from('evaluations')
    .update({ data: formData, status: 'in_progress' })
    .eq('id', evaluationId);

  if (error) {
    console.error('Error saving evaluation data:', error);
    throw error;
  }
};

export const submitEvaluation = async (
  evaluationId: string, 
  formData: Record<string, any>
): Promise<void> => {
  const { error } = await supabase
    .from('evaluations')
    .update({ 
      data: formData, 
      status: 'submitted',
      submitted_at: new Date().toISOString()
    })
    .eq('id', evaluationId);

  if (error) {
    console.error('Error submitting evaluation:', error);
    throw error;
  }
};

export const getPsychologistEvaluations = async (psychologistId: string): Promise<EvaluationData[]> => {
  const { data, error } = await supabase
    .from('evaluations')
    .select('id, status, created_at, submitted_at, psychologist_id, application_id, data')
    .eq('psychologist_id', psychologistId);

  if (error) {
    console.error('Error fetching evaluations:', error);
    throw error;
  }

  return data as EvaluationData[];
};
