
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { School, fetchSchools } from '@/services/schoolService';
import { Student, updateStudent } from '@/services/studentService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  onStudentUpdated: (student: Student) => void;
}

const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const formSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  grade: z.string().optional(),
  current_teacher: z.string().optional(),
  school_id: z.string().optional(),
  parent_guardian1_name: z.string().optional(),
  parent_guardian2_name: z.string().optional(),
  parent_guardian1_phone: z.string().optional(),
  parent_guardian1_email: z.string().email().optional().or(z.literal('')),
  parent_guardian2_phone: z.string().optional(),
  parent_guardian2_email: z.string().email().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export const EditStudentDialog: React.FC<EditStudentDialogProps> = ({
  open,
  onOpenChange,
  student,
  onStudentUpdated,
}) => {
  const [schools, setSchools] = useState<School[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: student.first_name,
      last_name: student.last_name,
      grade: student.grade || '',
      current_teacher: student.current_teacher || '',
      school_id: student.school_id || '',
      parent_guardian1_name: student.parent_guardian1_name || '',
      parent_guardian2_name: student.parent_guardian2_name || '',
      parent_guardian1_phone: student.parent_guardian1_phone || '',
      parent_guardian1_email: student.parent_guardian1_email || '',
      parent_guardian2_phone: student.parent_guardian2_phone || '',
      parent_guardian2_email: student.parent_guardian2_email || '',
    },
  });

  const { formState } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    if (open && student.district_id) {
      loadSchools();
      form.reset({
        first_name: student.first_name,
        last_name: student.last_name,
        grade: student.grade || '',
        current_teacher: student.current_teacher || '',
        school_id: student.school_id || '',
        parent_guardian1_name: student.parent_guardian1_name || '',
        parent_guardian2_name: student.parent_guardian2_name || '',
        parent_guardian1_phone: student.parent_guardian1_phone || '',
        parent_guardian1_email: student.parent_guardian1_email || '',
        parent_guardian2_phone: student.parent_guardian2_phone || '',
        parent_guardian2_email: student.parent_guardian2_email || '',
      });
    }
  }, [open, student]);

  const loadSchools = async () => {
    if (!student.district_id) return;
    
    try {
      const schoolsData = await fetchSchools(student.district_id);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Failed to load schools:', error);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const updatedStudent = await updateStudent(student.id, {
        first_name: values.first_name,
        last_name: values.last_name,
        grade: values.grade || undefined,
        current_teacher: values.current_teacher || undefined,
        school_id: values.school_id || undefined,
        parent_guardian1_name: values.parent_guardian1_name || undefined,
        parent_guardian2_name: values.parent_guardian2_name || undefined,
        parent_guardian1_phone: values.parent_guardian1_phone || undefined,
        parent_guardian1_email: values.parent_guardian1_email || undefined,
        parent_guardian2_phone: values.parent_guardian2_phone || undefined,
        parent_guardian2_email: values.parent_guardian2_email || undefined,
      });
      
      onStudentUpdated(updatedStudent);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update student:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update student information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
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
                name="current_teacher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Teacher</FormLabel>
                    <FormControl>
                      <Input placeholder="Teacher name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium mb-3">Parent/Guardian #1</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="parent_guardian1_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Parent/guardian name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parent_guardian1_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="parent_guardian1_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium mb-3">Parent/Guardian #2 (Optional)</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="parent_guardian2_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Parent/guardian name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parent_guardian2_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="parent_guardian2_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
      </DialogContent>
    </Dialog>
  );
};
