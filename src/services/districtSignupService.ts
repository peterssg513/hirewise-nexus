
import { supabase } from '@/integrations/supabase/client';

export interface BasicInfo {
  districtName: string;
  state: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  districtSize: number;
}

export interface ProfileData {
  description: string;
  location: string;
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
 * Saves basic information for a district
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
    
    // Update district details
    const { error: districtError } = await supabase
      .from('districts')
      .update({
        name: data.districtName,
        state: data.state,
        first_name: data.firstName,
        last_name: data.lastName,
        job_title: data.jobTitle,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        website: data.website,
        district_size: data.districtSize,
        signup_progress: 'basic_info',
      })
      .eq('user_id', validUserId);
      
    if (districtError) throw districtError;
  } catch (error) {
    handleApiError(error, 'Failed to save basic information');
  }
};

/**
 * Saves meeting information
 */
export const saveMeetingInfo = async (userId: string, meetingDate: Date): Promise<void> => {
  const validUserId = validateUserId(userId);
  
  try {
    const { error } = await supabase
      .from('districts')
      .update({
        meeting_scheduled: true,
        meeting_date: meetingDate.toISOString(),
        signup_progress: 'meeting'
      })
      .eq('user_id', validUserId);
      
    if (error) throw error;
  } catch (error) {
    handleApiError(error, 'Failed to save meeting information');
  }
};

/**
 * Saves profile information
 */
export const saveProfileData = async (userId: string, data: ProfileData): Promise<void> => {
  const validUserId = validateUserId(userId);
  
  try {
    const { error } = await supabase
      .from('districts')
      .update({
        description: data.description,
        location: data.location,
        signup_progress: 'profile'
      })
      .eq('user_id', validUserId);
      
    if (error) throw error;
  } catch (error) {
    handleApiError(error, 'Failed to save profile information');
  }
};

/**
 * Completes the signup process
 */
export const completeSignup = async (userId: string): Promise<void> => {
  const validUserId = validateUserId(userId);
  
  try {
    const { error } = await supabase
      .from('districts')
      .update({
        signup_completed: true,
        signup_progress: 'completed'
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
export const getDistrictSignupProgress = async (userId: string): Promise<number> => {
  const validUserId = validateUserId(userId);
  
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('signup_progress, signup_completed')
      .eq('user_id', validUserId)
      .single();
      
    if (error) throw error;
    
    if (data.signup_completed) {
      return 4; // Final step
    }
    
    // Convert enum status to step number
    switch (data.signup_progress) {
      case 'basic_info': return 2;
      case 'meeting': return 3;
      case 'profile': return 4;
      default: return 1;
    }
  } catch (error) {
    console.error('Failed to get signup progress:', error);
    return 1; // Default to the first step
  }
};
