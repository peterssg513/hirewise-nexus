
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { School, fetchSchools } from '@/services/schoolService';
import { Job, updateJob, JOB_TYPES } from '@/services/jobService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES } from '@/lib/constants';
import { Textarea } from '@/components/ui/textarea';

interface EditJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  onJobUpdated: (job: Job) => void;
}

const formSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(1, 'Job description is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  location: z.string().optional(),
  salary: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  job_type: z.string().optional(),
  timeframe: z.string().optional(),
  school_id: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  skills_required: z.array(z.string()).optional(),
  documents_required: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const EditJobDialog: React.FC<EditJobDialogProps> = ({
  open,
  onOpenChange,
  job,
  onJobUpdated,
}) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [newQualification, setNewQualification] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newDocument, setNewDocument] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job.title,
      description: job.description,
      city: job.city || '',
      state: job.state || '',
      location: job.location || '',
      salary: job.salary ? job.salary.toString() : '',
      job_type: job.job_type || '',
      timeframe: job.timeframe || '',
      school_id: job.school_id || '',
      qualifications: job.qualifications || [],
      skills_required: job.skills_required || [],
      documents_required: job.documents_required || [],
    },
  });

  const { formState, watch, setValue } = form;
  const { isSubmitting } = formState;
  
  const qualifications = watch('qualifications') || [];
  const skills = watch('skills_required') || [];
  const documents = watch('documents_required') || [];

  useEffect(() => {
    if (open) {
      loadSchools();
      form.reset({
        title: job.title,
        description: job.description,
        city: job.city || '',
        state: job.state || '',
        location: job.location || '',
        salary: job.salary ? job.salary.toString() : '',
        job_type: job.job_type || '',
        timeframe: job.timeframe || '',
        school_id: job.school_id || '',
        qualifications: job.qualifications || [],
        skills_required: job.skills_required || [],
        documents_required: job.documents_required || [],
      });
    }
  }, [open, job]);

  const loadSchools = async () => {
    try {
      const schoolsData = await fetchSchools(job.district_id);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Failed to load schools:', error);
    }
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      setValue('qualifications', [...qualifications, newQualification.trim()]);
      setNewQualification('');
    }
  };

  const removeQualification = (index: number) => {
    setValue('qualifications', qualifications.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setValue('skills_required', [...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setValue('skills_required', skills.filter((_, i) => i !== index));
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      setValue('documents_required', [...documents, newDocument.trim()]);
      setNewDocument('');
    }
  };

  const removeDocument = (index: number) => {
    setValue('documents_required', documents.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const updatedJob = await updateJob(job.id, {
        title: values.title,
        description: values.description,
        city: values.city || undefined,
        state: values.state || undefined,
        location: values.location || undefined,
        salary: values.salary,
        job_type: values.job_type || undefined,
        timeframe: values.timeframe || undefined,
        school_id: values.school_id || undefined,
        qualifications: values.qualifications,
        skills_required: values.skills_required,
        documents_required: values.documents_required,
      });
      
      onJobUpdated(updatedJob);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>
            Update job posting details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter job title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Annual salary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="job_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {JOB_TYPES.map((type) => (
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Country</FormLabel>
                <Input value="USA" disabled />
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Description (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., 'Remote with occasional on-site meetings'" 
                      {...field} 
                    />
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
                    <Input 
                      placeholder="E.g., 'Starting September 2025' or 'Immediate opening'" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated School</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a school (optional)" />
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed job description" 
                      className="h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Qualifications */}
            <div>
              <FormLabel>Qualifications</FormLabel>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <Input 
                  value={newQualification}
                  onChange={(e) => setNewQualification(e.target.value)}
                  placeholder="Add qualification"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                />
                <Button type="button" variant="outline" size="sm" onClick={addQualification}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {qualifications.length > 0 ? (
                <div className="bg-gray-50 p-3 rounded-md">
                  <ul className="space-y-1">
                    {qualifications.map((qual, index) => (
                      <li key={index} className="flex items-center justify-between bg-white p-2 rounded">
                        <span>• {qual}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeQualification(index)}
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No qualifications added</p>
              )}
            </div>

            {/* Skills Required */}
            <div>
              <FormLabel>Skills Required</FormLabel>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <Input 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add required skill"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {skills.length > 0 ? (
                <div className="bg-gray-50 p-3 rounded-md">
                  <ul className="space-y-1">
                    {skills.map((skill, index) => (
                      <li key={index} className="flex items-center justify-between bg-white p-2 rounded">
                        <span>• {skill}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeSkill(index)}
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added</p>
              )}
            </div>

            {/* Documents Required */}
            <div>
              <FormLabel>Documents Required</FormLabel>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <Input 
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  placeholder="Add required document"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                />
                <Button type="button" variant="outline" size="sm" onClick={addDocument}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {documents.length > 0 ? (
                <div className="bg-gray-50 p-3 rounded-md">
                  <ul className="space-y-1">
                    {documents.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between bg-white p-2 rounded">
                        <span>• {doc}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeDocument(index)}
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No documents required</p>
              )}
            </div>

            {/* Benefits display (read-only) */}
            <div>
              <FormLabel>Benefits</FormLabel>
              <div className="bg-gray-50 p-3 rounded-md">
                <ul className="space-y-1">
                  <li className="bg-white p-2 rounded">• Spread Pay Plan: Enjoy a consistent income throughout the year</li>
                  <li className="bg-white p-2 rounded">• Wellness & Professional Growth Stipends - Invest in your success and well-being!</li>
                  <li className="bg-white p-2 rounded">• Professional Development Stipends: We invest in YOU!</li>
                  <li className="bg-white p-2 rounded">• 401(k) Plan: Secure your future with our retirement savings plan</li>
                  <li className="bg-white p-2 rounded">• Online Resources: Access NASP-approved webinars, therapy ideas, and free CEUs</li>
                  <li className="bg-white p-2 rounded">• Travel Positions Available - Explore new places while doing what you love!</li>
                  <li className="bg-white p-2 rounded">• Referral Program: Share the opportunity!</li>
                  <li className="bg-white p-2 rounded">• A workplace where you're supported, respected, and encouraged to do your best work every day</li>
                </ul>
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
