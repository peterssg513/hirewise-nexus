
import { supabase } from '@/integrations/supabase/client';

export const setup = async () => {
  try {
    console.log('Setting up database utilities...');
    
    // Make sure the form_data column exists in evaluations table
    const { data: formDataResult, error: formDataError } = await supabase.rpc('add_form_data_column');
    
    if (formDataError) {
      console.error('Error setting up form_data column:', formDataError);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Database setup error:', error);
    return { success: false, error };
  }
};

export const enableRealtime = async () => {
  try {
    console.log('Enabling realtime features...');
    
    // Make sure we have a subscription to the needed tables
    // For realtime, we use channels in the components directly
    
    return { success: true };
  } catch (error) {
    console.error('Enable realtime error:', error);
    return { success: false, error };
  }
};

// Add the checkColumnExists function that's used in setupFormDataColumn.ts
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
