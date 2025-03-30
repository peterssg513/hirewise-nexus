
import { supabase } from '@/integrations/supabase/client';
import { checkColumnExists } from '@/services/databaseUtilsService';

// Setup form_data column in evaluations table
export const setupFormDataColumn = async () => {
  try {
    // Check if form_data column exists in evaluations table
    const hasFormDataColumn = await checkColumnExists('evaluations', 'form_data');
    
    if (!hasFormDataColumn) {
      console.log('Form data column does not exist, adding it now...');
      
      // Execute Supabase function to add the column
      const { error } = await supabase.rpc('add_form_data_column');
      if (error) {
        console.error('Error adding form_data column:', error);
      } else {
        console.log('Successfully added form_data column to evaluations table');
      }
    } else {
      console.log('Form data column already exists in evaluations table');
    }
  } catch (error) {
    console.error('Error setting up form_data column:', error);
  }
};
