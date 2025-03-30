
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload } from 'lucide-react';

interface BuildProfileProps {
  onComplete: () => void;
}

const buildProfileSchema = z.object({
  education: z.string().min(5, {
    message: "Please provide information about your education.",
  }),
  experienceYears: z.string().min(1, {
    message: "Please enter your years of experience.",
  }),
});

type BuildProfileFormValues = z.infer<typeof buildProfileSchema>;

const BuildProfile: React.FC<BuildProfileProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const form = useForm<BuildProfileFormValues>({
    resolver: zodResolver(buildProfileSchema),
    defaultValues: {
      education: '',
      experienceYears: '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setUploadingImage(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/profile-picture.${fileExt}`;
      
      // Upload the file
      const { error: uploadError, data } = await supabase.storage
        .from('psychologist_files')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('psychologist_files')
        .getPublicUrl(filePath);
        
      setProfileImageUrl(urlData.publicUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'Your profile picture has been uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error uploading image',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

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
      // Update psychologist profile
      const { error } = await supabase
        .from('psychologists')
        .update({
          education: values.education,
          experience_years: parseInt(values.experienceYears),
          profile_picture_url: profileImageUrl,
          signup_progress: 3, // Move to next step
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-psyched-darkBlue mb-6">Build Your Profile</h2>
      
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Profile Picture</label>
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-4">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          
          <label className="cursor-pointer bg-psyched-lightBlue hover:bg-psyched-lightBlue/90 text-white py-2 px-4 rounded flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            {uploadingImage ? 'Uploading...' : 'Upload Photo'}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </label>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share your educational background..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="experienceYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : "Continue to Certifications"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BuildProfile;
