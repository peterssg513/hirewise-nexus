
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EvaluationFormValues } from '../schema';
import { fetchSchools } from '@/services/schoolService';
import { useQuery } from '@tanstack/react-query';

interface SchoolSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
  districtId: string;
}

export const SchoolSection: React.FC<SchoolSectionProps> = ({ form, districtId }) => {
  const { data: schools = [] } = useQuery({
    queryKey: ['schools', districtId],
    queryFn: () => fetchSchools(districtId),
    enabled: !!districtId
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">School Information</h3>
      
      <FormField
        control={form.control}
        name="school_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>School</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
