
import { supabase } from '@/integrations/supabase/client';

export interface EvaluationData {
  id: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  report_url: string | null;
  evaluation_data: any;
  application_id: string;
}

export interface StudentInfo {
  name: string;
  dob: string;
  grade: string;
  school: string;
  referralReason: string;
}

export interface AssessmentData {
  testsAdministered: string[];
  cognitiveResults: string;
  academicResults: string;
  behavioralResults: string;
  socialEmotionalResults: string;
}

export interface Conclusions {
  summary: string;
  diagnosis?: string;
  recommendations: string;
}

export interface CompleteEvaluationForm {
  studentInfo: StudentInfo;
  assessmentData: AssessmentData;
  conclusions: Conclusions;
}

/**
 * Fetch an evaluation by ID
 */
export const fetchEvaluation = async (id: string): Promise<EvaluationData> => {
  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      id, 
      status, 
      created_at, 
      submitted_at, 
      report_url,
      evaluation_data,
      application_id
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(`Error fetching evaluation: ${error.message}`);
  }
  
  return data as EvaluationData;
};

/**
 * Save draft evaluation data
 */
export const saveEvaluationDraft = async (
  evaluationId: string, 
  formData: Partial<CompleteEvaluationForm>
): Promise<void> => {
  const { error } = await supabase
    .from('evaluations')
    .update({
      evaluation_data: formData,
      status: 'in_progress',
    })
    .eq('id', evaluationId);
  
  if (error) {
    throw new Error(`Error saving evaluation draft: ${error.message}`);
  }
};

/**
 * Submit completed evaluation
 */
export const submitEvaluation = async (
  evaluationId: string, 
  formData: CompleteEvaluationForm
): Promise<void> => {
  const { error } = await supabase
    .from('evaluations')
    .update({
      evaluation_data: formData,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
    .eq('id', evaluationId);
  
  if (error) {
    throw new Error(`Error submitting evaluation: ${error.message}`);
  }
};

/**
 * Generate a PDF report from evaluation data (simulated)
 */
export const generatePdfReport = async (evaluationId: string): Promise<string> => {
  // In a real implementation, this would call an API to generate a PDF
  // For now, we'll simulate it
  
  const { data, error } = await supabase
    .from('evaluations')
    .update({
      report_url: `https://example.com/reports/${evaluationId}.pdf`, // Simulated URL
    })
    .eq('id', evaluationId)
    .select('report_url')
    .single();
  
  if (error) {
    throw new Error(`Error generating PDF report: ${error.message}`);
  }
  
  return data.report_url;
};

/**
 * Fetch evaluations for a psychologist
 */
export const fetchPsychologistEvaluations = async (psychologistId: string): Promise<EvaluationData[]> => {
  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      id, 
      status, 
      created_at, 
      submitted_at, 
      report_url,
      evaluation_data,
      application_id,
      application:applications!inner(psychologist_id)
    `)
    .eq('applications.psychologist_id', psychologistId);
  
  if (error) {
    throw new Error(`Error fetching evaluations: ${error.message}`);
  }
  
  return data as EvaluationData[];
};

/**
 * Generate AI-assisted content for evaluation sections (simulated)
 */
export const generateAIContent = async (prompt: string, section: string): Promise<string> => {
  // In a real implementation, this would call an AI API like OpenAI
  // For now, we'll return canned responses
  const responses: Record<string, string> = {
    cognitiveResults: "Based on cognitive assessment, the student demonstrates average to above-average intellectual functioning...",
    academicResults: "Academic achievement testing indicates performance consistent with grade-level expectations in most areas...",
    behavioralResults: "Behavioral assessment using standardized measures indicates elevated scores in attention problems...",
    socialEmotionalResults: "Social-emotional assessment reveals generally positive adjustment with some areas of concern...",
    summary: "This comprehensive psychoeducational evaluation was conducted to address concerns regarding academic performance...",
    recommendations: "Based on the evaluation results, the following recommendations are provided..."
  };
  
  // In a real implementation, add a delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return responses[section] || "AI-generated content would appear here.";
};
