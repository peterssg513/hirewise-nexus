
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { EvaluationFormValues } from '../schema';

interface AdditionalInfoSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Additional Information</h3>
      
      <FormField
        control={form.control}
        name="other_relevant_info"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other Relevant Information</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any additional information about the student..." 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
