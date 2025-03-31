
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GRADE_LEVELS,
  SERVICE_TYPES,
  EVALUATION_STATUS_OPTIONS,
  fetchEvaluationPaymentRate
} from '@/services/evaluationPaymentService';
import { createEvaluationRequest, EvaluationRequest } from '@/services/evaluationRequestService';
import { fetchSchools, School } from '@/services/schoolService';
import { fetchStudents } from '@/services/studentService';
import { STATES } from '@/services/stateSalaryService';
import { Loader2 } from 'lucide-react';

const evaluationFormSchema = z.object({
  legal_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  age: z.string().optional(),
  grade: z.string().optional(),
  district_id: z.string(),
  school_id: z.string().optional(),
  student_id: z.string().optional(),
  general_education_teacher: z.string().optional(),
  special_education_teachers: z.string().optional(),
  parents: z.string().optional(),
  other_relevant_info: z.string().optional(),
  service_type: z.string().optional(),
  status: z.string().optional(),
  state: z.string().optional(),
  payment_amount: z.string().optional(),
});

export type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;

export interface CreateEvaluationFormProps {
  districtId: string;
  onEvaluationCreated: (evaluation: EvaluationRequest) => void;
  onOpenChange: (open: boolean) => void;
}

export const CreateEvaluationForm: React.FC<CreateEvaluationFormProps> = ({ 
  districtId, 
  onEvaluationCreated,
  onOpenChange
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      legal_name: '',
      date_of_birth: '',
      age: '',
      grade: '',
      district_id: districtId,
      school_id: '',
      student_id: '',
      general_education_teacher: '',
      special_education_teachers: '',
      parents: '',
      other_relevant_info: '',
      service_type: '',
      status: 'Open',
      state: '',
      payment_amount: '',
    },
  });

  useEffect(() => {
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
        setStudents(studentsData.map(student => ({ 
          id: student.id, 
          name: `${student.first_name} ${student.last_name}` 
        })));
      } catch (error) {
        console.error('Failed to load students:', error);
      }
    };

    loadSchools();
    loadStudents();
  }, [districtId]);

  const handleServiceTypeChange = async (serviceType: string) => {
    form.setValue('service_type', serviceType);
    const stateCode = form.getValues('state');
    
    if (stateCode && serviceType) {
      try {
        const paymentAmount = await fetchEvaluationPaymentRate(stateCode, serviceType);
        if (paymentAmount) {
          form.setValue('payment_amount', paymentAmount.toString());
        }
      } catch (error) {
        console.error('Failed to fetch payment rate:', error);
      }
    }
  };

  const handleStateChange = async (stateCode: string) => {
    form.setValue('state', stateCode);
    const serviceType = form.getValues('service_type');
    
    if (stateCode && serviceType) {
      try {
        const paymentAmount = await fetchEvaluationPaymentRate(stateCode, serviceType);
        if (paymentAmount) {
          form.setValue('payment_amount', paymentAmount.toString());
        }
      } catch (error) {
        console.error('Failed to fetch payment rate:', error);
      }
    }
  };

  const handleStudentSelect = (studentId: string) => {
    if (studentId === 'none') {
      form.setValue('student_id', '');
      form.setValue('legal_name', '');
      return;
    }
    
    form.setValue('student_id', studentId);
    
    // Find the selected student and populate legal name field
    const selectedStudent = students.find(student => student.id === studentId);
    if (selectedStudent) {
      form.setValue('legal_name', selectedStudent.name);
    }
  };

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
      form.reset();
    } catch (error) {
      console.error('Failed to create evaluation request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evaluation Status*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVALUATION_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
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
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select 
                    onValueChange={handleStudentSelect} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Add details manually)</SelectItem>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
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
                    <Input type="number" placeholder="Student's age" {...field} />
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select 
                    onValueChange={handleStateChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
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
                    onValueChange={handleServiceTypeChange} 
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
          </div>

          <FormField
            control={form.control}
            name="payment_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Amount ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Payment amount based on state and service type" 
                    {...field} 
                    readOnly 
                    className="bg-gray-50"
                  />
                </FormControl>
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
          
          <FormField
            control={form.control}
            name="other_relevant_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Other Relevant Information</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional information about the student..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Evaluation'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
