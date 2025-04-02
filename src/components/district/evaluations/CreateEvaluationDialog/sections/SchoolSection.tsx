
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
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface SchoolSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
  districtId: string;
}

export const SchoolSection: React.FC<SchoolSectionProps> = ({ form, districtId }) => {
  const { data: schools = [], isLoading, error } = useQuery({
    queryKey: ['schools', districtId],
    queryFn: () => fetchSchools(districtId),
    enabled: !!districtId
  });

  if (isLoading) {
    return <div className="flex justify-center p-4"><LoadingSpinner /></div>;
  }

  if (error) {
    console.error("Error loading schools:", error);
    return <div className="text-red-500">Error loading schools. Please try again.</div>;
  }

  if (schools.length === 0) {
    return <div className="text-amber-500 p-4 border border-amber-300 rounded">
      No schools found for your district. Please add schools first.
    </div>;
  }

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
