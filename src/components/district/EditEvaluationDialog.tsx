
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EvaluationRequest, SERVICE_TYPES, updateEvaluationRequest } from '@/services/evaluationRequestService';
import { useToast } from '@/hooks/use-toast';
import { fetchSchools } from '@/services/schoolService';
import { GRADE_LEVELS } from '@/services/evaluationPaymentService';

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
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EvaluationFormValues>({
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

  useEffect(() => {
    if (open) {
      reset({
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

      const loadSchools = async () => {
        try {
          if (evaluation.district_id) {
            const schoolsData = await fetchSchools(evaluation.district_id);
            setSchools(schoolsData.map(school => ({ id: school.id, name: school.name })));
          }
        } catch (error) {
          console.error('Failed to load schools:', error);
        }
      };

      loadSchools();
    }
  }, [open, evaluation, reset]);

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
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input {...register("title")} placeholder="Evaluation title" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea {...register("description")} placeholder="Description" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="service_type">Service Type</Label>
            <Select 
              onValueChange={(value) => setValue("service_type", value)} 
              defaultValue={evaluation.service_type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="legal_name">Legal Name</Label>
            <Input {...register("legal_name")} placeholder="Student's full legal name" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input {...register("age")} type="number" placeholder="Student age" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="grade">Grade</Label>
              <Select 
                onValueChange={(value) => setValue("grade", value)}
                defaultValue={evaluation.grade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input {...register("location")} placeholder="Evaluation location" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="school_id">School</Label>
            <Select 
              onValueChange={(value) => setValue("school_id", value)}
              defaultValue={evaluation.school_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="other_relevant_info">Additional Information</Label>
            <Textarea {...register("other_relevant_info")} placeholder="Any additional information about the student..." />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Evaluation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
