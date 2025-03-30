
import { supabase } from '@/integrations/supabase/client';

// Check if a column exists in a table
export const checkColumnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('get_column_info', {
      table_name: tableName,
      column_name: columnName
    });
    
    if (error) {
      console.error('Error checking column existence:', error);
      // Default to false if there's an error
      return false;
    }
    
    // If data is returned and has length, the column exists
    return Array.isArray(data) && data.length > 0;
  } catch (error) {
    console.error('Exception checking column existence:', error);
    // Default to false on exception
    return false;
  }
};
