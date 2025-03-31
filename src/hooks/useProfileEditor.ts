
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  updatePsychologistProfile, 
  updateProfileField 
} from '@/services/profileService';
import { Experience, Education } from '@/services/psychologistSignupService';
import { Certification } from '@/services/certificationService';

interface ProfileEditorState {
  isEditModalOpen: boolean;
  editSection: 'basic' | 'experience' | 'education' | 'certification' | null;
  editItemId: string | null;
  loading: boolean;
}

interface ProfileEditorProps {
  profile: any;
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
  refreshProfile: () => Promise<void>;
}

interface ProfileEditorActions {
  handleEditProfile: (section: 'basic' | 'experience' | 'education' | 'certification', itemId?: string) => void;
  handleCloseEditModal: () => void;
  handleSaveProfile: (updatedData: any) => Promise<void>;
  handleProfilePictureUpdate: (url: string) => Promise<void>;
  handleDeleteItem: (section: 'experience' | 'education' | 'certification', itemId: string) => Promise<void>;
  handleUpdatePreferences: (type: 'locations' | 'workTypes' | 'evaluationTypes' | 'relocation', data: any) => Promise<void>;
}

export const useProfileEditor = ({
  profile,
  experiences,
  educations,
  certifications,
  refreshProfile
}: ProfileEditorProps): [ProfileEditorState, ProfileEditorActions] => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<ProfileEditorState>({
    isEditModalOpen: false,
    editSection: null,
    editItemId: null,
    loading: false
  });

  const handleEditProfile = (section: 'basic' | 'experience' | 'education' | 'certification', itemId?: string) => {
    setState({
      ...state,
      editSection: section,
      editItemId: itemId || null,
      isEditModalOpen: true
    });
  };

  const handleCloseEditModal = () => {
    setState({
      ...state,
      isEditModalOpen: false,
      editSection: null,
      editItemId: null
    });
    refreshProfile();
  };

  const handleSaveProfile = async (updatedData: any) => {
    if (!user) return;

    try {
      setState({ ...state, loading: true });
      
      let updatedProfile = { ...profile };
      
      if (state.editSection === 'basic') {
        console.log('Saving basic profile data:', updatedData);
        
        updatedProfile = {
          ...profile,
          ...updatedData,
        };
        
        await updateProfileField(user.id, 'bio', updatedData.bio);
        await updateProfileField(user.id, 'phone_number', updatedData.phone_number);
        await updateProfileField(user.id, 'city', updatedData.city);
        await updateProfileField(user.id, 'state', updatedData.state);
        await updateProfileField(user.id, 'zip_code', updatedData.zip_code);
      } else if (state.editSection === 'experience') {
        let updatedExperiences = [...experiences];
        
        if (state.editItemId) {
          updatedExperiences = updatedExperiences.map(exp => 
            exp.id === state.editItemId ? { ...exp, ...updatedData } : exp
          );
        } else {
          updatedExperiences.push({
            ...updatedData,
            id: `exp-${Math.random().toString(36).substring(2, 9)}`
          });
        }
        
        updatedProfile.experience = JSON.stringify(updatedExperiences);
      } else if (state.editSection === 'education') {
        let updatedEducations = [...educations];
        
        if (state.editItemId) {
          updatedEducations = updatedEducations.map(edu => 
            edu.id === state.editItemId ? { ...edu, ...updatedData } : edu
          );
        } else {
          updatedEducations.push({
            ...updatedData,
            id: `edu-${Math.random().toString(36).substring(2, 9)}`
          });
        }
        
        updatedProfile.education = JSON.stringify(updatedEducations);
      } else if (state.editSection === 'certification') {
        let updatedCertifications = [...certifications];
        
        if (state.editItemId) {
          updatedCertifications = updatedCertifications.map(cert => 
            cert.id === state.editItemId ? { ...cert, ...updatedData } : cert
          );
        } else {
          updatedCertifications.push({
            ...updatedData,
            id: `cert-${Math.random().toString(36).substring(2, 9)}`,
            status: 'pending'
          });
        }
        
        updatedProfile.certification_details = JSON.stringify(updatedCertifications);
      }
      
      await updatePsychologistProfile(user.id, updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setState({ ...state, loading: false });
    }
  };

  const handleProfilePictureUpdate = async (url: string) => {
    if (!user) return;

    try {
      await updateProfileField(user.id, 'profile_picture_url', url);
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
      
      refreshProfile();
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile picture. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (section: 'experience' | 'education' | 'certification', itemId: string) => {
    if (!user) return;

    try {
      setState({ ...state, loading: true });
      
      let updatedProfile = { ...profile };
      
      if (section === 'experience') {
        const updatedExperiences = experiences.filter(exp => exp.id !== itemId);
        updatedProfile.experience = JSON.stringify(updatedExperiences);
      } else if (section === 'education') {
        const updatedEducations = educations.filter(edu => edu.id !== itemId);
        updatedProfile.education = JSON.stringify(updatedEducations);
      } else if (section === 'certification') {
        const updatedCertifications = certifications.filter(cert => cert.id !== itemId);
        updatedProfile.certification_details = JSON.stringify(updatedCertifications);
      }
      
      await updatePsychologistProfile(user.id, updatedProfile);
      
      toast({
        title: "Item deleted",
        description: `The ${section} has been successfully deleted.`,
      });
      
      refreshProfile();
    } catch (error) {
      console.error(`Error deleting ${section}:`, error);
      toast({
        title: "Delete failed",
        description: `There was an error deleting the ${section}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setState({ ...state, loading: false });
    }
  };

  const handleUpdatePreferences = async (type: 'locations' | 'workTypes' | 'evaluationTypes' | 'relocation', data: any) => {
    if (!user) return;

    try {
      let updatedProfile = { ...profile };
      
      if (type === 'locations') {
        updatedProfile.desired_locations = data;
      } else if (type === 'workTypes') {
        updatedProfile.work_types = data;
      } else if (type === 'evaluationTypes') {
        updatedProfile.evaluation_types = data;
      } else if (type === 'relocation') {
        updatedProfile.open_to_relocation = data;
      }
      
      await updatePsychologistProfile(user.id, updatedProfile);
      
      toast({
        title: "Preferences updated",
        description: "Your preferences have been successfully updated.",
      });
      
      refreshProfile();
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your preferences. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to allow component to handle error state
    }
  };

  return [
    state,
    {
      handleEditProfile,
      handleCloseEditModal,
      handleSaveProfile,
      handleProfilePictureUpdate,
      handleDeleteItem,
      handleUpdatePreferences
    }
  ];
};
