
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EvaluationFormValues } from '../schema';
import { GRADE_LEVELS } from '@/services/evaluationPaymentService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudentSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
}

export const StudentSection: React.FC<StudentSectionProps> = ({
  form
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Student Information</h3>
      
      <FormField 
        control={form.control} 
        name="legal_name" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Student Legal Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter student's legal name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField 
          control={form.control} 
          name="age" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter age" min="0" max="25" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField 
          control={form.control} 
          name="grade" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Grade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GRADE_LEVELS.map(grade => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField 
        control={form.control} 
        name="other_relevant_info" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Information</FormLabel>
            <FormControl>
              <Input placeholder="Enter any additional information about the student" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
