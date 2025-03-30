
import { supabase } from '@/integrations/supabase/client';

// Function to check if a column exists in a table
export const checkColumnExists = async (tableName: string, columnName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('get_column_info', {
      table_name: tableName,
      column_name: columnName
    });
    
    if (error) {
      console.error(`Error checking if column ${columnName} exists in ${tableName}:`, error);
      
      // Fallback method if RPC is not available
      const { data: tableData, error: tableError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
        
      if (tableError) {
        console.error('Fallback query error:', tableError);
        return false;
      }
      
      // Check if the column exists in the returned data
      return tableData && tableData.length > 0 && columnName in tableData[0];
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists in ${tableName}:`, error);
    return false;
  }
};
