import React, { useState, useEffect } from 'react';
import { Job, updateJob } from '@/services/jobService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { fetchSchools } from '@/services/schoolService';

interface EditJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  onJobUpdated: (job: Job) => void;
}

const jobFormSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  location: z.string().optional(),
  salary: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  job_type: z.string().optional(),
  school_id: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export const EditJobDialog: React.FC<EditJobDialogProps> = ({ open, onOpenChange, job, onJobUpdated }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qualifications, setQualifications] = useState<{ id: string; text: string }[]>([]);
  const [documentsRequired, setDocumentsRequired] = useState<string[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job.title,
      description: job.description,
      location: job.location || '',
      salary: job.salary ? job.salary.toString() : '',
      city: job.city || '',
      state: job.state || '',
      country: job.country || 'USA',
      job_type: job.job_type || '',
      school_id: job.school_id || '',
    },
  });

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description,
        location: job.location || '',
        salary: job.salary ? job.salary.toString() : '',
        city: job.city || '',
        state: job.state || '',
        country: job.country || 'USA',
        job_type: job.job_type || '',
        school_id: job.school_id || '',
      });
      
      setQualifications(job.qualifications ? job.qualifications.map(text => ({ id: uuidv4(), text })) : []);
      setDocumentsRequired(job.documents_required || []);
    }
  }, [job, reset]);

  useEffect(() => {
    const loadSchools = async () => {
      try {
        const schoolsData = await fetchSchools(job.district_id);
        setSchools(schoolsData.map(school => ({ id: school.id, name: school.name })));
      } catch (error) {
        console.error('Failed to load schools:', error);
        toast({
          title: 'Error',
          description: 'Failed to load schools. Please try again.',
          variant: 'destructive',
        });
      }
    };

    loadSchools();
  }, [job.district_id, toast]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      
      const jobData: Partial<Job> = {
        ...data,
        salary: data.salary ? parseFloat(data.salary) : undefined,
        qualifications: qualifications.filter(q => q.text.trim() !== '').map(q => q.text),
        documents_required: documentsRequired.filter(doc => doc.trim() !== '')
      };
      
      const updatedJob = await updateJob(job.id, jobData);
      onJobUpdated(updatedJob);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update job:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job. Please try again.',
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

  const addDocument = () => {
    setDocumentsRequired(prev => [...prev, '']);
  };

  const updateDocument = (index: number, text: string) => {
    setDocumentsRequired(prev => {
      const updatedDocs = [...prev];
      updatedDocs[index] = text;
      return updatedDocs;
    });
  };

  const removeDocument = (index: number) => {
    setDocumentsRequired(prev => {
      const updatedDocs = [...prev];
      updatedDocs.splice(index, 1);
      return updatedDocs;
    });
  };

  const handleSchoolChange = (value: string) => {
    setValue("school_id", value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>
            Make changes to the job posting here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" placeholder="Job Title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Job Description"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Location" {...register('location')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="salary">Salary</Label>
            <Input id="salary" placeholder="Salary" {...register('salary')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" {...register('city')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="State" {...register('state')} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" placeholder="Country" {...register('country')} defaultValue="USA" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="job_type">Job Type</Label>
            <Input id="job_type" placeholder="Job Type" {...register('job_type')} />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="school_id">School</Label>
            <Select 
              defaultValue={job.school_id || 'none'}
              onValueChange={handleSchoolChange}
            >
              <SelectTrigger className="w-full">
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

          <div>
            <Label>Qualifications</Label>
            {qualifications.map((qualification, index) => (
              <div key={qualification.id} className="flex items-center space-x-2 mt-2">
                <Input
                  type="text"
                  placeholder="Qualification"
                  value={qualification.text}
                  onChange={(e) => updateQualification(qualification.id, e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeQualification(qualification.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addQualification} className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Qualification
            </Button>
          </div>

          <div>
            <Label>Documents Required</Label>
            {documentsRequired.map((document, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Input
                  type="text"
                  placeholder="Document"
                  value={document}
                  onChange={(e) => updateDocument(index, e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeDocument(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addDocument} className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>
        
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
