
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
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
            <FormLabel>Additional Information</FormLabel>
            <FormDescription>
              Please provide any additional information that may be relevant to this evaluation request.
            </FormDescription>
            <FormControl>
              <Textarea 
                placeholder="Enter any additional information here..."
                className="min-h-[120px]"
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
