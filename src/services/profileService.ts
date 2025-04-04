
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  email: string;
  name?: string;
  role?: 'district' | 'psychologist' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface DistrictProfile {
  id: string;
  user_id: string;
  name: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
  signup_progress?: string;
  signup_completed?: boolean;
  district_size?: number;
  job_title?: string;
  state?: string;
  website?: string;
}

export interface PsychologistProfile {
  id: string;
  user_id: string;
  profile_picture_url?: string;
  experience_years?: number;
  specialties?: string[];
  education?: string;
  certifications?: string[];
  certification_details?: object;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  work_types?: string[];
  evaluation_types?: string[];
  experience?: string;
  availability?: string;
  status: 'pending' | 'approved' | 'rejected';
  signup_progress?: number;
  signup_completed?: boolean;
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    
    return data as Profile;
  } catch (error: any) {
    console.error('Error getting profile:', error);
    return null;
  }
}

export async function updateProfile(profile: Partial<Profile>): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Authentication error', {
        description: 'You must be logged in to update your profile'
      });
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Profile updated', {
      description: 'Your profile has been updated successfully'
    });
    
    return data as Profile;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    toast.error('Profile update failed', {
      description: error.message || 'An error occurred while updating your profile'
    });
    
    return null;
  }
}

export async function getDistrictProfile(): Promise<DistrictProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        toast.error('District profile not found', {
          description: 'You may need to complete the registration process'
        });
      }
      return null;
    }
    
    return data as DistrictProfile;
  } catch (error: any) {
    console.error('Error getting district profile:', error);
    return null;
  }
}

export async function updateDistrictProfile(profile: Partial<DistrictProfile>): Promise<DistrictProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Authentication error', {
        description: 'You must be logged in to update your district profile'
      });
      return null;
    }
    
    const { data, error } = await supabase
      .from('districts')
      .update(profile)
      .eq('user_id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('District profile updated', {
      description: 'Your district profile has been updated successfully'
    });
    
    return data as DistrictProfile;
  } catch (error: any) {
    console.error('Error updating district profile:', error);
    
    toast.error('District profile update failed', {
      description: error.message || 'An error occurred while updating your district profile'
    });
    
    return null;
  }
}

export async function getPsychologistProfile(): Promise<PsychologistProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('psychologists')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        toast.error('Psychologist profile not found', {
          description: 'You may need to complete the registration process'
        });
      }
      return null;
    }
    
    return data as PsychologistProfile;
  } catch (error: any) {
    console.error('Error getting psychologist profile:', error);
    return null;
  }
}

export async function updatePsychologistProfile(profile: Partial<PsychologistProfile>): Promise<PsychologistProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Authentication error', {
        description: 'You must be logged in to update your psychologist profile'
      });
      return null;
    }
    
    const { data, error } = await supabase
      .from('psychologists')
      .update(profile)
      .eq('user_id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Psychologist profile updated', {
      description: 'Your psychologist profile has been updated successfully'
    });
    
    return data as PsychologistProfile;
  } catch (error: any) {
    console.error('Error updating psychologist profile:', error);
    
    toast.error('Psychologist profile update failed', {
      description: error.message || 'An error occurred while updating your psychologist profile'
    });
    
    return null;
  }
}
