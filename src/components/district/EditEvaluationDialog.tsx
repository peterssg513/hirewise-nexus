
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
  date_of_birth: z.string().optional(),
  age: z.string().optional(),
  grade: z.string().optional(),
  school_id: z.string().optional(),
  general_education_teacher: z.string().optional(),
  special_education_teachers: z.string().optional(),
  parents: z.string().optional(),
  other_relevant_info: z.string().optional(),
  service_type: z.string().optional(),
  location: z.string().optional(),
  timeframe: z.string().optional(),
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
      date_of_birth: evaluation.date_of_birth ? new Date(evaluation.date_of_birth).toISOString().split('T')[0] : '',
      age: evaluation.age ? String(evaluation.age) : '',
      grade: evaluation.grade || '',
      school_id: evaluation.school_id || '',
      general_education_teacher: evaluation.general_education_teacher || '',
      special_education_teachers: evaluation.special_education_teachers || '',
      parents: evaluation.parents || '',
      other_relevant_info: evaluation.other_relevant_info || '',
      service_type: evaluation.service_type || '',
      location: evaluation.location || '',
      timeframe: evaluation.timeframe || '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: evaluation.title || '',
        description: evaluation.description || '',
        legal_name: evaluation.legal_name || '',
        date_of_birth: evaluation.date_of_birth ? new Date(evaluation.date_of_birth).toISOString().split('T')[0] : '',
        age: evaluation.age ? String(evaluation.age) : '',
        grade: evaluation.grade || '',
        school_id: evaluation.school_id || '',
        general_education_teacher: evaluation.general_education_teacher || '',
        special_education_teachers: evaluation.special_education_teachers || '',
        parents: evaluation.parents || '',
        other_relevant_info: evaluation.other_relevant_info || '',
        service_type: evaluation.service_type || '',
        location: evaluation.location || '',
        timeframe: evaluation.timeframe || '',
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
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input {...register("date_of_birth")} type="date" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input {...register("age")} type="number" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input {...register("location")} placeholder="Evaluation location" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Input {...register("timeframe")} placeholder="When needed by" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="grade">Grade</Label>
              <Input {...register("grade")} placeholder="Current grade" />
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
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="general_education_teacher">General Education Teacher</Label>
            <Input {...register("general_education_teacher")} placeholder="Teacher name, subject, email" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="special_education_teachers">Special Education Teachers/Interventionist</Label>
            <Input {...register("special_education_teachers")} placeholder="Teacher name, services, email" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="parents">Parents/Guardians</Label>
            <Input {...register("parents")} placeholder="Parent/Guardian names" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="other_relevant_info">Other Relevant Information</Label>
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
