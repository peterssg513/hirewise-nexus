
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JobFormValues>({
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
        title: data.title,
        description: data.description,
        district_id: districtId,
        qualifications: qualifications.filter(q => q.text.trim() !== '').map(q => q.text),
        benefits: DEFAULT_BENEFITS, // Use the predefined benefits
        languages_required: selectedLanguages,
      };
      
      console.log("Submitting job data:", jobData);
      const newJob = await createJob(jobData);
      onJobCreated(newJob);
      onOpenChange(false);
      reset();
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Job Title</Label>
        <Select onValueChange={(value) => setValue("title", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select job title" />
          </SelectTrigger>
          <SelectContent>
            {JOB_TITLES.map((title) => (
              <SelectItem key={title} value={title}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Job Description"
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>
      
      <JobLocationSection 
        register={register} 
        errors={errors} 
        setValue={setValue} 
      />
      
      <JobDetailsSection 
        register={register} 
        setValue={setValue} 
        schools={schools} 
      />
      
      <LanguagesSection 
        selectedLanguages={selectedLanguages} 
        toggleLanguage={toggleLanguage} 
      />
      
      <QualificationsSection 
        qualifications={qualifications} 
        updateQualification={updateQualification}
        removeQualification={removeQualification}
        addQualification={addQualification}
      />
      
      <BenefitsSection />
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Job"}
        </Button>
      </div>
    </form>
  );
};

// Extract Job Location Section
const JobLocationSection = ({ register, errors, setValue }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="grid gap-2">
      <Label htmlFor="city">City</Label>
      <Input id="city" {...register("city")} placeholder="City" />
    </div>
    
    <div className="grid gap-2">
      <Label htmlFor="state">State</Label>
      <Select onValueChange={(value) => setValue("state", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
        <SelectContent>
          {STATES.map((state) => (
            <SelectItem key={state.code} value={state.code}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.state && (
        <p className="text-sm text-red-500">{errors.state.message}</p>
      )}
    </div>
  </div>
);

// Extract Job Details Section
const JobDetailsSection = ({ register, setValue, schools }) => (
  <div>
    <div className="grid grid-cols-2 gap-4">
      <div className="grid gap-2">
        <Label htmlFor="country">Country</Label>
        <Input id="country" value="USA" disabled placeholder="Country" />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="work_location">Work Location</Label>
        <Select onValueChange={(value) => setValue("work_location", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select work location" />
          </SelectTrigger>
          <SelectContent>
            {WORK_LOCATIONS.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="grid gap-2">
        <Label htmlFor="work_type">Work Type</Label>
        <Select onValueChange={(value) => setValue("work_type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select work type" />
          </SelectTrigger>
          <SelectContent>
            {WORK_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="school_id">School</Label>
        <Select onValueChange={(value) => setValue("school_id", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a school" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No school selected</SelectItem>
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

// Extract Languages Section
const LanguagesSection = ({ selectedLanguages, toggleLanguage }) => (
  <div>
    <Label>Languages Required</Label>
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
);

// Extract Qualifications Section
const QualificationsSection = ({ qualifications, updateQualification, removeQualification, addQualification }) => (
  <div>
    <Label>Qualifications</Label>
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
);

// Extract Benefits Section
const BenefitsSection = () => (
  <div>
    <Label>Default Benefits (Included)</Label>
    <div className="space-y-2 p-3 bg-gray-50 rounded border mt-2">
      {DEFAULT_BENEFITS.map((benefit, index) => (
        <div key={index} className="flex items-center">
          <Check className="h-4 w-4 mr-2 text-green-500" />
          <span className="text-sm">{benefit}</span>
        </div>
      ))}
    </div>
  </div>
);
