
export type DistrictSignupStatus = 'basic_info' | 'meeting' | 'profile' | 'completed';

export interface District {
  id: string;
  name: string;
  state?: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  district_size?: number;
  description?: string;
  location?: string;
  meeting_scheduled?: boolean;
  meeting_date?: string;
  signup_progress?: DistrictSignupStatus;
  signup_completed?: boolean;
  status?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
