
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
  STATES, 
  WORK_TYPES, 
  WORK_LOCATIONS,
  fetchAverageSalaryByState 
} from '@/services/stateSalaryService';
import { createJob, Job } from '@/services/jobService';
import { fetchSchools, School } from '@/services/schoolService';
import { Loader2 } from 'lucide-react';

const jobFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().optional(),
  location: z.string().optional(),
  work_type: z.string().optional(),
  work_location: z.string().optional(),
  salary: z.string().optional(),
  timeframe: z.string().optional(),
  school_id: z.string().optional(),
  skills_required: z.string().array().optional(),
  qualifications: z.string().array().optional(),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

export interface CreateJobFormProps {
  districtId: string;
  onJobCreated: (job: Job) => void;
}

export const CreateJobForm: React.FC<CreateJobFormProps> = ({ districtId, onJobCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [currentQualification, setCurrentQualification] = useState('');
  
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      state: '',
      city: '',
      location: '',
      work_type: '',
      work_location: '',
      salary: '',
      timeframe: '',
      school_id: '',
      skills_required: [],
      qualifications: [],
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

    loadSchools();
  }, [districtId]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert salary string to number if present
      const salary = data.salary ? parseFloat(data.salary) : undefined;
      
      // Prepare job data
      const jobData = {
        ...data,
        skills_required: skills,
        qualifications: qualifications,
        salary,
        district_id: districtId,
      };
      
      const newJob = await createJob(jobData);
      onJobCreated(newJob);
      form.reset();
      setSkills([]);
      setQualifications([]);
    } catch (error) {
      console.error('Failed to create job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };
  
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };
  
  const handleAddQualification = () => {
    if (currentQualification.trim()) {
      setQualifications([...qualifications, currentQualification.trim()]);
      setCurrentQualification('');
    }
  };
  
  const handleRemoveQualification = (index: number) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications.splice(index, 1);
    setQualifications(updatedQualifications);
  };
  
  const handleStateChange = async (state: string) => {
    form.setValue('state', state);
    const salary = await fetchAverageSalaryByState(state);
    if (salary) {
      form.setValue('salary', salary.toString());
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title*</FormLabel>
                <FormControl>
                  <Input placeholder="School Psychologist" {...field} />
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
                <FormLabel>Job Description*</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide a detailed description of the job..." 
                    className="min-h-[100px]" 
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
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State*</FormLabel>
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
                        <SelectItem key={state} value={state}>
                          {state}
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="work_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
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
              name="work_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Location</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Annual salary amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeframe</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Immediate, Fall 2025, etc." {...field} />
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
                <FormLabel>Associated School</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select school (optional)" />
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
          
          <div>
            <label className="block text-sm font-medium mb-1">Skills Required</label>
            <div className="flex mb-2">
              <Input
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="Add a required skill"
                className="mr-2"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddSkill}
              >
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span className="text-sm">{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Qualifications</label>
            <div className="flex mb-2">
              <Input
                value={currentQualification}
                onChange={(e) => setCurrentQualification(e.target.value)}
                placeholder="Add a qualification"
                className="mr-2"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddQualification}
              >
                Add
              </Button>
            </div>
            {qualifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {qualifications.map((qualification, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span className="text-sm">{qualification}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQualification(index)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                Creating...
              </>
            ) : (
              'Create Job'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
