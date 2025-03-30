
import { supabase } from '@/integrations/supabase/client';
import { saveCertifications, Certification } from './certificationService';

export interface Education {
  id: string;
  schoolName: string;
  major: string;
  degree: string;
  startYear: string;
  endYear: string;
}

export interface Experience {
  id: string;
  companyName: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}

interface BasicInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ProfileData {
  profilePictureUrl: string | null;
  experiences: Experience[];
  education: Education[];
}

interface PreferencesData {
  workTypes: string[];
  evaluationTypes: string[];
  desiredLocations: string[];
  openToRelocation: boolean;
}

/**
 * Saves basic information for a psychologist
 */
export const saveBasicInfo = async (userId: string, data: BasicInfo): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    // Update profile name
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        name: `${data.firstName} ${data.lastName}`,
      })
      .eq('id', userId);
      
    if (profileError) throw profileError;
    
    // Update psychologist details
    const { error: psychologistError } = await supabase
      .from('psychologists')
      .update({
        phone_number: data.phoneNumber,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        signup_progress: 2,
      })
      .eq('user_id', userId);
      
    if (psychologistError) throw psychologistError;
  } catch (error: any) {
    console.error('Failed to save basic information:', error);
    throw new Error(`Failed to save basic information: ${error.message}`);
  }
};

/**
 * Saves profile data (experiences, education, profile picture)
 */
export const saveProfileData = async (userId: string, data: ProfileData): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    // Update psychologist profile
    const { error } = await supabase
      .from('psychologists')
      .update({
        profile_picture_url: data.profilePictureUrl,
        education: JSON.stringify(data.education),
        experience_details: JSON.stringify(data.experiences),
        signup_progress: 3,
      })
      .eq('user_id', userId);
      
    if (error) throw error;
  } catch (error: any) {
    console.error('Failed to save profile data:', error);
    throw new Error(`Failed to save profile data: ${error.message}`);
  }
};

/**
 * Saves certification data
 */
export const saveCertificationData = async (userId: string, certifications: Certification[]): Promise<void> => {
  return saveCertifications(userId, certifications);
};

/**
 * Saves preferences data
 */
export const savePreferences = async (userId: string, data: PreferencesData): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    // Update psychologist preferences
    const { error } = await supabase
      .from('psychologists')
      .update({
        desired_locations: data.desiredLocations,
        work_types: data.workTypes,
        evaluation_types: data.evaluationTypes,
        open_to_relocation: data.openToRelocation,
        signup_progress: 5,
      })
      .eq('user_id', userId);
      
    if (error) throw error;
  } catch (error: any) {
    console.error('Failed to save preferences:', error);
    throw new Error(`Failed to save preferences: ${error.message}`);
  }
};

/**
 * Completes the signup process
 */
export const completeSignup = async (userId: string): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    const { error } = await supabase
      .from('psychologists')
      .update({
        signup_completed: true,
        signup_progress: 5,
      })
      .eq('user_id', userId);
      
    if (error) throw error;
  } catch (error: any) {
    console.error('Failed to complete signup:', error);
    throw new Error(`Failed to complete signup: ${error.message}`);
  }
};

/**
 * Retrieves the current signup progress
 */
export const getSignupProgress = async (userId: string): Promise<number> => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    const { data, error } = await supabase
      .from('psychologists')
      .select('signup_progress, signup_completed')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    if (data.signup_completed) {
      return 5; // Final step
    }
    
    return data.signup_progress || 1;
  } catch (error: any) {
    console.error('Failed to get signup progress:', error);
    throw new Error(`Failed to get signup progress: ${error.message}`);
  }
};

/**
 * Retrieves the entire signup data for a psychologist
 */
export const getSignupData = async (userId: string) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    const { data, error } = await supabase
      .from('psychologists')
      .select(`
        *,
        profiles:user_id(
          name, 
          email
        )
      `)
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Failed to get signup data:', error);
    throw new Error(`Failed to get signup data: ${error.message}`);
  }
};
