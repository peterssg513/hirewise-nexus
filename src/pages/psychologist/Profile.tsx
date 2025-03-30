import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Certification } from '@/services/certificationService';
import { Experience, Education } from '@/services/psychologistSignupService';
import { fetchPsychologistProfile, createPsychologistProfile, updatePsychologistProfile, updateProfileField } from '@/services/profileService';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import EditProfileModal from '@/components/profile/EditProfileModal';
import ProfilePreferences from '@/components/profile/ProfilePreferences';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSection, setEditSection] = useState<'basic' | 'experience' | 'education' | 'certification' | null>(null);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const { toast } = useToast();

  const safeJsonParse = (jsonString: string | null, defaultValue: any[] = []): any[] => {
    if (!jsonString) return defaultValue;
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch (err) {
      console.error('Error parsing JSON data:', err);
      return defaultValue;
    }
  };

  const mapExperienceProperties = (exp: any): Experience => {
    return {
      id: exp.id || `exp-${Math.random().toString(36).substring(2, 9)}`,
      position: exp.position || exp.jobTitle || exp.title || '',
      organization: exp.organization || exp.placeOfEmployment || exp.company || '',
      description: exp.description || '',
      startDate: exp.startDate || exp.yearStarted || exp.start_date || '',
      endDate: exp.endDate || exp.yearWorked || exp.end_date || '',
      current: exp.current || false
    };
  };

  const mapEducationProperties = (edu: any): Education => {
    return {
      id: edu.id || `edu-${Math.random().toString(36).substring(2, 9)}`,
      institution: edu.institution || edu.schoolName || '',
      field: edu.field || edu.major || edu.field_of_study || '',
      degree: edu.degree || '',
      startDate: edu.startDate || edu.start_date || '',
      endDate: edu.endDate || edu.end_date || ''
    };
  };

  const processCertificationData = (certData: any[]): Certification[] => {
    return certData.map(cert => ({
      id: cert.id || `cert-${Math.random().toString(36).substring(2, 9)}`,
      name: cert.name || cert.certificationName || '',
      issuingAuthority: cert.issuingAuthority || cert.issuer || '',
      expirationDate: cert.expirationDate || cert.endYear || cert.expiry_date || '',
      startYear: cert.startYear || cert.date || cert.issue_date || '',
      endYear: cert.endYear || cert.expirationDate || cert.expiry_date || '',
      description: cert.description || '',
      status: cert.status || 'pending',
      documentUrl: cert.documentUrl || cert.url || cert.license_number || null,
    }));
  };

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      setError("User not authenticated");
      return;
    }
    
    try {
      console.log("Fetching profile for user:", user.id);
      
      try {
        const data = await fetchPsychologistProfile(user.id);
        console.log("Profile data retrieved:", data);
        setProfile(data);
        
        if (data.experience) {
          const expData = typeof data.experience === 'string' 
            ? safeJsonParse(data.experience)
            : Array.isArray(data.experience) ? data.experience : [];
            
          setExperiences(expData.map(mapExperienceProperties));
        }
        
        if (data.education) {
          const eduData = typeof data.education === 'string' 
            ? safeJsonParse(data.education)
            : Array.isArray(data.education) ? data.education : [];
            
          setEducations(eduData.map(mapEducationProperties));
        }
        
        if (data.certification_details) {
          let certData: any[] = [];
          
          if (typeof data.certification_details === 'string') {
            certData = safeJsonParse(data.certification_details);
          } else if (Array.isArray(data.certification_details)) {
            certData = data.certification_details;
          } else if (typeof data.certification_details === 'object') {
            certData = Object.values(data.certification_details);
          }
          
          setCertifications(processCertificationData(certData));
        }
        
      } catch (profileError) {
        console.error('Error fetching profile, trying to create new profile:', profileError);
        
        const newProfile = await createPsychologistProfile(user.id);
        setProfile(newProfile);
        setExperiences([]);
        setEducations([]);
        setCertifications([]);
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, toast]);

  const handleEditProfile = (section: 'basic' | 'experience' | 'education' | 'certification', itemId?: string) => {
    setEditSection(section);
    setEditItemId(itemId || null);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditSection(null);
    setEditItemId(null);
    fetchProfile();
  };

  const handleSaveProfile = async (updatedData: any) => {
    if (!user) return;

    try {
      setLoading(true);
      
      let updatedProfile = { ...profile };
      
      if (editSection === 'basic') {
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
      } else if (editSection === 'experience') {
        let updatedExperiences = [...experiences];
        
        if (editItemId) {
          updatedExperiences = updatedExperiences.map(exp => 
            exp.id === editItemId ? { ...exp, ...updatedData } : exp
          );
        } else {
          updatedExperiences.push({
            ...updatedData,
            id: `exp-${Math.random().toString(36).substring(2, 9)}`
          });
        }
        
        updatedProfile.experience = JSON.stringify(updatedExperiences);
        setExperiences(updatedExperiences);
      } else if (editSection === 'education') {
        let updatedEducations = [...educations];
        
        if (editItemId) {
          updatedEducations = updatedEducations.map(edu => 
            edu.id === editItemId ? { ...edu, ...updatedData } : edu
          );
        } else {
          updatedEducations.push({
            ...updatedData,
            id: `edu-${Math.random().toString(36).substring(2, 9)}`
          });
        }
        
        updatedProfile.education = JSON.stringify(updatedEducations);
        setEducations(updatedEducations);
      } else if (editSection === 'certification') {
        let updatedCertifications = [...certifications];
        
        if (editItemId) {
          updatedCertifications = updatedCertifications.map(cert => 
            cert.id === editItemId ? { ...cert, ...updatedData } : cert
          );
        } else {
          updatedCertifications.push({
            ...updatedData,
            id: `cert-${Math.random().toString(36).substring(2, 9)}`,
            status: 'pending'
          });
        }
        
        updatedProfile.certification_details = JSON.stringify(updatedCertifications);
        setCertifications(updatedCertifications);
      }
      
      await updatePsychologistProfile(user.id, updatedProfile);
      setProfile(updatedProfile);
      
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
      setLoading(false);
    }
  };

  const handleProfilePictureUpdate = async (url: string) => {
    if (!user) return;

    try {
      await updateProfileField(user.id, 'profile_picture_url', url);
      
      setProfile({
        ...profile,
        profile_picture_url: url
      });
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      });
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
      setLoading(true);
      
      let updatedProfile = { ...profile };
      
      if (section === 'experience') {
        const updatedExperiences = experiences.filter(exp => exp.id !== itemId);
        updatedProfile.experience = JSON.stringify(updatedExperiences);
        setExperiences(updatedExperiences);
      } else if (section === 'education') {
        const updatedEducations = educations.filter(edu => edu.id !== itemId);
        updatedProfile.education = JSON.stringify(updatedEducations);
        setEducations(updatedEducations);
      } else if (section === 'certification') {
        const updatedCertifications = certifications.filter(cert => cert.id !== itemId);
        updatedProfile.certification_details = JSON.stringify(updatedCertifications);
        setCertifications(updatedCertifications);
      }
      
      await updatePsychologistProfile(user.id, updatedProfile);
      setProfile(updatedProfile);
      
      toast({
        title: "Item deleted",
        description: `The ${section} has been successfully deleted.`,
      });
    } catch (error) {
      console.error(`Error deleting ${section}:`, error);
      toast({
        title: "Delete failed",
        description: `There was an error deleting the ${section}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-psyched-darkBlue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Error Loading Profile</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Profile Not Found</h2>
          <p className="text-gray-500 mb-4">Unable to retrieve your profile information.</p>
          <Button 
            className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const desiredLocations = Array.isArray(profile.desired_locations) 
    ? profile.desired_locations 
    : (typeof profile.desired_locations === 'string' ? JSON.parse(profile.desired_locations || '[]') : []);
    
  const workTypes = Array.isArray(profile.work_types)
    ? profile.work_types
    : (typeof profile.work_types === 'string' ? JSON.parse(profile.work_types || '[]') : []);
    
  const evaluationTypes = Array.isArray(profile.evaluation_types)
    ? profile.evaluation_types 
    : (typeof profile.evaluation_types === 'string' ? JSON.parse(profile.evaluation_types || '[]') : []);

  console.log("Rendering profile with data:", profile);
  console.log("Profile picture URL:", profile.profile_picture_url);
  console.log("Experiences:", experiences);
  console.log("Educations:", educations);
  console.log("Certifications:", certifications);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-6">
          <ProfileHeader 
            profileData={profile} 
            onEditProfile={() => handleEditProfile('basic')}
            onProfilePictureUpdate={handleProfilePictureUpdate}
          />
          
          <ProfilePreferences 
            desiredLocations={desiredLocations}
            workTypes={workTypes}
            evaluationTypes={evaluationTypes}
            openToRelocation={profile.open_to_relocation}
          />
        </div>
        
        <div className="md:col-span-8">
          <ProfileDetails 
            experiences={experiences}
            educations={educations}
            certifications={certifications}
            profileData={profile}
            onEditItem={handleEditProfile}
            onDeleteItem={handleDeleteItem}
          />
        </div>
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveProfile}
          section={editSection}
          itemId={editItemId}
          profileData={profile}
          experienceData={editItemId ? experiences.find(exp => exp.id === editItemId) : undefined}
          educationData={editItemId ? educations.find(edu => edu.id === editItemId) : undefined}
          certificationData={editItemId ? certifications.find(cert => cert.id === editItemId) : undefined}
        />
      )}
    </div>
  );
};

export default Profile;
