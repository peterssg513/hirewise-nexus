
export type EvaluationRequestStatus = 'pending' | 'active' | 'completed' | 'rejected';

export interface EvaluationRequest {
  id: string;
  student_id?: string;
  legal_name?: string;
  date_of_birth?: string;
  age?: number | string;
  district_id?: string;
  school_id?: string;
  grade?: string;
  general_education_teacher?: string;
  special_education_teachers?: string;
  parents?: string;
  other_relevant_info?: string;
  service_type?: string;
  status: EvaluationRequestStatus;
  created_at: string;
  updated_at: string;
  timeframe?: string;
  skills_required?: string[];
}
