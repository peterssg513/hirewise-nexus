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
import { STATES, WORK_LOCATIONS, WORK_TYPES } from '@/services/stateSalaryService';
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
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("USA"),
  work_location: z.string().optional(),
  work_type: z.string().optional(),
  school_id: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

const JobBasicInfo = ({ register, errors }: any) => (
  <>
    <div className="grid gap-2">
      <Label htmlFor="title">Job Title</Label>
      <Input id="title" {...register("title")} placeholder="Job Title" />
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
  </>
);

const JobLocationInfo = ({ register, setValue }: any) => (
  <>
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
      </div>
    </div>
    
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
  </>
);

const ListManager = ({ 
  items, 
  setItems, 
  addItem, 
  updateItem, 
  removeItem, 
  label, 
  addButtonLabel 
}: {
  items: { id: string; text: string }[];
  setItems: React.Dispatch<React.SetStateAction<{ id: string; text: string }[]>>;
  addItem: () => void;
  updateItem: (id: string, text: string) => void;
  removeItem: (id: string) => void;
  label: string;
  addButtonLabel: string;
}) => (
  <div>
    <Label>{label}</Label>
    {items.map((item) => (
      <div key={item.id} className="flex items-center space-x-2 mt-2">
        <Input
          type="text"
          placeholder={label}
          value={item.text}
          onChange={(e) => updateItem(item.id, e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => removeItem(item.id)}
          disabled={items.length <= 1}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    ))}
    <Button type="button" variant="secondary" size="sm" onClick={addItem} className="mt-2">
      <Plus className="h-4 w-4 mr-2" />
      {addButtonLabel}
    </Button>
  </div>
);

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
  const [benefits, setBenefits] = useState<{ id: string; text: string }[]>([
    { id: uuidv4(), text: '' }
  ]);
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

    if (open) {
      loadSchools();
    }
  }, [open, districtId]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      
      const jobData = {
        ...data,
        title: data.title,
        description: data.description,
        district_id: districtId,
        qualifications: qualifications.filter(q => q.text.trim() !== '').map(q => q.text),
        benefits: benefits.filter(b => b.text.trim() !== '').map(b => b.text),
      };
      
      const newJob = await createJob(jobData);
      onJobCreated(newJob);
      onOpenChange(false);
      reset();
      setQualifications([{ id: uuidv4(), text: '' }]);
      setBenefits([{ id: uuidv4(), text: '' }]);
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

  const addBenefit = () => {
    setBenefits(prev => [...prev, { id: uuidv4(), text: '' }]);
  };

  const updateBenefit = (id: string, text: string) => {
    setBenefits(prev =>
      prev.map(b => (b.id === id ? { ...b, text } : b))
    );
  };

  const removeBenefit = (id: string) => {
    setBenefits(prev => prev.filter(b => b.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>
            Fill in the details for the new job posting.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <JobBasicInfo register={register} errors={errors} />
          <JobLocationInfo register={register} setValue={setValue} />
          
          <div className="grid grid-cols-2 gap-4">
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
          
          <ListManager
            items={qualifications}
            setItems={setQualifications}
            addItem={addQualification}
            updateItem={updateQualification}
            removeItem={removeQualification}
            label="Qualifications"
            addButtonLabel="Add Qualification"
          />
          
          <ListManager
            items={benefits}
            setItems={setBenefits}
            addItem={addBenefit}
            updateItem={updateBenefit}
            removeItem={removeBenefit}
            label="Benefits"
            addButtonLabel="Add Benefit"
          />
          
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
