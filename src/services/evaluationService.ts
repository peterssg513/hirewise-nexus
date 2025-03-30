import { supabase } from '@/integrations/supabase/client';

// Define the interfaces needed for evaluations
export interface EvaluationTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  fields: EvaluationFormField[];
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
  [key: string]: any; // Allow for additional fields
}

// Get evaluation template
export const getEvaluationTemplate = async (templateId: string): Promise<EvaluationTemplate> => {
  // For this implementation, we'll use a static template
  // In a real implementation, you would fetch this from the database
  return getDefaultTemplate();
};

// Get evaluation data
export const getEvaluationData = async (evaluationId: string) => {
  try {
    // Check if form_data column exists in evaluations table
    const { data: columnInfo } = await supabase.rpc('get_column_info' as any, {
      table_name: 'evaluations',
      column_name: 'form_data'
    });
    
    const hasFormDataColumn = columnInfo && columnInfo.length > 0;
    
    // Fetch the evaluation with appropriate columns
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
        application_id
        ${hasFormDataColumn ? ',form_data' : ''}
      `)
      .eq('id', evaluationId)
      .single();

    if (evaluationError) throw evaluationError;

    // For this implementation, we'll use a static template
    const template = getDefaultTemplate();

    // If form_data column doesn't exist, provide an empty object
    const evaluationWithFormData = hasFormDataColumn 
      ? evaluation 
      : { ...evaluation, form_data: {} };

    return {
      evaluation: evaluationWithFormData,
      template
    };
  } catch (error) {
    console.error('Error fetching evaluation:', error);
    throw error;
  }
};

// Alias for getEvaluationData for backward compatibility
export const getEvaluationById = getEvaluationData;

// Save evaluation form data (rename for consistency with component)
export const saveEvaluationData = async (evaluationId: string, formData: Record<string, any>) => {
  return saveEvaluationFormData(evaluationId, formData as EvaluationFormData);
};

// Save evaluation form data
export const saveEvaluationFormData = async (evaluationId: string, formData: EvaluationFormData) => {
  try {
    // First get the current evaluation to check its status
    const { data: currentEvaluation, error: fetchError } = await supabase
      .from('evaluations')
      .select('status')
      .eq('id', evaluationId)
      .single();

    if (fetchError) throw fetchError;

    // Check if form_data column exists in evaluations table
    const { data: columnInfo } = await supabase.rpc('get_column_info' as any, {
      table_name: 'evaluations',
      column_name: 'form_data'
    });
    
    const hasFormDataColumn = columnInfo && columnInfo.length > 0;
    
    // Only allow updates if the evaluation is not submitted
    if (currentEvaluation && (currentEvaluation.status === 'submitted' || currentEvaluation.status === 'approved')) {
      throw new Error('Cannot update a submitted or approved evaluation');
    }

    // Update strategy depends on whether form_data column exists
    if (hasFormDataColumn) {
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
    } else {
      // If form_data column doesn't exist, just update status
      const { data, error } = await supabase
        .from('evaluations')
        .update({ 
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', evaluationId)
        .select();

      if (error) throw error;
      return data;
    }
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
    if (currentEvaluation && (currentEvaluation.status === 'submitted' || currentEvaluation.status === 'approved')) {
      throw new Error('This evaluation has already been submitted or approved');
    }

    // Check if form_data column exists in evaluations table
    const { data: columnInfo } = await supabase.rpc('get_column_info' as any, {
      table_name: 'evaluations',
      column_name: 'form_data'
    });
    
    const hasFormDataColumn = columnInfo && columnInfo.length > 0;
    
    // Update strategy depends on whether form_data column exists
    if (hasFormDataColumn) {
      // Update the evaluation to submitted status with form data
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
    } else {
      // If form_data column doesn't exist, just update status
      const { data, error } = await supabase
        .from('evaluations')
        .update({ 
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', evaluationId)
        .select();

      if (error) throw error;
      return data;
    }
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
      'Student Information',
      'Assessment Results',
      'Behavioral Observations',
      'Recommendations'
    ],
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
      },
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
      },
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
      },
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
  };
};

// Function to check if a column exists in a table
export const checkColumnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('get_column_info' as any, {
      table_name: tableName,
      column_name: columnName
    });
    
    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists in ${tableName}:`, error);
    return false;
  }
};
