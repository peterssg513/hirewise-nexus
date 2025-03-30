
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Certification } from '@/services/certificationService';
import { Experience, Education } from '@/services/psychologistSignupService';
import { fetchPsychologistProfile, createPsychologistProfile, updatePsychologistProfile } from '@/services/profileService';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import EditProfileModal from '@/components/profile/EditProfileModal';

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

  // Helper function to safely parse JSON data
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

  // Map between different property names
  const mapExperienceProperties = (exp: any): Experience => {
    return {
      id: exp.id || `exp-${Math.random().toString(36).substring(2, 9)}`,
      position: exp.position || exp.jobTitle || '',
      organization: exp.organization || exp.placeOfEmployment || '',
      description: exp.description || '',
      startDate: exp.startDate || exp.yearStarted || '',
      endDate: exp.endDate || exp.yearWorked || '',
      current: exp.current || false
    };
  };

  // Map between different education property names
  const mapEducationProperties = (edu: any): Education => {
    return {
      id: edu.id || `edu-${Math.random().toString(36).substring(2, 9)}`,
      institution: edu.institution || edu.schoolName || '',
      field: edu.field || edu.major || '',
      degree: edu.degree || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || ''
    };
  };
  
  // Process certification data
  const processCertificationData = (certData: any[]): Certification[] => {
    return certData.map(cert => ({
      id: cert.id || `cert-${Math.random().toString(36).substring(2, 9)}`,
      name: cert.name || cert.certificationName || '',
      issuingAuthority: cert.issuingAuthority || cert.issuer || '',
      expirationDate: cert.expirationDate || cert.endYear || '',
      startYear: cert.startYear || cert.date || '',
      endYear: cert.endYear || cert.expirationDate || '',
      description: cert.description || '',
      status: cert.status || 'pending',
      documentUrl: cert.documentUrl || cert.url || null,
    }));
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        setError("User not authenticated");
        return;
      }
      
      try {
        console.log("Fetching profile for user:", user.id);
        
        try {
          // First try to fetch existing profile
          const data = await fetchPsychologistProfile(user.id);
          console.log("Profile data retrieved:", data);
          setProfile(data);
          
          // Parse experience data
          if (data.experience) {
            const expData = typeof data.experience === 'string' 
              ? safeJsonParse(data.experience)
              : data.experience;
              
            setExperiences(Array.isArray(expData) 
              ? expData.map(mapExperienceProperties)
              : []);
          }
          
          // Parse education data
          if (data.education) {
            const eduData = typeof data.education === 'string' 
              ? safeJsonParse(data.education)
              : data.education;
              
            setEducations(Array.isArray(eduData) 
              ? eduData.map(mapEducationProperties)
              : []);
          }
          
          // Parse certification data
          if (data.certification_details) {
            let certData: any[] = [];
            
            if (typeof data.certification_details === 'string') {
              certData = safeJsonParse(data.certification_details);
            } else if (Array.isArray(data.certification_details)) {
              certData = data.certification_details as any[];
            } else if (typeof data.certification_details === 'object') {
              certData = Object.values(data.certification_details as object);
            }
            
            setCertifications(processCertificationData(certData));
          }
          
        } catch (profileError) {
          console.error('Error fetching profile, trying to create new profile:', profileError);
          
          // If profile doesn't exist yet, create it
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
  };

  const handleSaveProfile = async (updatedData: any) => {
    if (!user) return;

    try {
      setLoading(true);
      
      let updatedProfile = { ...profile };
      
      // Handle different sections
      if (editSection === 'basic') {
        updatedProfile = {
          ...updatedProfile,
          ...updatedData,
        };
      } else if (editSection === 'experience') {
        let updatedExperiences = [...experiences];
        
        if (editItemId) {
          // Update existing experience
          updatedExperiences = updatedExperiences.map(exp => 
            exp.id === editItemId ? { ...exp, ...updatedData } : exp
          );
        } else {
          // Add new experience
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
          // Update existing education
          updatedEducations = updatedEducations.map(edu => 
            edu.id === editItemId ? { ...edu, ...updatedData } : edu
          );
        } else {
          // Add new education
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
          // Update existing certification
          updatedCertifications = updatedCertifications.map(cert => 
            cert.id === editItemId ? { ...cert, ...updatedData } : cert
          );
        } else {
          // Add new certification
          updatedCertifications.push({
            ...updatedData,
            id: `cert-${Math.random().toString(36).substring(2, 9)}`,
            status: 'pending'
          });
        }
        
        updatedProfile.certification_details = JSON.stringify(updatedCertifications);
        setCertifications(updatedCertifications);
      }
      
      // Save to database
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
      
      // Save to database
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

  console.log("Rendering profile with data:", profile);
  console.log("Profile picture URL:", profile.profile_picture_url);
  console.log("Experiences:", experiences);
  console.log("Educations:", educations);
  console.log("Certifications:", certifications);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row gap-6 items-start">
        <ProfileHeader 
          profileData={profile} 
          onEditProfile={() => handleEditProfile('basic')} 
        />
        
        <ProfileDetails 
          experiences={experiences}
          educations={educations}
          certifications={certifications}
          profileData={profile}
          onEditItem={handleEditProfile}
          onDeleteItem={handleDeleteItem}
        />
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
