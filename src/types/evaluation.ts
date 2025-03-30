
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
  student_name?: string;
  student_grade?: string;
  evaluation_date?: string;
  test_scores?: Record<string, any>;
  observations?: Record<string, any>;
  recommendations?: string;
  [key: string]: any; // Allow for additional fields
}

export interface Evaluation {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  approved_at: string | null;
  report_url: string | null;
  application_id: string;
  form_data?: EvaluationFormData;
}
