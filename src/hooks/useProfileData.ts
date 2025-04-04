import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getPsychologistProfile, createProfile } from '@/services/profileService';
import { Experience, Education } from '@/services/psychologistSignupService';
import { Certification } from '@/services/certificationService';

// Helper function to safely parse JSON
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

// Helper function to map experience properties
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

// Helper function to map education properties
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

// Helper function to process certification data
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

interface ProfileDataState {
  profile: any;
  loading: boolean;
  error: string | null;
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
  refreshProfile: () => Promise<void>;
}

export const useProfileData = (): ProfileDataState => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      setError("User not authenticated");
      return;
    }
    
    try {
      console.log("Fetching profile for user:", user.id);
      
      try {
        const data = await getPsychologistProfile(user.id);
        console.log("Profile data retrieved:", data);
        
        // Ensure profile_picture_url is correctly set
        if (data && !data.profile_picture_url) {
          console.log("No profile picture found in data - checking for one in signup data");
          // Try to find profile picture from signup data if it exists
          if (data.signup_completed && data.signup_progress >= 2) {
            console.log("User has completed profile setup, checking for profile picture");
            // The user has completed at least the profile picture upload step
            const { data: signupData, error: signupError } = await supabase
              .from('psychologists')
              .select('profile_picture_url')
              .eq('user_id', user.id)
              .single();
              
            if (!signupError && signupData?.profile_picture_url) {
              console.log("Found profile picture from signup:", signupData.profile_picture_url);
              data.profile_picture_url = signupData.profile_picture_url;
            }
          }
        }
        
        console.log("Final profile picture URL:", data.profile_picture_url);
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
        
        const newProfile = await createProfile(user.id, 'psychologist');
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
  }, [user]);

  return {
    profile,
    loading,
    error,
    experiences,
    educations,
    certifications,
    refreshProfile: fetchProfile
  };
};
