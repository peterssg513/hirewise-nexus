
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
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { EvaluationFormValues } from '../schema';
import { SERVICE_TYPES } from '@/services/evaluationServiceConstants';

interface ServiceSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
}

export const ServiceSection: React.FC<ServiceSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Service Information</h3>
      
      <FormField
        control={form.control}
        name="service_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Type</FormLabel>
            <FormDescription>
              Select the type of evaluation service needed
            </FormDescription>
            <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SERVICE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="timeframe"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Timeframe</FormLabel>
            <FormDescription>
              Enter the timeframe for completing this evaluation
            </FormDescription>
            <FormControl>
              <Input placeholder="e.g., 30 days, 2 weeks, by end of semester" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
