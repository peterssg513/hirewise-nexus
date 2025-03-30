
import { supabase } from '@/integrations/supabase/client';

// Function to check if a column exists in a table
export const checkColumnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('get_column_info' as any, {
      table_name: tableName,
      column_name: columnName
    });
    
    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists in ${tableName}:`, error);
    return false;
  }
};
