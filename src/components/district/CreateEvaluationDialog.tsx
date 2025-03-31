
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { School, fetchSchools } from '@/services/schoolService';
import { Student, fetchStudents } from '@/services/studentService';
import { EvaluationRequest, createEvaluationRequest, CreateEvaluationRequestParams, SERVICE_TYPES } from '@/services/evaluationRequestService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateStudentDialog } from './CreateStudentDialog';

interface CreateEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  districtId: string;
  onEvaluationCreated: (evaluation: EvaluationRequest) => void;
}

const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const formSchema = z.object({
  student_id: z.string().optional(),
  legal_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  age: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  grade: z.string().optional(),
  school_id: z.string().optional(),
  general_education_teacher: z.string().optional(),
  special_education_teachers: z.string().optional(),
  parents: z.string().optional(),
  other_relevant_info: z.string().optional(),
  service_type: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateEvaluationDialog: React.FC<CreateEvaluationDialogProps> = ({
  open,
  onOpenChange,
  districtId,
  onEvaluationCreated,
}) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<string>('existing');
  const [createStudentDialogOpen, setCreateStudentDialogOpen] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_id: '',
      legal_name: '',
      date_of_birth: '',
      age: '',
      grade: '',
      school_id: '',
      general_education_teacher: '',
      special_education_teachers: '',
      parents: '',
      other_relevant_info: '',
      service_type: '',
    },
  });

  const { formState, watch, setValue, reset } = form;
  const { isSubmitting } = formState;
  
  const watchStudentId = watch('student_id');

  useEffect(() => {
    if (open) {
      loadSchools();
      loadStudents();
      reset();
    }
  }, [open, districtId]);

  useEffect(() => {
    if (watchStudentId) {
      const selectedStudent = students.find(s => s.id === watchStudentId);
      if (selectedStudent) {
        // Auto-fill form fields based on student data
        setValue('legal_name', `${selectedStudent.first_name} ${selectedStudent.last_name}`);
        setValue('grade', selectedStudent.grade || '');
        setValue('school_id', selectedStudent.school_id || '');
        if (selectedStudent.parent_guardian1_name) {
          setValue('parents', selectedStudent.parent_guardian1_name + 
            (selectedStudent.parent_guardian2_name ? `, ${selectedStudent.parent_guardian2_name}` : ''));
        }
      }
    }
  }, [watchStudentId, students]);

  const loadSchools = async () => {
    try {
      const schoolsData = await fetchSchools(districtId);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Failed to load schools:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const studentsData = await fetchStudents(districtId);
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const handleStudentCreated = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
    setValue('student_id', newStudent.id);
    setValue('legal_name', `${newStudent.first_name} ${newStudent.last_name}`);
    setValue('grade', newStudent.grade || '');
    setValue('school_id', newStudent.school_id || '');
    if (newStudent.parent_guardian1_name) {
      setValue('parents', newStudent.parent_guardian1_name + 
        (newStudent.parent_guardian2_name ? `, ${newStudent.parent_guardian2_name}` : ''));
    }
    setCreateStudentDialogOpen(false);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const evaluationParams: CreateEvaluationRequestParams = {
        student_id: activeTab === 'existing' ? values.student_id : undefined,
        legal_name: values.legal_name || undefined,
        date_of_birth: values.date_of_birth || undefined,
        age: values.age,
        grade: values.grade || undefined,
        district_id: districtId,
        school_id: values.school_id || undefined,
        general_education_teacher: values.general_education_teacher || undefined,
        special_education_teachers: values.special_education_teachers || undefined,
        parents: values.parents || undefined,
        other_relevant_info: values.other_relevant_info || undefined,
        service_type: values.service_type || undefined,
      };

      const newEvaluation = await createEvaluationRequest(evaluationParams);
      onEvaluationCreated(newEvaluation);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create evaluation:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Evaluation Request</DialogTitle>
          <DialogDescription>
            Create a new student evaluation request
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="existing" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Student</TabsTrigger>
            <TabsTrigger value="new">New Student</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <TabsContent value="existing">
                <div className="flex items-center gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="student_id"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Select Student</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a student" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {students.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.first_name} {student.last_name} 
                                {student.grade ? ` - Grade ${student.grade}` : ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    className="mt-8"
                    onClick={() => setCreateStudentDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add New Student
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="new">
                <div className="space-y-4 mb-4">
                  <FormField
                    control={form.control}
                    name="legal_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Student's legal name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Age" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GRADES.map((grade) => (
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
                    
                    <FormField
                      control={form.control}
                      name="parents"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parents/Guardians</FormLabel>
                          <FormControl>
                            <Input placeholder="Parent/guardian names" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-3">Evaluation Details</h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="school_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
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
                  
                  <FormField
                    control={form.control}
                    name="service_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
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
                    name="general_education_teacher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>General Education Teacher</FormLabel>
                        <FormControl>
                          <Input placeholder="Name, subject, contact details" {...field} />
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
                          <Input placeholder="Name, services, contact details" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="other_relevant_info"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Relevant Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional context or information" 
                            className="h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Evaluation'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
        
        <CreateStudentDialog
          open={createStudentDialogOpen}
          onOpenChange={setCreateStudentDialogOpen}
          districtId={districtId}
          onStudentCreated={handleStudentCreated}
        />
      </DialogContent>
    </Dialog>
  );
};
