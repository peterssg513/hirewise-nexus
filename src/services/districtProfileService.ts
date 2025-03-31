
import { supabase } from '@/integrations/supabase/client';
import { District } from '@/types/district';

/**
 * Fetches the district profile for the current user
 */
export const fetchDistrictProfile = async (userId: string): Promise<District | null> => {
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    return data as District;
  } catch (error) {
    console.error('Error fetching district profile:', error);
    return null;
  }
};

/**
 * Updates the district profile
 */
export const updateDistrictProfile = async (userId: string, updates: Partial<District>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('districts')
      .update(updates)
      .eq('user_id', userId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error updating district profile:', error);
    throw error;
  }
};
