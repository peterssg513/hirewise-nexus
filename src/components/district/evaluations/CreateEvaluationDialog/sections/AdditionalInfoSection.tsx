
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
import { Card, CardContent } from '@/components/ui/card';

interface AdditionalInfoSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ form }) => {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
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
                    placeholder="Any additional information about the student or evaluation needs..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Include any additional context that might help the psychologist understand the evaluation needs.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
