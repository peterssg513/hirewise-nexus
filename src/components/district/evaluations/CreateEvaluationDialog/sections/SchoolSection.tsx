
import React, { useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface SchoolSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
  districtId: string;
}

export const SchoolSection: React.FC<SchoolSectionProps> = ({ form, districtId }) => {
  const { toast } = useToast();
  
  // Add better debugging information
  console.log("SchoolSection - Received districtId:", districtId);
  
  const { data: schools = [], isLoading, error, refetch } = useQuery({
    queryKey: ['schools', districtId],
    queryFn: () => {
      console.log("SchoolSection - Fetching schools for district ID:", districtId);
      return fetchSchools(districtId);
    },
    enabled: !!districtId,
    retry: 2,
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching schools:", err);
      }
    }
  });
  
  // Log for debugging
  useEffect(() => {
    console.log("SchoolSection - District ID:", districtId);
    console.log("SchoolSection - Schools:", schools);
    console.log("SchoolSection - Loading:", isLoading);
    console.log("SchoolSection - Error:", error);
  }, [districtId, schools, isLoading, error]);

  if (isLoading) {
    return <div className="flex justify-center p-4"><LoadingSpinner size="sm" /></div>;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded">
        Error loading schools. 
        <Button variant="link" onClick={() => refetch()} className="px-2">Retry</Button>
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="text-amber-500 p-4 border border-amber-300 rounded">
        <p className="mb-2">No schools found for your district. Please add schools first.</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/district-dashboard/schools">Go to Schools</Link>
        </Button>
      </div>
    );
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
