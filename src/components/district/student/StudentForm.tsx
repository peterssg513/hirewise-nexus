
import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

// Define the schema for student form
const studentFormSchema = z.object({
  first_name: z.string().min(2, { message: "First name is required" }),
  last_name: z.string().min(2, { message: "Last name is required" }),
  grade: z.string().optional(),
  current_teacher: z.string().optional(),
  school_id: z.string().optional(),
  district_id: z.string(),
  parent_guardian1_name: z.string().optional(),
  parent_guardian2_name: z.string().optional(),
  parent_guardian1_phone: z.string().optional(),
  parent_guardian1_email: z.string().email().optional(),
  parent_guardian2_phone: z.string().optional(),
  parent_guardian2_email: z.string().email().optional(),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;

interface SchoolOption {
  id: string;
  name: string;
}

interface StudentFormProps {
  onSubmit: (data: StudentFormValues) => void;
  isSubmitting: boolean;
  schools: SchoolOption[];
  districtId: string;
  defaultValues?: Partial<StudentFormValues>;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  onSubmit,
  isSubmitting,
  schools,
  districtId,
  defaultValues
}) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      district_id: districtId,
      ...defaultValues
    }
  });

  const gradeOptions = [
    "Pre-K", "Kindergarten", "1st", "2nd", "3rd", "4th", "5th", 
    "6th", "7th", "8th", "9th", "10th", "11th", "12th"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Last Name */}
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Grade */}
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gradeOptions.map((grade) => (
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
          
          {/* Current Teacher */}
          <FormField
            control={form.control}
            name="current_teacher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Teacher</FormLabel>
                <FormControl>
                  <Input placeholder="Ms. Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* School */}
          <FormField
            control={form.control}
            name="school_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
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
        
        <div className="mt-6">
          <h3 className="font-medium text-lg mb-3">Parent/Guardian Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Parent/Guardian #1 Name */}
            <FormField
              control={form.control}
              name="parent_guardian1_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian #1 Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Parent/Guardian #2 Name */}
            <FormField
              control={form.control}
              name="parent_guardian2_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian #2 Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Parent/Guardian #1 Phone */}
            <FormField
              control={form.control}
              name="parent_guardian1_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian #1 Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Parent/Guardian #2 Phone */}
            <FormField
              control={form.control}
              name="parent_guardian2_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian #2 Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Parent/Guardian #1 Email */}
            <FormField
              control={form.control}
              name="parent_guardian1_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian #1 Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="parent1@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Parent/Guardian #2 Email */}
            <FormField
              control={form.control}
              name="parent_guardian2_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian #2 Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="parent2@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                Saving...
              </>
            ) : (
              'Save Student'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
