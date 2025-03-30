
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { X } from 'lucide-react';

export interface Experience {
  id: string;
  jobTitle: string;
  placeOfEmployment: string;
  yearStarted: string;
  yearWorked: string;
  description: string;
}

interface ExperienceFormProps {
  onAdd: (experience: Experience) => void;
  onCancel: () => void;
  initialData?: Experience;
  isEditing?: boolean;
}

const experienceSchema = z.object({
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  placeOfEmployment: z.string().min(2, {
    message: "Place of employment must be at least 2 characters.",
  }),
  yearStarted: z.string().min(4, {
    message: "Please enter a valid year.",
  }),
  yearWorked: z.string().min(4, {
    message: "Please enter a valid year.",
  }),
  description: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

const ExperienceForm: React.FC<ExperienceFormProps> = ({ 
  onAdd, 
  onCancel, 
  initialData,
  isEditing = false
}) => {
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || {
      jobTitle: '',
      placeOfEmployment: '',
      yearStarted: '',
      yearWorked: '',
      description: '',
    },
  });

  const onSubmit = (values: ExperienceFormValues) => {
    onAdd({
      id: initialData?.id || Date.now().toString(),
      ...values,
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
        {isEditing ? 'Edit Experience' : 'Add New Experience'}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="placeOfEmployment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Employment</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="yearStarted"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Started</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1900" max={new Date().getFullYear()} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="yearWorked"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Ended</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1900" max={new Date().getFullYear()} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    className="min-h-[100px]"
                    placeholder="Describe your responsibilities and achievements..."
                  />
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
              {isEditing ? 'Update' : 'Add'} Experience
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ExperienceForm;
