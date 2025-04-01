
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { EvaluationFormValues } from '../schema';

interface ContactSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      
      <FormField
        control={form.control}
        name="general_education_teacher"
        render={({ field }) => (
          <FormItem>
            <FormLabel>General Education Teacher</FormLabel>
            <FormControl>
              <Input placeholder="Teacher name, subject, email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="special_education_teachers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Education Teachers/Interventionist</FormLabel>
            <FormControl>
              <Input placeholder="Teacher name, services, email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="parents"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parents/Guardians</FormLabel>
            <FormControl>
              <Input placeholder="Parent/Guardian names" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
