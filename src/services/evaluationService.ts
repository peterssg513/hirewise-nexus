
import { supabase } from '@/integrations/supabase/client';
import { Evaluation, EvaluationFormData } from '@/types/evaluation';
import { getDefaultTemplate } from '@/services/evaluationTemplateService';
import { checkColumnExists } from '@/services/databaseUtilsService';

// Get evaluation data
export const getEvaluationData = async (evaluationId: string) => {
  try {
    // Check if form_data column exists in evaluations table
    const hasFormDataColumn = await checkColumnExists('evaluations', 'form_data');
    
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

    // Get the default template
    const template = getDefaultTemplate();

    // If form_data column doesn't exist, provide an empty object
    const evaluationWithFormData = {
      ...evaluation,
      form_data: hasFormDataColumn && evaluation.form_data ? evaluation.form_data : {}
    };

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
    const hasFormDataColumn = await checkColumnExists('evaluations', 'form_data');
    
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
    const hasFormDataColumn = await checkColumnExists('evaluations', 'form_data');
    
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
