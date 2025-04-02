
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EvaluationRequest, SERVICE_TYPES, updateEvaluationRequest } from '@/services/evaluationRequestService';
import { useToast } from '@/hooks/use-toast';
import { fetchSchools } from '@/services/schoolService';
import { GRADE_LEVELS } from '@/services/evaluationPaymentService';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface EditEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: EvaluationRequest;
  onEvaluationUpdated: (evaluation: EvaluationRequest) => void;
}

const evaluationFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  legal_name: z.string().optional(),
  age: z.string().optional(),
  grade: z.string().optional(),
  school_id: z.string().optional(),
  other_relevant_info: z.string().optional(),
  service_type: z.string().optional(),
  location: z.string().optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;

export const EditEvaluationDialog: React.FC<EditEvaluationDialogProps> = ({ 
  open, 
  onOpenChange, 
  evaluation, 
  onEvaluationUpdated 
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      title: evaluation.title || '',
      description: evaluation.description || '',
      legal_name: evaluation.legal_name || '',
      age: evaluation.age ? String(evaluation.age) : '',
      grade: evaluation.grade || '',
      school_id: evaluation.school_id || '',
      other_relevant_info: evaluation.other_relevant_info || '',
      service_type: evaluation.service_type || '',
      location: evaluation.location || '',
    },
  });

  console.log("EditEvaluationDialog - Received evaluation with district_id:", evaluation.district_id);

  // Query schools data
  const { data: schools = [], isLoading: schoolsLoading, error: schoolsError } = useQuery({
    queryKey: ['schools', evaluation.district_id],
    queryFn: () => {
      console.log("EditEvaluationDialog - Fetching schools for district ID:", evaluation.district_id);
      return fetchSchools(evaluation.district_id);
    },
    enabled: !!evaluation.district_id && open,
    retry: 2,
    meta: {
      onError: (err: Error) => {
        console.error("Error fetching schools:", err);
      }
    }
  });

  // Log for debugging
  useEffect(() => {
    if (open) {
      console.log("EditEvaluationDialog - Schools:", schools);
      console.log("EditEvaluationDialog - Schools loading:", schoolsLoading);
      console.log("EditEvaluationDialog - Schools error:", schoolsError);
      
      form.reset({
        title: evaluation.title || '',
        description: evaluation.description || '',
        legal_name: evaluation.legal_name || '',
        age: evaluation.age ? String(evaluation.age) : '',
        grade: evaluation.grade || '',
        school_id: evaluation.school_id || '',
        other_relevant_info: evaluation.other_relevant_info || '',
        service_type: evaluation.service_type || '',
        location: evaluation.location || '',
      });
    }
  }, [open, evaluation, form, schools, schoolsLoading, schoolsError]);

  const onSubmit = async (data: EvaluationFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert age from string to number if present
      const evaluationData = {
        ...data,
        age: data.age ? parseInt(data.age, 10) : undefined,
      };
      
      const updatedEvaluation = await updateEvaluationRequest(evaluation.id, evaluationData);
      onEvaluationUpdated(updatedEvaluation);
      toast({
        title: 'Success',
        description: 'Evaluation request updated successfully.',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update evaluation request:', error);
      toast({
        title: 'Error',
        description: 'Failed to update evaluation request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Evaluation Request</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Evaluation title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
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
              name="legal_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Student's full legal name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Student age" {...field} />
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
                    <FormLabel>Grade</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GRADE_LEVELS.map((grade) => (
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Evaluation location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  {schoolsLoading ? (
                    <div className="flex items-center space-x-2 py-2">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-muted-foreground">Loading schools...</span>
                    </div>
                  ) : schoolsError ? (
                    <div className="text-sm text-red-500 py-2">
                      Error loading schools. Please try again.
                    </div>
                  ) : schools.length === 0 ? (
                    <div className="text-sm text-amber-500 py-2">
                      No schools found for your district.
                    </div>
                  ) : (
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a school" />
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
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="other_relevant_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional information about the student..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Evaluation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
