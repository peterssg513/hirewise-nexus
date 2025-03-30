
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { X } from 'lucide-react';

export interface Education {
  id: string;
  schoolName: string;
  major: string;
}

interface EducationFormProps {
  onAdd: (education: Education) => void;
  onCancel: () => void;
  initialData?: Education;
  isEditing?: boolean;
}

const educationSchema = z.object({
  schoolName: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  major: z.string().min(2, {
    message: "Major must be at least 2 characters.",
  }),
});

type EducationFormValues = z.infer<typeof educationSchema>;

const EducationForm: React.FC<EducationFormProps> = ({ 
  onAdd, 
  onCancel, 
  initialData,
  isEditing = false
}) => {
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialData || {
      schoolName: '',
      major: '',
    },
  });

  const onSubmit = (values: EducationFormValues) => {
    onAdd({
      id: initialData?.id || Date.now().toString(),
      schoolName: values.schoolName,
      major: values.major,
    });
    form.reset();
  };

  return (
    <div className="border p-4 rounded-md bg-gray-50 relative mb-4">
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        onClick={onCancel}
        className="absolute top-2 right-2"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <h3 className="font-medium mb-4">
        {isEditing ? 'Edit Education' : 'Add New Education'}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Major</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white"
            >
              {isEditing ? 'Update' : 'Add'} Education
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EducationForm;
