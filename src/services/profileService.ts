
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DistrictProfile {
  id: string;
  user_id: string;
  name: string;
  state: string;
  district_size?: number;
  website?: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  contact_email?: string;
  contact_phone?: string;
  status: 'pending' | 'approved' | 'rejected';
  signup_progress: 'basic_info' | 'meeting' | 'profile' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface PsychologistProfile {
  id: string;
  user_id: string;
  name?: string;
  bio?: string;
  profile_picture_url?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
  experience?: string;
  education?: string;
  certifications?: string[];
  certification_details?: object;
  desired_locations?: string[];
  open_to_relocation?: boolean;
  work_types?: string[];
  evaluation_types?: string[];
  status: 'pending' | 'approved' | 'rejected';
  signup_progress: 'basic_info' | 'verification' | 'qualifications' | 'preferences' | 'completed';
  created_at: string;
  updated_at: string;
}

export type ProfileType = 'district' | 'psychologist';

// Function to get a district profile by user ID
export async function getDistrictProfile(userId: string): Promise<DistrictProfile | null> {
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    return data as DistrictProfile;
  } catch (error: any) {
    console.error('Error fetching district profile:', error);
    toast.error('Failed to load district profile', {
      description: error.message || 'Please try again later'
    });
    return null;
  }
}

// Function to get a psychologist profile by user ID
export async function getPsychologistProfile(userId: string): Promise<PsychologistProfile | null> {
  try {
    const { data, error } = await supabase
      .from('psychologists')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    return data as PsychologistProfile;
  } catch (error: any) {
    console.error('Error fetching psychologist profile:', error);
    toast.error('Failed to load psychologist profile', {
      description: error.message || 'Please try again later'
    });
    throw error;
  }
}

// fetchPsychologistProfile is an alias for getPsychologistProfile for backward compatibility
export const fetchPsychologistProfile = getPsychologistProfile;

// Function to create a new profile
export async function createProfile(userId: string, type: ProfileType): Promise<any> {
  try {
    if (type === 'district') {
      const { data, error } = await supabase
        .from('districts')
        .insert({ user_id: userId })
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } else {
      const { data, error } = await supabase
        .from('psychologists')
        .insert({ user_id: userId })
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    }
  } catch (error: any) {
    console.error(`Error creating ${type} profile:`, error);
    toast.error(`Failed to create ${type} profile`, {
      description: error.message || 'Please try again later'
    });
    throw error;
  }
}

// createPsychologistProfile is an alias for createProfile for backward compatibility
export const createPsychologistProfile = (userId: string) => createProfile(userId, 'psychologist');

// Function to update a district profile
export async function updateDistrictProfile(userId: string, updates: Partial<DistrictProfile>): Promise<DistrictProfile | null> {
  try {
    // Handle signup_progress as a string with valid values
    if (updates.signup_progress && 
        !['basic_info', 'meeting', 'profile', 'completed'].includes(updates.signup_progress as string)) {
      updates.signup_progress = 'profile' as any; // Default fallback
    }
    
    const { data, error } = await supabase
      .from('districts')
      .update(updates as any)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Profile updated', {
      description: 'Your profile has been updated successfully'
    });
    
    return data as DistrictProfile;
  } catch (error: any) {
    console.error('Error updating district profile:', error);
    toast.error('Failed to update profile', {
      description: error.message || 'Please try again later'
    });
    return null;
  }
}

// Function to update a psychologist profile
export async function updatePsychologistProfile(userId: string, updates: Partial<PsychologistProfile>): Promise<PsychologistProfile | null> {
  try {
    // Convert certification_details object to JSON string if needed
    if (updates.certification_details && typeof updates.certification_details === 'object') {
      updates.certification_details = JSON.stringify(updates.certification_details) as any;
    }
    
    const { data, error } = await supabase
      .from('psychologists')
      .update(updates as any)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Profile updated', {
      description: 'Your profile has been updated successfully'
    });
    
    return data as PsychologistProfile;
  } catch (error: any) {
    console.error('Error updating psychologist profile:', error);
    toast.error('Failed to update profile', {
      description: error.message || 'Please try again later'
    });
    return null;
  }
}

// Function to update any profile field
export async function updateProfile(userId: string, field: string, value: any, table: 'psychologists' | 'districts' = 'psychologists'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table)
      .update({ [field]: value })
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error(`Error updating ${field}:`, error);
    toast.error('Update failed', {
      description: error.message || 'Please try again later'
    });
    return false;
  }
}

// updateProfileField is an alias for updateProfile for backward compatibility
export const updateProfileField = updateProfile;
