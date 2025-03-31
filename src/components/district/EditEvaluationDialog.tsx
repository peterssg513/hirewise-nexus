
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { School, fetchSchools } from '@/services/schoolService';
import { Student, fetchStudents, fetchStudentById } from '@/services/studentService';
import { EvaluationRequest, updateEvaluationRequest, SERVICE_TYPES } from '@/services/evaluationRequestService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EditEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: EvaluationRequest;
  onEvaluationUpdated: (evaluation: EvaluationRequest) => void;
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

export const EditEvaluationDialog: React.FC<EditEvaluationDialogProps> = ({
  open,
  onOpenChange,
  evaluation,
  onEvaluationUpdated,
}) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<string>(evaluation.student_id ? 'existing' : 'new');
  const [studentName, setStudentName] = useState<string>('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      student_id: evaluation.student_id || '',
      legal_name: evaluation.legal_name || '',
      date_of_birth: evaluation.date_of_birth ? new Date(evaluation.date_of_birth).toISOString().split('T')[0] : '',
      age: evaluation.age ? evaluation.age.toString() : '',
      grade: evaluation.grade || '',
      school_id: evaluation.school_id || '',
      general_education_teacher: evaluation.general_education_teacher || '',
      special_education_teachers: evaluation.special_education_teachers || '',
      parents: evaluation.parents || '',
      other_relevant_info: evaluation.other_relevant_info || '',
      service_type: evaluation.service_type || '',
    },
  });

  const { formState } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    if (open && evaluation.district_id) {
      loadSchools();
      loadStudents();
      if (evaluation.student_id) {
        loadStudentName(evaluation.student_id);
      }
      
      form.reset({
        student_id: evaluation.student_id || '',
        legal_name: evaluation.legal_name || '',
        date_of_birth: evaluation.date_of_birth ? new Date(evaluation.date_of_birth).toISOString().split('T')[0] : '',
        age: evaluation.age ? evaluation.age.toString() : '',
        grade: evaluation.grade || '',
        school_id: evaluation.school_id || '',
        general_education_teacher: evaluation.general_education_teacher || '',
        special_education_teachers: evaluation.special_education_teachers || '',
        parents: evaluation.parents || '',
        other_relevant_info: evaluation.other_relevant_info || '',
        service_type: evaluation.service_type || '',
      });
    }
  }, [open, evaluation]);

  const loadSchools = async () => {
    if (!evaluation.district_id) return;
    
    try {
      const schoolsData = await fetchSchools(evaluation.district_id);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Failed to load schools:', error);
    }
  };

  const loadStudents = async () => {
    if (!evaluation.district_id) return;
    
    try {
      const studentsData = await fetchStudents(evaluation.district_id);
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  const loadStudentName = async (studentId: string) => {
    try {
      const student = await fetchStudentById(studentId);
      if (student) {
        setStudentName(`${student.first_name} ${student.last_name}`);
      }
    } catch (error) {
      console.error('Failed to load student name:', error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const updatedEvaluation = await updateEvaluationRequest(evaluation.id, {
        student_id: activeTab === 'existing' ? values.student_id : null,
        legal_name: values.legal_name || undefined,
        date_of_birth: values.date_of_birth || undefined,
        age: values.age,
        grade: values.grade || undefined,
        school_id: values.school_id || undefined,
        general_education_teacher: values.general_education_teacher || undefined,
        special_education_teachers: values.special_education_teachers || undefined,
        parents: values.parents || undefined,
        other_relevant_info: values.other_relevant_info || undefined,
        service_type: values.service_type || undefined,
      });
      
      onEvaluationUpdated(updatedEvaluation);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update evaluation:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Evaluation Request</DialogTitle>
          <DialogDescription>
            Update evaluation request details
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Student</TabsTrigger>
            <TabsTrigger value="new">New Student</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <TabsContent value="existing">
                <FormField
                  control={form.control}
                  name="student_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Student</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
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
                {studentName && (
                  <p className="text-sm text-gray-500 mt-2">
                    Current student: {studentName}
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="new">
                <div className="space-y-4">
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
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
