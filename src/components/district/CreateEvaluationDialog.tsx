
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EvaluationRequest, SERVICE_TYPES, createEvaluationRequest } from '@/services/evaluationRequestService';
import { useToast } from '@/hooks/use-toast';
import { fetchSchools } from '@/services/schoolService';
import { fetchStudents } from '@/services/studentService';

interface CreateEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  districtId: string;
  onEvaluationCreated: (evaluation: EvaluationRequest) => void;
}

const evaluationFormSchema = z.object({
  legal_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  age: z.string().optional(),
  grade: z.string().optional(),
  school_id: z.string().optional(),
  student_id: z.string().optional(),
  general_education_teacher: z.string().optional(),
  special_education_teachers: z.string().optional(),
  parents: z.string().optional(),
  other_relevant_info: z.string().optional(),
  service_type: z.string().optional(),
});

type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;

export const CreateEvaluationDialog: React.FC<CreateEvaluationDialogProps> = ({ 
  open, 
  onOpenChange, 
  districtId, 
  onEvaluationCreated 
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
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
      legal_name: '',
      date_of_birth: '',
      age: '',
      grade: '',
      school_id: '',
      student_id: '',
      general_education_teacher: '',
      special_education_teachers: '',
      parents: '',
      other_relevant_info: '',
      service_type: '',
    },
  });

  React.useEffect(() => {
    const loadSchools = async () => {
      try {
        const schoolsData = await fetchSchools(districtId);
        setSchools(schoolsData.map(school => ({ id: school.id, name: school.name })));
      } catch (error) {
        console.error('Failed to load schools:', error);
      }
    };

    const loadStudents = async () => {
      try {
        const studentsData = await fetchStudents(districtId);
        setStudents(studentsData.map(student => ({ 
          id: student.id, 
          name: `${student.first_name} ${student.last_name}` 
        })));
      } catch (error) {
        console.error('Failed to load students:', error);
      }
    };

    if (open) {
      loadSchools();
      loadStudents();
    }
  }, [open, districtId]);

  const onSubmit = async (data: EvaluationFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert age from string to number if present
      const evaluationData = {
        ...data,
        age: data.age ? parseInt(data.age, 10) : undefined,
        district_id: districtId
      };
      
      const newEvaluation = await createEvaluationRequest(evaluationData);
      onEvaluationCreated(newEvaluation);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Failed to create evaluation request:', error);
      toast({
        title: 'Error',
        description: 'Failed to create evaluation request. Please try again.',
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
          <DialogTitle>Create Evaluation Request</DialogTitle>
          <DialogDescription>
            Fill in the details for the new evaluation request.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="student_id">Student</Label>
              <Select onValueChange={(value) => setValue("student_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Add details manually)</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="service_type">Service Type</Label>
              <Select onValueChange={(value) => setValue("service_type", value)}>
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
              <Label htmlFor="grade">Grade</Label>
              <Input {...register("grade")} placeholder="Current grade" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="school_id">School</Label>
              <Select onValueChange={(value) => setValue("school_id", value)}>
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
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Evaluation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
