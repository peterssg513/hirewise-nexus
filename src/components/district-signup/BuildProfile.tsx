
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { District } from '@/types/district';
import DistrictInfoSection from './DistrictInfoSection';
import ContactInfoSection from './ContactInfoSection';
import { Loader2 } from 'lucide-react';
import { buildProfileSchema, BuildProfileFormValues } from './schemas/buildProfileSchema';
import { DISTRICT_SIZE_TIERS } from './constants/districtSizeTiers';

interface BuildProfileProps {
  onComplete: () => void;
}

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
        
        console.log("Loaded district data:", data);
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
      
      console.log("Profile updated successfully, calling onComplete");
      
      toast({
        title: 'Profile updated',
        description: 'Your district profile has been updated successfully.',
      });
      
      // Make sure we call onComplete to move to the next step
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
