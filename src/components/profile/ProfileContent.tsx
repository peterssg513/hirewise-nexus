
import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import ProfilePreferences from '@/components/profile/ProfilePreferences';
import { Experience, Education } from '@/services/psychologistSignupService';
import { Certification } from '@/services/certificationService';

interface ProfileContentProps {
  profile: any;
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
  onEditProfile: (section: 'basic' | 'experience' | 'education' | 'certification', itemId?: string) => void;
  onProfilePictureUpdate: (url: string) => Promise<void>;
  onDeleteItem: (section: 'experience' | 'education' | 'certification', itemId: string) => Promise<void>;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  profile,
  experiences,
  educations,
  certifications,
  onEditProfile,
  onProfilePictureUpdate,
  onDeleteItem
}) => {
  // Process profile data for preferences
  const desiredLocations = Array.isArray(profile.desired_locations) 
    ? profile.desired_locations 
    : (typeof profile.desired_locations === 'string' ? JSON.parse(profile.desired_locations || '[]') : []);
    
  const workTypes = Array.isArray(profile.work_types)
    ? profile.work_types
    : (typeof profile.work_types === 'string' ? JSON.parse(profile.work_types || '[]') : []);
    
  const evaluationTypes = Array.isArray(profile.evaluation_types)
    ? profile.evaluation_types 
    : (typeof profile.evaluation_types === 'string' ? JSON.parse(profile.evaluation_types || '[]') : []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-4 space-y-6">
          <ProfileHeader 
            profileData={profile} 
            onEditProfile={() => onEditProfile('basic')}
            onProfilePictureUpdate={onProfilePictureUpdate}
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
            onEditItem={onEditProfile}
            onDeleteItem={onDeleteItem}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
