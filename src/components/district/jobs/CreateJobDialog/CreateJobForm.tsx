
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Job, createJob } from '@/services/jobService';
import { fetchSchools } from '@/services/schoolService';
import { WORK_LOCATIONS, WORK_TYPES, STATES } from '@/services/stateSalaryService';

interface CreateJobFormProps {
  districtId: string;
  onJobCreated: (job: Job) => void;
  onCancel: () => void;
}

// Define the form validation schema
const formSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(1, 'Job description is required'),
  school_id: z.string().optional(),
  work_type: z.string().min(1, 'Work type is required'),
  work_location: z.string().min(1, 'Work location is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  salary_type: z.string().optional(),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  contact_email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  application_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  application_deadline: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateJobForm: React.FC<CreateJobFormProps> = ({
  districtId,
  onJobCreated,
  onCancel
}) => {
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      school_id: '',
      work_type: '',
      work_location: '',
      city: '',
      state: '',
      salary_min: '',
      salary_max: '',
      salary_type: 'yearly',
      requirements: '',
      benefits: '',
      contact_email: '',
      contact_phone: '',
      application_url: '',
      application_deadline: '',
    },
  });

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const schoolsData = await fetchSchools(districtId);
        setSchools(schoolsData);
      } catch (error) {
        console.error('Error loading schools:', error);
      }
    };

    loadSchools();
  }, [districtId]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const jobData = {
        ...values,
        district_id: districtId,
        status: 'pending',
        salary_min: values.salary_min ? parseFloat(values.salary_min) : undefined,
        salary_max: values.salary_max ? parseFloat(values.salary_max) : undefined,
      };
      
      const newJob = await createJob(jobData);
      onJobCreated(newJob);
      form.reset();
      onCancel();
      
      toast({
        title: 'Success',
        description: 'Job created successfully! It will be reviewed by an admin before being published.',
      });
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., School Psychologist" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the job role, responsibilities, and qualifications needed..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="work_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WORK_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="work_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Location *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WORK_LOCATIONS.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Location Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
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
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No specific school</SelectItem>
                      {schools.map(school => (
                        <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
            
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List specific qualifications, certifications, experience required..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe benefits, perks, work environment..." 
                      className="min-h-[100px]" 
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Job'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
