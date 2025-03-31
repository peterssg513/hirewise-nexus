
import { supabase } from '@/integrations/supabase/client';

export const setup = async () => {
  try {
    // Add Row Level Security (RLS) policies for jobs table
    const { error: policiesError } = await supabase.rpc('add_missing_rls_policies');
    
    if (policiesError) {
      console.error('Error setting up RLS policies:', policiesError);
      throw policiesError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Database setup error:', error);
    return { success: false, error };
  }
};

export const enableRealtime = async () => {
  try {
    const { error } = await supabase.rpc('enable_realtime_for_tables');
    
    if (error) {
      console.error('Error enabling realtime:', error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Enable realtime error:', error);
    return { success: false, error };
  }
};
