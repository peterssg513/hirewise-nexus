
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a column exists in a table
 */
export const columnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    // More reliable method to check if column exists using raw SQL query
    const { data, error } = await supabase.rpc('get_column_info', {
      table_name: tableName,
      column_name: columnName
    });
    
    if (error) {
      console.error('Error checking column existence:', error);
      
      // Fallback method if RPC is not available
      const { data: tableData, error: tableError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
        .single();
        
      if (tableError && tableError.code !== 'PGRST116') {
        console.error('Fallback query error:', tableError);
        return false;
      }
      
      return tableData && columnName in tableData;
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
    // Direct SQL execution isn't available in frontend code
    // This is just a placeholder, the actual function is created in the SQL migration
    console.log('Column check function should be set up via SQL migration');
  } catch (error) {
    console.error('Error setting up column check function:', error);
  }
};
