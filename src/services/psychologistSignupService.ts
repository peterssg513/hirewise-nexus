
import { supabase } from '@/integrations/supabase/client';
import { saveCertifications, Certification } from './certificationService';

export interface Education {
  id: string;
  institution: string;
  field: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  id: string;
  organization: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}

export interface BasicInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ProfileData {
  profilePictureUrl: string | null;
  experiences: Experience[];
  education: Education[];
}

export interface PreferencesData {
  workTypes: string[];
  evaluationTypes: string[];
  desiredLocations: string[];
  openToRelocation: boolean;
}

/**
 * Validates a user ID
 */
const validateUserId = (userId: string | undefined | null): string => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  return userId;
};

/**
 * Handles API errors consistently
 */
const handleApiError = (error: any, message: string): never => {
  console.error(`${message}:`, error);
  throw new Error(`${message}: ${error.message || 'Unknown error'}`);
};

/**
 * Updates a psychologist's signup progress
 */
const updateSignupProgress = async (userId: string, step: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('psychologists')
      .update({ signup_progress: step })
      .eq('user_id', userId);
      
    if (error) throw error;
  } catch (error) {
    handleApiError(error, 'Failed to update signup progress');
  }
};

/**
 * Saves basic information for a psychologist
 */
export const saveBasicInfo = async (userId: string, data: BasicInfo): Promise<void> => {
  const validUserId = validateUserId(userId);
  
  try {
    // Update profile name
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        name: `${data.firstName} ${data.lastName}`,
      })
      .eq('id', validUserId);
      
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
      .eq('user_id', validUserId);
      
    if (psychologistError) throw psychologistError;
  } catch (error) {
    handleApiError(error, 'Failed to save basic information');
  }
};

/**
 * Saves profile data (experiences, education, profile picture)
 */
export const saveProfileData = async (userId: string, data: ProfileData): Promise<void> => {
  const validUserId = validateUserId(userId);
  
  try {
    // Check if experience or experience_details column exists
    const { data: columnData, error: columnError } = await supabase
      .from('psychologists')
      .select('*')
      .limit(1)
      .single();
    
    if (columnError && columnError.code !== 'PGRST116') throw columnError;
    
    const hasExperienceColumn = columnData && 'experience' in columnData;
    const experienceColumnName = hasExperienceColumn ? 'experience' : 'experience_details';
    
    // Update psychologist profile
    const { error } = await supabase
      .from('psychologists')
      .update({
        profile_picture_url: data.profilePictureUrl,
        education: JSON.stringify(data.education),
        [experienceColumnName]: JSON.stringify(data.experiences),
        signup_progress: 3,
      })
      .eq('user_id', validUserId);
      
    if (error) throw error;
  } catch (error) {
    handleApiError(error, 'Failed to save profile data');
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
  const validUserId = validateUserId(userId);
  
  if (!data.workTypes || data.workTypes.length === 0) {
    throw new Error('At least one work type is required');
  }
  
  if (!data.evaluationTypes || data.evaluationTypes.length === 0) {
    throw new Error('At least one evaluation type is required');
  }
  
  if (!data.desiredLocations || data.desiredLocations.length === 0) {
    throw new Error('At least one desired location is required');
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
      .eq('user_id', validUserId);
      
    if (error) throw error;
  } catch (error) {
    handleApiError(error, 'Failed to save preferences');
  }
};

/**
 * Completes the signup process
 */
export const completeSignup = async (userId: string): Promise<void> => {
  const validUserId = validateUserId(userId);
  
  try {
    const { error } = await supabase
      .from('psychologists')
      .update({
        signup_completed: true,
        signup_progress: 5,
      })
      .eq('user_id', validUserId);
      
    if (error) throw error;
  } catch (error) {
    handleApiError(error, 'Failed to complete signup');
  }
};

/**
 * Retrieves the current signup progress
 */
export const getSignupProgress = async (userId: string): Promise<number> => {
  const validUserId = validateUserId(userId);
  
  try {
    const { data, error } = await supabase
      .from('psychologists')
      .select('signup_progress, signup_completed')
      .eq('user_id', validUserId)
      .single();
      
    if (error) throw error;
    
    if (data.signup_completed) {
      return 5; // Final step
    }
    
    return data.signup_progress || 1;
  } catch (error) {
    handleApiError(error, 'Failed to get signup progress');
  }
};

/**
 * Retrieves the entire signup data for a psychologist
 */
export const getSignupData = async (userId: string) => {
  const validUserId = validateUserId(userId);
  
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
      .eq('user_id', validUserId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    handleApiError(error, 'Failed to get signup data');
  }
};
