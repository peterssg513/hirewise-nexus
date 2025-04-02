
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Job, CreateJobParams, createJob, JOB_TITLES, WORK_TYPES, DEFAULT_BENEFITS, TOP_LANGUAGES } from '@/services/jobService';
import { fetchSchools, School } from '@/services/schoolService';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, Loader2, Plus, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { jobFormSchema } from './schema';
import { JobFormValues } from './types';
import { STATES, WORK_LOCATIONS } from '@/services/stateSalaryService';
import { v4 as uuidv4 } from 'uuid';

interface CreateJobFormProps {
  districtId: string;
  onJobCreated: (job: Job) => void;
  onOpenChange: (open: boolean) => void;
}

export const CreateJobForm: React.FC<CreateJobFormProps> = ({ 
  districtId, 
  onJobCreated,
  onOpenChange
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qualifications, setQualifications] = useState<{ id: string; text: string }[]>([
    { id: uuidv4(), text: '' }
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const { toast } = useToast();
  
  const { data: schools = [], isLoading: isLoadingSchools, error: schoolsError } = useQuery({
    queryKey: ['schools', districtId],
    queryFn: () => fetchSchools(districtId),
    enabled: !!districtId
  });
  
  // Log schools fetching details for debugging
  useEffect(() => {
    console.log('Schools query:', {
      districtId,
      isLoadingSchools,
      schoolsError,
      schoolsCount: schools?.length || 0,
      schools
    });
  }, [districtId, isLoadingSchools, schoolsError, schools]);
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      district_id: districtId,
      school_id: '',
      city: '',
      state: '',
      country: 'USA',
      work_location: 'On-site',
      work_type: 'Full-time',
      qualifications: [],
      benefits: [],
      languages_required: []
    }
  });
  
  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      
      const jobData: CreateJobParams = {
        title: data.title,
        description: data.description,
        district_id: districtId,
        school_id: data.school_id || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        country: data.country || 'USA',
        work_location: data.work_location || undefined,
        work_type: data.work_type || undefined,
        qualifications: qualifications.filter(q => q.text.trim() !== '').map(q => q.text),
        benefits: DEFAULT_BENEFITS,
        languages_required: selectedLanguages
      };
      
      console.log("Submitting job with data:", jobData);
      const newJob = await createJob(jobData);
      
      toast({
        title: 'Success',
        description: 'Job created and pending admin approval',
      });
      
      onJobCreated(newJob);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to create job:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create job',
        variant: 'destructive'
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
                <Select onValueChange={field.onChange} defaultValue={field.value || "On-site"}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value || "Full-time"}>
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
                      <SelectValue placeholder={isLoadingSchools ? "Loading schools..." : "Select a school"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">No school selected</SelectItem>
                    {schools && schools.length > 0 ? (
                      schools.map((school: School) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        {isLoadingSchools ? "Loading schools..." : schoolsError ? "Error loading schools" : "No schools found"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {schoolsError && (
                  <p className="text-sm text-red-500">Failed to load schools. Please try again.</p>
                )}
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
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Job"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

