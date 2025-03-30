
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Pencil, Trash } from 'lucide-react';
import ExperienceForm, { Experience } from './ExperienceForm';
import EducationForm, { Education } from './EducationForm';

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
  
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
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
        
      setProfileData(prev => ({
        ...prev,
        profilePictureUrl: urlData.publicUrl
      }));
      
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

  const handleAddExperience = (experience: Experience) => {
    if (editingExperience) {
      setProfileData(prev => ({
        ...prev,
        experiences: prev.experiences.map(exp => 
          exp.id === editingExperience.id ? experience : exp
        ),
      }));
      setEditingExperience(null);
    } else {
      setProfileData(prev => ({
        ...prev,
        experiences: [...prev.experiences, experience],
      }));
    }
    setShowExperienceForm(false);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setShowExperienceForm(true);
  };

  const handleDeleteExperience = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }));
  };

  const handleAddEducation = (education: Education) => {
    if (editingEducation) {
      setProfileData(prev => ({
        ...prev,
        education: prev.education.map(edu => 
          edu.id === editingEducation.id ? education : edu
        ),
      }));
      setEditingEducation(null);
    } else {
      setProfileData(prev => ({
        ...prev,
        education: [...prev.education, education],
      }));
    }
    setShowEducationForm(false);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setShowEducationForm(true);
  };

  const handleDeleteEducation = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
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
      // Update psychologist profile
      const { error } = await supabase
        .from('psychologists')
        .update({
          profile_picture_url: profileData.profilePictureUrl,
          // Store the whole experience and education objects as JSON
          education: JSON.stringify(profileData.education),
          experience_details: JSON.stringify(profileData.experiences),
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
            {profileData.profilePictureUrl ? (
              <img 
                src={profileData.profilePictureUrl} 
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
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Experience Details</h3>
          <Button 
            type="button"
            onClick={() => {
              setEditingExperience(null);
              setShowExperienceForm(true);
            }}
            className="bg-psyched-lightBlue hover:bg-psyched-lightBlue/90 text-white"
          >
            Add Experience
          </Button>
        </div>
        
        {showExperienceForm && (
          <ExperienceForm 
            onAdd={handleAddExperience} 
            onCancel={() => {
              setShowExperienceForm(false);
              setEditingExperience(null);
            }}
            initialData={editingExperience || undefined}
            isEditing={!!editingExperience}
          />
        )}
        
        {profileData.experiences.length > 0 ? (
          <ul className="space-y-3">
            {profileData.experiences.map((experience) => (
              <li key={experience.id} className="border p-3 rounded bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{experience.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{experience.placeOfEmployment}</p>
                    <p className="text-sm text-gray-500">
                      {experience.yearStarted} - {experience.yearWorked}
                    </p>
                    {experience.description && (
                      <p className="text-sm mt-1">{experience.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditExperience(experience)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteExperience(experience.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No experience added yet. Please add your work history.
          </p>
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Education Details</h3>
          <Button 
            type="button"
            onClick={() => {
              setEditingEducation(null);
              setShowEducationForm(true);
            }}
            className="bg-psyched-lightBlue hover:bg-psyched-lightBlue/90 text-white"
          >
            Add Education
          </Button>
        </div>
        
        {showEducationForm && (
          <EducationForm 
            onAdd={handleAddEducation} 
            onCancel={() => {
              setShowEducationForm(false);
              setEditingEducation(null);
            }}
            initialData={editingEducation || undefined}
            isEditing={!!editingEducation}
          />
        )}
        
        {profileData.education.length > 0 ? (
          <ul className="space-y-3">
            {profileData.education.map((education) => (
              <li key={education.id} className="border p-3 rounded bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{education.schoolName}</h4>
                    <p className="text-sm text-gray-600">{education.major}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditEducation(education)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteEducation(education.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No education added yet. Please add your educational background.
          </p>
        )}
      </div>
      
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
