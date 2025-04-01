
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EvaluationFormValues } from '../schema';
import { GRADE_LEVELS } from '@/services/evaluationPaymentService';
import { useQuery } from '@tanstack/react-query';
import { fetchStudents } from '@/services/studentService';

interface StudentSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
}

export const StudentSection: React.FC<StudentSectionProps> = ({ form }) => {
  const districtId = form.getValues('district_id');
  
  const { data: students = [] } = useQuery({
    queryKey: ['students', districtId],
    queryFn: () => fetchStudents(districtId),
    select: (data) => data.map(student => ({ 
      id: student.id, 
      name: `${student.first_name} ${student.last_name}` 
    })),
    enabled: !!districtId
  });

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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Student Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
};
