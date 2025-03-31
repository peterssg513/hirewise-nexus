
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveProfileData } from '@/services/districtSignupService';
import { supabase } from '@/integrations/supabase/client';
import { District } from '@/types/district';
import { US_STATES } from '@/lib/constants';

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

type BuildProfileFormValues = z.infer<typeof buildProfileSchema>;

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
        
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your district profile has been updated successfully.',
      });
      
      onComplete();
    } catch (error: any) {
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">District Information</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter district name" {...field} />
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
                    <FormLabel>State</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
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
              
              <FormField
                control={form.control}
                name="district_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District Size</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DISTRICT_SIZE_TIERS.map((tier) => (
                          <SelectItem key={tier.value} value={tier.value.toString()}>
                            {tier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.yourdistrict.edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="job_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Superintendent, HR Director" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 555-5555" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
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
