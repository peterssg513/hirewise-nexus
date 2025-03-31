
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job, createJob } from '@/services/jobService';
import { useToast } from '@/hooks/use-toast';
import { fetchSchools } from '@/services/schoolService';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash } from 'lucide-react';

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  districtId: string;
  onJobCreated: (job: Job) => void;
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

export const CreateJobDialog: React.FC<CreateJobDialogProps> = ({ 
  open, 
  onOpenChange, 
  districtId, 
  onJobCreated 
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [qualifications, setQualifications] = useState<{ id: string; text: string }[]>([
    { id: uuidv4(), text: '' }
  ]);
  const [documentsRequired, setDocumentsRequired] = useState<string[]>([]);
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
      location: '',
      salary: '',
      city: '',
      state: '',
      country: 'USA',
      job_type: '',
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

    if (open) {
      loadSchools();
    }
  }, [open, districtId]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert salary from string to number
      const jobData = {
        ...data,
        title: data.title, // Ensuring required field is passed
        description: data.description, // Ensuring required field is passed
        salary: data.salary ? parseFloat(data.salary) : undefined,
        district_id: districtId,
        qualifications: qualifications.filter(q => q.text.trim() !== '').map(q => q.text),
        documents_required: documentsRequired.filter(doc => doc.trim() !== '')
      };
      
      const newJob = await createJob(jobData);
      onJobCreated(newJob);
      onOpenChange(false);
      reset();
      setQualifications([{ id: uuidv4(), text: '' }]);
      setDocumentsRequired([]);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>
            Fill in the details for the new job posting.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" {...register("title")} placeholder="Job Title" />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Job Description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} placeholder="Location" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="salary">Salary</Label>
              <Input id="salary" {...register("salary")} placeholder="Salary" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} placeholder="City" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} placeholder="State" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} placeholder="Country" defaultValue="USA" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="job_type">Job Type</Label>
              <Input id="job_type" {...register("job_type")} placeholder="Job Type" />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="school_id">School</Label>
            <Select onValueChange={(value) => setValue("school_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
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
          
          <div>
            <Label>Documents Required</Label>
            {documentsRequired.length > 0 ? (
              documentsRequired.map((document, index) => (
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
              ))
            ) : (
              <p className="text-sm text-muted-foreground mt-1">No documents required yet.</p>
            )}
            <Button type="button" variant="secondary" size="sm" onClick={addDocument} className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
