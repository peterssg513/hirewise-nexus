
import { supabase } from '@/integrations/supabase/client';
import { checkColumnExists } from '@/services/databaseUtilsService';

// Setup form_data column in evaluations table
export const setupFormDataColumn = async () => {
  try {
    // Check if form_data column exists in evaluations table
    const hasFormDataColumn = await checkColumnExists('evaluations', 'form_data');
    
    if (!hasFormDataColumn) {
      // Execute Supabase function to add the column
      // This requires a Supabase function to be created
      const { error } = await supabase.rpc('add_form_data_column' as any);
      if (error) {
        console.error('Error adding form_data column:', error);
      } else {
        console.log('Added form_data column to evaluations table');
      }
    }
  } catch (error) {
    console.error('Error setting up form_data column:', error);
  }
};
