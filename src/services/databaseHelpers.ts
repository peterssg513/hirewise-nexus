
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a column exists in a table
 */
export const columnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    // Query the information_schema to check if the column exists
    const { data, error } = await supabase.rpc('get_column_info', {
      table_name: tableName,
      column_name: columnName
    });
    
    if (error) {
      console.error('Error checking column existence:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking column existence:', error);
    return false;
  }
};

/**
 * Creates a custom Supabase RPC function to check column existence
 * This should be run once on application setup
 */
export const setupColumnCheckFunction = async (): Promise<void> => {
  try {
    const { error } = await supabase.rpc('setup_column_check_function');
    if (error) {
      console.error('Error setting up column check function:', error);
    }
  } catch (error) {
    console.error('Error setting up column check function:', error);
  }
};
