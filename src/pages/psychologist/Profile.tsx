
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Certification } from '@/services/certificationService';
import { Experience, Education } from '@/services/psychologistSignupService';
import { fetchPsychologistProfile, createPsychologistProfile } from '@/services/profileService';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      id: exp.id,
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
      id: edu.id,
      institution: edu.institution || edu.schoolName || '',
      field: edu.field || edu.major || '',
      degree: edu.degree || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || ''
    };
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
            const expData = safeJsonParse(data.experience);
            setExperiences(expData.map(mapExperienceProperties));
          }
          
          // Parse education data
          if (data.education) {
            const eduData = safeJsonParse(data.education);
            setEducations(eduData.map(mapEducationProperties));
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
            
            setCertifications(certData as unknown as Certification[]);
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
  
  const handleEditProfile = () => {
    navigate('/psychologist-signup');
    toast({
      title: 'Edit Profile',
      description: 'You can update your profile information here.',
    });
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
            onClick={() => navigate('/psychologist-signup')}
          >
            Complete Your Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row gap-6 items-start">
        <ProfileHeader 
          profileData={profile} 
          onEditProfile={handleEditProfile} 
        />
        
        <ProfileDetails 
          experiences={experiences}
          educations={educations}
          certifications={certifications}
        />
      </div>
    </div>
  );
};

export default Profile;
