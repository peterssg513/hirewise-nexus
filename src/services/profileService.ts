
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the psychologist profile data
 */
export const fetchPsychologistProfile = async (userId: string) => {
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
  } catch (error) {
    console.error('Error fetching psychologist profile:', error);
    throw error;
  }
};

/**
 * Updates psychologist profile information
 */
export const updatePsychologistProfile = async (userId: string, profileData: any) => {
  try {
    const { data, error } = await supabase
      .from('psychologists')
      .update(profileData)
      .eq('user_id', userId)
      .select();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating psychologist profile:', error);
    throw error;
  }
};

/**
 * Creates a new psychologist profile if it doesn't exist
 */
export const createPsychologistProfile = async (userId: string) => {
  try {
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('psychologists')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    // If profile doesn't exist, create it
    if (!existingProfile) {
      const { data, error } = await supabase
        .from('psychologists')
        .insert({ user_id: userId })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    }
    
    return existingProfile;
  } catch (error) {
    console.error('Error creating psychologist profile:', error);
    throw error;
  }
};
