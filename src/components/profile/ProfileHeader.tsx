
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, Edit2, MapPin, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import ProfilePictureModal from './ProfilePictureModal';
import { supabase } from '@/integrations/supabase/client';

interface ProfileHeaderProps {
  profileData: any;
  onEditProfile: () => void;
  onProfilePictureUpdate: (url: string) => Promise<void>;
}

const ProfileHeader = ({ profileData, onEditProfile, onProfilePictureUpdate }: ProfileHeaderProps) => {
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(profileData.profile_picture_url);

  useEffect(() => {
    // Update profile picture state when profileData changes
    setProfilePicture(profileData.profile_picture_url);
    
    // If no picture is set and we have a user ID, try to fetch it directly
    if (!profileData.profile_picture_url && profileData.user_id) {
      const fetchProfilePicture = async () => {
        try {
          const { data, error } = await supabase
            .from('psychologists')
            .select('profile_picture_url')
            .eq('user_id', profileData.user_id)
            .single();
            
          if (!error && data?.profile_picture_url) {
            console.log("Found profile picture URL:", data.profile_picture_url);
            setProfilePicture(data.profile_picture_url);
          }
        } catch (err) {
          console.error("Error fetching profile picture:", err);
        }
      };
      
      fetchProfilePicture();
    }
  }, [profileData]);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Ensure we're displaying the correct name from the profile data
  const displayName = profileData.profiles?.name || profileData.name || "New Psychologist";

  const handleProfilePictureUpdate = async (url: string) => {
    setProfilePicture(url);
    await onProfilePictureUpdate(url);
  };

  return (
    <motion.div 
      className="w-full mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6">
        <div className="flex flex-col items-center">
          <div className="relative group mb-4">
            <Avatar className="h-24 w-24 border-2 border-gray-200">
              <AvatarImage 
                src={profilePicture} 
                alt={displayName} 
              />
              <AvatarFallback className="bg-psyched-lightBlue text-white text-xl">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white shadow hover:bg-gray-100"
              onClick={() => setIsPictureModalOpen(true)}
            >
              <Edit2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-psyched-darkBlue">
              {displayName}
            </h2>
            
            {profileData.status === "approved" && (
              <div className="flex items-center justify-center mt-1">
                <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                  <Check className="h-3 w-3 mr-1" />
                  Verified Professional
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full space-y-3 text-sm">
            {profileData.email && (
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-psyched-lightBlue" />
                <span>{profileData.email}</span>
              </div>
            )}
            
            {profileData.phone_number && (
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-psyched-yellow" />
                <span>{profileData.phone_number}</span>
              </div>
            )}
            
            {profileData.city && profileData.state && (
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-psyched-orange" />
                <span>{profileData.city}, {profileData.state}</span>
              </div>
            )}
          </div>
          
          <div className="w-full mt-6">
            <Button 
              onClick={onEditProfile}
              variant="outline" 
              className="w-full border-psyched-darkBlue text-psyched-darkBlue hover:bg-psyched-darkBlue hover:text-white"
            >
              Edit Contact Info
            </Button>
          </div>
        </div>
      </div>
      
      {isPictureModalOpen && (
        <ProfilePictureModal
          isOpen={isPictureModalOpen}
          onClose={() => setIsPictureModalOpen(false)}
          onSave={handleProfilePictureUpdate}
          currentPictureUrl={profilePicture}
          userId={profileData.user_id}
        />
      )}
    </motion.div>
  );
};

export default ProfileHeader;
