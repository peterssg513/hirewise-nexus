
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { District } from '@/types/district';
import DistrictInfoSection from './DistrictInfoSection';
import ContactInfoSection from './ContactInfoSection';
import { Loader2 } from 'lucide-react';

interface BuildProfileProps {
  onComplete: () => void;
}

// District size tiers
const DISTRICT_SIZE_TIERS = [
  { value: 1000, label: 'Less than 1,000 students' },
  { value: 5000, label: '1,000 - 5,000 students' },
  { value: 10000, label: '5,001 - 10,000 students' },
  { value: 25000, label: '10,001 - 25,000 students' },
  { value: 50000, label: '25,001 - 50,000 students' },
  { value: 100000, label: '50,001 - 100,000 students' },
  { value: 100001, label: 'More than 100,000 students' },
];

const buildProfileSchema = z.object({
  name: z.string().min(2, {
    message: "District name must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "Please select a state.",
  }),
  district_size: z.coerce.number().min(1, {
    message: "Please select a district size.",
  }),
  website: z.string().url({
    message: "Please enter a valid website URL (include https://).",
  }).or(z.string().length(0)),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  job_title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  contact_email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contact_phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
});

export type BuildProfileFormValues = z.infer<typeof buildProfileSchema>;

const BuildProfile: React.FC<BuildProfileProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districtData, setDistrictData] = useState<Partial<District> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<BuildProfileFormValues>({
    resolver: zodResolver(buildProfileSchema),
    defaultValues: {
      name: '',
      state: '',
      district_size: undefined,
      website: '',
      first_name: '',
      last_name: '',
      job_title: '',
      contact_email: '',
      contact_phone: '',
    },
  });

  // Load existing district data for display
  useEffect(() => {
    const loadDistrictData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('districts')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        setDistrictData(data);
        
        // Populate form with existing data
        form.reset({
          name: data.name || '',
          state: data.state || '',
          district_size: data.district_size || undefined,
          website: data.website || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          job_title: data.job_title || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
        });
      } catch (error) {
        console.error('Error loading district data:', error);
        toast({
          title: 'Error loading profile',
          description: 'Could not load your district profile data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDistrictData();
  }, [user, toast, form]);

  const onSubmit = async (values: BuildProfileFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to continue',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Updating profile with values:", values);
      
      // Update the district record with all the form values
      const { error } = await supabase
        .from('districts')
        .update({
          name: values.name,
          state: values.state,
          district_size: values.district_size,
          website: values.website,
          first_name: values.first_name,
          last_name: values.last_name,
          job_title: values.job_title,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
          signup_progress: 'profile',
        })
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      toast({
        title: 'Profile updated',
        description: 'Your district profile has been updated successfully.',
      });
      
      onComplete();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: 'Error updating profile',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-psyched-darkBlue mb-6">District Profile</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DistrictInfoSection form={form} districtSizeTiers={DISTRICT_SIZE_TIERS} />
          <ContactInfoSection form={form} />
          
          <Button 
            type="submit" 
            className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : "Continue to Schedule Meeting"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BuildProfile;
