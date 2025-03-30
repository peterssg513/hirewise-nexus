
import { supabase } from '@/integrations/supabase/client';

export interface EvaluationFormData {
  student_name: string;
  student_grade: string;
  evaluation_date: string;
  test_scores: {
    verbal: number;
    math: number;
    reasoning: number;
  };
  observations: string;
  recommendations: string;
}

export interface EvaluationFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'select';
  options?: string[];
  required: boolean;
}

export interface EvaluationTemplate {
  id: string;
  title: string;
  fields: EvaluationFormField[];
}

export interface EvaluationData {
  id: string;
  status: string;
  evaluationId: string;
  data: EvaluationFormData;
}

// Get evaluation template based on type
export const getEvaluationTemplate = async (evaluationId: string): Promise<EvaluationTemplate> => {
  try {
    const { data, error } = await supabase
      .from('evaluation_templates')
      .select('*')
      .eq('id', evaluationId)
      .single();

    if (error) throw error;

    return data as unknown as EvaluationTemplate;
  } catch (error) {
    console.error('Error fetching evaluation template:', error);
    // Return default template if not found
    return {
      id: 'default',
      title: 'Standard Psychological Evaluation',
      fields: [
        {
          id: 'student_name',
          label: 'Student Name',
          type: 'text',
          required: true
        },
        {
          id: 'student_grade',
          label: 'Grade',
          type: 'text',
          required: true
        },
        {
          id: 'evaluation_date',
          label: 'Evaluation Date',
          type: 'date',
          required: true
        },
        {
          id: 'test_scores_verbal',
          label: 'Verbal Score',
          type: 'number',
          required: true
        },
        {
          id: 'test_scores_math',
          label: 'Math Score',
          type: 'number',
          required: true
        },
        {
          id: 'test_scores_reasoning',
          label: 'Reasoning Score',
          type: 'number',
          required: true
        },
        {
          id: 'observations',
          label: 'Observations',
          type: 'textarea',
          required: true
        },
        {
          id: 'recommendations',
          label: 'Recommendations',
          type: 'textarea',
          required: true
        }
      ]
    };
  }
};

// Get existing evaluation data if available
export const getEvaluationData = async (evaluationId: string): Promise<EvaluationData | null> => {
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*, application:applications(*)')
      .eq('id', evaluationId)
      .single();

    if (error) throw error;

    // If data exists but no form data yet, return null for the form data
    if (!data.form_data) {
      return {
        id: data.id,
        status: data.status,
        evaluationId: data.id,
        data: {} as EvaluationFormData
      };
    }

    return {
      id: data.id,
      status: data.status,
      evaluationId: data.id,
      data: data.form_data as EvaluationFormData
    };
  } catch (error) {
    console.error('Error fetching evaluation data:', error);
    return null;
  }
};

// Save evaluation data (in-progress)
export const saveEvaluationData = async (evaluationId: string, formData: EvaluationFormData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('evaluations')
      .update({
        form_data: formData,
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', evaluationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving evaluation data:', error);
    return false;
  }
};

// Submit completed evaluation
export const submitEvaluation = async (evaluationId: string, formData: EvaluationFormData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('evaluations')
      .update({
        form_data: formData,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', evaluationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting evaluation:', error);
    return false;
  }
};
