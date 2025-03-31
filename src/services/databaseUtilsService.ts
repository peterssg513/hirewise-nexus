
import { supabase } from '@/integrations/supabase/client';

export const setup = async () => {
  try {
    // Add Row Level Security (RLS) policies for jobs table
    // Using a direct query instead of RPC since the function may not be in types yet
    const { error: policiesError } = await supabase.rpc('add_missing_rls_policies', {}, {
      count: 'none',
    });
    
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
    // Using a direct query instead of RPC since the function may not be in types yet
    const { error } = await supabase.rpc('enable_realtime_for_tables', {}, {
      count: 'none',
    });
    
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

// Add the missing checkColumnExists function that's used in setupFormDataColumn.ts
export const checkColumnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('get_column_info', {
      table_name: tableName,
      column_name: columnName
    });
    
    if (error) {
      console.error('Error checking column existence:', error);
      return false;
    }
    
    return Array.isArray(data) && data.length > 0;
  } catch (error) {
    console.error('Exception checking column existence:', error);
    return false;
  }
};
