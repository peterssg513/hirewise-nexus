
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Experience } from './ExperienceForm';
import { Education } from './EducationForm';
import ProfilePictureUpload from './ProfilePictureUpload';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import { columnExists } from '@/services/databaseHelpers';

interface BuildProfileProps {
  onComplete: () => void;
}

interface ProfileData {
  experiences: Experience[];
  education: Education[];
  profilePictureUrl: string | null;
}

const BuildProfile: React.FC<BuildProfileProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    experiences: [],
    education: [],
    profilePictureUrl: null,
  });
  
  // Load existing profile data if available
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('psychologists')
          .select('profile_picture_url')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data?.profile_picture_url) {
          setProfileData(prev => ({
            ...prev,
            profilePictureUrl: data.profile_picture_url,
          }));
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };
    
    loadProfileData();
  }, [user]);

  const handleProfilePictureUpdate = (url: string) => {
    setProfileData(prev => ({
      ...prev,
      profilePictureUrl: url
    }));
  };

  const handleUpdateExperiences = (experiences: Experience[]) => {
    setProfileData(prev => ({
      ...prev,
      experiences
    }));
  };

  const handleUpdateEducation = (education: Education[]) => {
    setProfileData(prev => ({
      ...prev,
      education
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to continue',
        variant: 'destructive',
      });
      return;
    }

    if (profileData.experiences.length === 0 || profileData.education.length === 0) {
      toast({
        title: 'Missing information',
        description: 'Please add at least one experience and one education entry.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if the experience column exists
      const hasExperienceColumn = await columnExists('psychologists', 'experience');
      
      // Update psychologist profile with the correct column name
      const updateData: Record<string, any> = {
        profile_picture_url: profileData.profilePictureUrl,
        education: JSON.stringify(profileData.education),
        signup_progress: 3
      };
      
      // Use the experience column
      updateData.experience = JSON.stringify(profileData.experiences);
      
      const { error } = await supabase
        .from('psychologists')
        .update(updateData)
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
      
      {user && (
        <ProfilePictureUpload 
          profilePictureUrl={profileData.profilePictureUrl} 
          userId={user.id}
          onUploadComplete={handleProfilePictureUpdate}
        />
      )}
      
      <ExperienceSection 
        experiences={profileData.experiences}
        onUpdateExperiences={handleUpdateExperiences}
      />
      
      <EducationSection 
        education={profileData.education}
        onUpdateEducation={handleUpdateEducation}
      />
      
      <Button 
        type="button" 
        className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white" 
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </span>
        ) : "Continue to Certifications"}
      </Button>
    </div>
  );
};

export default BuildProfile;
