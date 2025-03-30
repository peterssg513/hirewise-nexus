
import { supabase } from '@/integrations/supabase/client';

// Define the interfaces needed for evaluations
export interface EvaluationTemplate {
  id: string;
  name: string;
  description: string;
  sections: EvaluationTemplateSection[];
}

export interface EvaluationTemplateSection {
  title: string;
  fields: EvaluationFormField[];
}

export interface EvaluationFormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'multiselect' | 'radio' | 'checkbox';
  placeholder?: string; 
  options?: string[];
  required: boolean;
  section: string;
}

export interface EvaluationFormData {
  student_name: string;
  student_grade: string;
  evaluation_date: string;
  test_scores: Record<string, any>;
  observations: Record<string, any>;
  recommendations: string;
}

// Get evaluation data
export const getEvaluationData = async (evaluationId: string) => {
  try {
    // Fetch the evaluation
    const { data: evaluation, error: evaluationError } = await supabase
      .from('evaluations')
      .select(`
        id,
        status,
        created_at,
        updated_at,
        submitted_at,
        approved_at,
        report_url,
        application_id,
        form_data,
        application:applications (
          id,
          status,
          created_at,
          updated_at,
          psychologist_id,
          job_id,
          documents_urls,
          jobs (
            id,
            title,
            description,
            district_id,
            districts (
              id,
              name,
              location
            )
          )
        )
      `)
      .eq('id', evaluationId)
      .single();

    if (evaluationError) throw evaluationError;

    // For this implementation, we'll use a static template
    // In a real implementation, you would fetch this from the database
    const template = getDefaultTemplate();

    return {
      evaluation,
      template
    };
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    throw error;
  }
};

// Alias for getEvaluationData for backward compatibility
export const getEvaluationById = getEvaluationData;

// Save evaluation form data
export const saveEvaluationFormData = async (evaluationId: string, formData: EvaluationFormData) => {
  try {
    // First get the current evaluation to check its status
    const { data: currentEvaluation, error: fetchError } = await supabase
      .from('evaluations')
      .select('status, form_data')
      .eq('id', evaluationId)
      .single();

    if (fetchError) throw fetchError;

    // Only allow updates if the evaluation is not submitted
    if (currentEvaluation.status === 'submitted' || currentEvaluation.status === 'approved') {
      throw new Error('Cannot update a submitted or approved evaluation');
    }

    // Update the evaluation with the new form data
    const { data, error } = await supabase
      .from('evaluations')
      .update({ 
        form_data: formData,
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', evaluationId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving evaluation form data:', error);
    throw error;
  }
};

// Submit completed evaluation
export const submitEvaluation = async (evaluationId: string, formData: EvaluationFormData) => {
  try {
    // First get the current evaluation to check its status
    const { data: currentEvaluation, error: fetchError } = await supabase
      .from('evaluations')
      .select('status')
      .eq('id', evaluationId)
      .single();

    if (fetchError) throw fetchError;

    // Only allow submission if the evaluation is not already submitted
    if (currentEvaluation.status === 'submitted' || currentEvaluation.status === 'approved') {
      throw new Error('This evaluation has already been submitted or approved');
    }

    // Update the evaluation to submitted status
    const { data, error } = await supabase
      .from('evaluations')
      .update({ 
        form_data: formData,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', evaluationId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    throw error;
  }
};

// Get a default evaluation template
const getDefaultTemplate = (): EvaluationTemplate => {
  return {
    id: 'default-template',
    name: 'Standard Psychological Evaluation',
    description: 'Standard evaluation template for K-12 psychological assessment',
    sections: [
      {
        title: 'Student Information',
        fields: [
          {
            id: 'student_name',
            label: 'Student Name',
            type: 'text',
            placeholder: 'Full name of student',
            required: true,
            section: 'Student Information'
          },
          {
            id: 'student_grade',
            label: 'Grade',
            type: 'select',
            options: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            required: true,
            section: 'Student Information'
          },
          {
            id: 'evaluation_date',
            label: 'Evaluation Date',
            type: 'date',
            required: true,
            section: 'Student Information'
          }
        ]
      },
      {
        title: 'Assessment Results',
        fields: [
          {
            id: 'cognitive_assessment',
            label: 'Cognitive Assessment',
            type: 'textarea',
            placeholder: 'Describe cognitive assessment results',
            required: true,
            section: 'Assessment Results'
          },
          {
            id: 'achievement_tests',
            label: 'Achievement Tests',
            type: 'textarea',
            placeholder: 'Describe achievement test results',
            required: true,
            section: 'Assessment Results'
          },
          {
            id: 'learning_style',
            label: 'Learning Style',
            type: 'multiselect',
            options: ['Visual', 'Auditory', 'Kinesthetic', 'Read/Write'],
            required: false,
            section: 'Assessment Results'
          }
        ]
      },
      {
        title: 'Behavioral Observations',
        fields: [
          {
            id: 'classroom_behavior',
            label: 'Classroom Behavior',
            type: 'textarea',
            placeholder: 'Describe observed behavior in classroom settings',
            required: true,
            section: 'Behavioral Observations'
          },
          {
            id: 'social_interactions',
            label: 'Social Interactions',
            type: 'textarea',
            placeholder: 'Describe social interaction patterns',
            required: true,
            section: 'Behavioral Observations'
          },
          {
            id: 'adaptive_skills',
            label: 'Adaptive Skills',
            type: 'radio',
            options: ['Below Average', 'Average', 'Above Average'],
            required: true,
            section: 'Behavioral Observations'
          }
        ]
      },
      {
        title: 'Recommendations',
        fields: [
          {
            id: 'eligibility',
            label: 'Eligibility for Services',
            type: 'checkbox',
            options: [
              'Special Education',
              'Speech Therapy',
              'Occupational Therapy',
              'Counseling Services',
              'Behavior Intervention Plan',
              'None'
            ],
            required: true,
            section: 'Recommendations'
          },
          {
            id: 'recommendations',
            label: 'Recommendations',
            type: 'textarea',
            placeholder: 'Provide detailed recommendations for supporting this student',
            required: true,
            section: 'Recommendations'
          }
        ]
      }
    ]
  };
};
