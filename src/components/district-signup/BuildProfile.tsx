
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveProfileData } from '@/services/districtSignupService';
import { supabase } from '@/integrations/supabase/client';
import { District } from '@/types/district';

interface BuildProfileProps {
  onComplete: () => void;
}

const buildProfileSchema = z.object({
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
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
      description: '',
      location: '',
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
  }, [user, toast]);

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
      await saveProfileData(user.id, {
        description: values.description,
        location: values.location,
      });
      
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
      
      {/* Display Basic Information */}
      <div className="mb-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold mb-4">District Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-sm text-gray-500">District Name</p>
            <p className="font-medium">{districtData?.name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">State</p>
            <p className="font-medium">{districtData?.state || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">District Size</p>
            <p className="font-medium">{districtData?.district_size ? `${districtData.district_size} students` : 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Website</p>
            <p className="font-medium">
              {districtData?.website ? (
                <a href={districtData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {districtData.website}
                </a>
              ) : 'Not provided'}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-sm text-gray-500">Contact Name</p>
            <p className="font-medium">
              {districtData?.first_name && districtData?.last_name 
                ? `${districtData.first_name} ${districtData.last_name}` 
                : 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Job Title</p>
            <p className="font-medium">{districtData?.job_title || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{districtData?.contact_email || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{districtData?.contact_phone || 'Not provided'}</p>
          </div>
        </div>
      </div>
      
      {/* Additional Profile Fields */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District Location</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="E.g., Downtown area, Northeast region, etc." 
                    {...field} 
                  />
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
                <FormLabel>District Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide a description of your district, including mission, vision, and special programs..." 
                    className="min-h-[150px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
