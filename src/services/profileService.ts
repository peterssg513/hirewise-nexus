
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Fetches the psychologist profile data
 */
export const fetchPsychologistProfile = async (userId: string) => {
  try {
    // First fetch the basic profile information
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile details:", profileError);
      throw profileError;
    }
    
    // Then fetch the psychologist-specific data with all fields
    const { data: psychologistData, error: psychologistError } = await supabase
      .from('psychologists')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (psychologistError) {
      console.error("Error details:", psychologistError);
      
      // If record not found, create a new profile
      if (psychologistError.code === 'PGRST116') {
        await createPsychologistProfile(userId);
        return fetchPsychologistProfile(userId);
      }
      
      throw psychologistError;
    }
    
    // Combine the data
    return {
      ...psychologistData,
      profiles: profileData
    };
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
    // Remove any fields that should not be directly updated
    const sanitizedData = { ...profileData };
    delete sanitizedData.id;
    delete sanitizedData.user_id;
    delete sanitizedData.profiles;
    delete sanitizedData.created_at;
    delete sanitizedData.updated_at;
    
    console.log("Updating profile with data:", sanitizedData);
    
    const { data, error } = await supabase
      .from('psychologists')
      .update(sanitizedData)
      .eq('user_id', userId)
      .select();
      
    if (error) throw error;
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
    
    return data;
  } catch (error) {
    console.error('Error updating psychologist profile:', error);
    
    toast({
      title: "Update failed",
      description: "There was an error updating your profile. Please try again.",
      variant: "destructive",
    });
    
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
      
      toast({
        title: "Profile created",
        description: "Your profile has been created. Complete your profile to improve your experience.",
      });
      
      return data;
    }
    
    return existingProfile;
  } catch (error) {
    console.error('Error creating psychologist profile:', error);
    
    toast({
      title: "Profile creation failed",
      description: "There was an error creating your profile. Please try again.",
      variant: "destructive",
    });
    
    throw error;
  }
};

/**
 * Updates a specific field in the psychologist profile
 */
export const updateProfileField = async (userId: string, field: string, value: any) => {
  try {
    const { data, error } = await supabase
      .from('psychologists')
      .update({ [field]: value })
      .eq('user_id', userId)
      .select();
      
    if (error) throw error;
    
    toast({
      title: "Profile updated",
      description: `Your ${field.replace('_', ' ')} has been updated.`,
    });
    
    return data;
  } catch (error) {
    console.error(`Error updating profile field ${field}:`, error);
    
    toast({
      title: "Update failed",
      description: "There was an error updating your profile. Please try again.",
      variant: "destructive",
    });
    
    throw error;
  }
};
