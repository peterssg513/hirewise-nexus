
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job, createJob, JOB_TITLES, WORK_TYPES, DEFAULT_BENEFITS, TOP_LANGUAGES } from '@/services/jobService';
import { STATES, WORK_LOCATIONS } from '@/services/stateSalaryService';
import { useToast } from '@/hooks/use-toast';
import { fetchSchools } from '@/services/schoolService';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash, Check } from 'lucide-react';

interface CreateJobFormProps {
  districtId: string;
  onJobCreated: (job: Job) => void;
  onOpenChange: (open: boolean) => void;
}

const jobFormSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("USA"),
  work_location: z.string().optional(),
  work_type: z.string().optional(),
  school_id: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export const CreateJobForm: React.FC<CreateJobFormProps> = ({ 
  districtId, 
  onJobCreated,
  onOpenChange
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [qualifications, setQualifications] = useState<{ id: string; text: string }[]>([
    { id: uuidv4(), text: '' }
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      city: '',
      state: '',
      country: 'USA',
      work_location: '',
      work_type: '',
      school_id: '',
    },
  });

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const schoolsData = await fetchSchools(districtId);
        setSchools(schoolsData.map(school => ({ id: school.id, name: school.name })));
      } catch (error) {
        console.error('Failed to load schools:', error);
      }
    };

    loadSchools();
  }, [districtId]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      
      const jobData = {
        ...data,
        district_id: districtId,
        qualifications: qualifications.filter(q => q.text.trim() !== '').map(q => q.text),
        benefits: DEFAULT_BENEFITS,
        languages_required: selectedLanguages,
      };
      
      const newJob = await createJob(jobData);
      onJobCreated(newJob);
      onOpenChange(false);
      form.reset();
      setQualifications([{ id: uuidv4(), text: '' }]);
      setSelectedLanguages([]);
    } catch (error) {
      console.error('Failed to create job:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQualification = () => {
    setQualifications(prev => [...prev, { id: uuidv4(), text: '' }]);
  };

  const updateQualification = (id: string, text: string) => {
    setQualifications(prev =>
      prev.map(q => (q.id === id ? { ...q, text } : q))
    );
  };

  const removeQualification = (id: string) => {
    setQualifications(prev => prev.filter(q => q.id !== id));
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {/* Job Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job title" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {JOB_TITLES.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Job Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Job Description"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Location Fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
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
        </div>
        
        {/* Work Details */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input value="USA" disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="work_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {WORK_LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
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
            name="work_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {WORK_TYPES.map((type) => (
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
            name="school_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a school" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No school selected</SelectItem>
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
        
        {/* Languages Section */}
        <div>
          <FormLabel>Languages Required</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2 max-h-40 overflow-y-auto p-2 border rounded">
            {TOP_LANGUAGES.map((language) => (
              <div 
                key={language}
                onClick={() => toggleLanguage(language)}
                className={`px-3 py-1 rounded-full flex items-center cursor-pointer text-sm ${
                  selectedLanguages.includes(language) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {selectedLanguages.includes(language) ? (
                  <Check className="mr-1 h-3 w-3" />
                ) : null}
                {language}
              </div>
            ))}
          </div>
        </div>
        
        {/* Qualifications Section */}
        <div>
          <FormLabel>Qualifications</FormLabel>
          {qualifications.map((qualification) => (
            <div key={qualification.id} className="flex items-center space-x-2 mt-2">
              <Input
                type="text"
                placeholder="Qualification"
                value={qualification.text}
                onChange={(e) => updateQualification(qualification.id, e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeQualification(qualification.id)}
                disabled={qualifications.length <= 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={addQualification} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Qualification
          </Button>
        </div>
        
        {/* Benefits Section */}
        <div>
          <FormLabel>Default Benefits (Included)</FormLabel>
          <div className="space-y-2 p-3 bg-gray-50 rounded border mt-2">
            {DEFAULT_BENEFITS.map((benefit, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Job"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
